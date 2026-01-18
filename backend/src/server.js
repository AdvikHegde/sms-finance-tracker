// This file listens for POST requests from the Mobile Application and stores them in MongoDB Atlas
// DB: sms-forwarder
// Collections: rawsms, transactions
// Flow: Phone → Node API → MongoDB Atlas → Node API → React Dashboard

import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";

import { RawSMS, Transaction } from "./models/schemas.js";
import { parseSMS } from "./parsers/index.js";
import { categorizeTransaction } from "./utils/categorizeTransaction.js";

dotenv.config();

const app = express();

/*
 🔴 IMPORTANT CHANGE:
 Render assigns the PORT dynamically.
 You must use process.env.PORT.
 */
const PORT = process.env.PORT || process.env.RENDER_PORT;
// This tells the code: 
// 1. Check if Render gave us a Port (process.env.PORT)
// 2. If not, check if we have a custom RENDER_PORT
// This is very confusing to be honest, we havent uploaded .env to render so render doesnt have access to it
// For render process.env.port is it's default port of 10000 so even though we use process.env.port, it will be = 10000 and not 3000

// Middleware
app.use(express.json());

// Store received SMS messages (In-memory history)
let smsHistory = [];

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "running",
    service: "SMS Forwarder Server",
    total_messages: smsHistory.length,
  });
});

/**
 * Receive SMS from Android
 */
app.post("/sms", async (req, res) => {
  try {
    console.log("📨 Received SMS from Android:", req.body);

    const { sender, message, timestamp } = req.body;

    // Validate required fields
    if (!sender || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sender, message",
      });
    }

    // Keep history (optional, for debugging)
    smsHistory.push(req.body);

    // 1. Save RAW SMS immediately
    const rawEntry = await RawSMS.create({
      sender: sender,
      text: message,
      receivedAt: new Date(),
    });

    console.log("✅ Saved raw SMS:", rawEntry._id);

    // 2. Try to parse SMS
    try {
      const parsedData = parseSMS(message);

      if (parsedData) {
        // 3. Categorize transaction
        parsedData.category = categorizeTransaction(parsedData.vendor);

        // 4. Generate unique hash to prevent duplicates
        const hash = crypto
          .createHash("sha256")
          .update(
            parsedData.amount +
              parsedData.referenceId +
              parsedData.date.toISOString()
          )
          .digest("hex");

        // 5. Save parsed transaction
        const transaction = await Transaction.create({
          ...parsedData,
          hash,
          transactionType: "debit", // You can improve this later
          rawId: rawEntry._id,
        });

        console.log("✅ Parsed and Saved Transaction:", transaction._id);

        return res.status(200).json({
          success: true,
          message: "SMS received and parsed",
          rawId: rawEntry._id,
          transactionId: transaction._id,
        });
      }
    } catch (parseError) {
      console.log("⚠️ Could not parse SMS:", parseError.message);
      // Raw SMS is still safely stored
    }

    // Parsing failed but raw SMS saved
    res.status(200).json({
      success: true,
      message: "SMS received (parsing failed)",
      rawId: rawEntry._id,
    });
  } catch (err) {
    console.error("❌ Error processing SMS:", err);

    // Duplicate transaction
    if (err.code === 11000) {
      return res.status(200).json({
        success: true,
        status: "duplicate",
        message: "Transaction already recorded",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/*
 🔴 IMPORTANT CHANGE:
 Do NOT bind to 0.0.0.0 manually on Render.
 Just use app.listen(PORT)
 */
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 SMS Forwarder Server Running on Render");
  console.log("=".repeat(60));
  console.log(`🌍 Listening on port: ${PORT}`);
  console.log("📱 Waiting for SMS from Android app...");
  console.log("=".repeat(60) + "\n");
});
