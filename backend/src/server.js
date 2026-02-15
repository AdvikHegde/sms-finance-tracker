// This file listens for POST requests from the Mobile Application and stores them in MongoDB Atlas
// DB: sms-forwarder
// Collections: rawsms, transactions
// Flow: Phone → Node API → MongoDB Atlas → Node API → React Dashboard

import dotenv from "dotenv";
import express from "express";


dotenv.config();

const app = express();

const PORT = process.env.PORT || process.env.RENDER_PORT;

// 🔴 NEW: Add text/plain parser BEFORE express.json()
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Keep JSON parser for backward compatibility (in case you want to switch back)
app.use(express.json());

// Add this after your body-parser/json middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("❌ Malformed JSON received. Skipping request.");
    return res.status(400).send({ success: false, message: "Invalid JSON format" });
  }
  next();
});

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
    console.log("\n" + "=".repeat(60));
    console.log("📨 NEW SMS RECEIVED");
    console.log("=".repeat(60));
    
    // Check if it's text/plain
    const contentType = req.headers['content-type'];
    console.log("Content-Type:", contentType);
    
    let sender, message, timestamp;
    
    if (contentType && contentType.includes('text/plain')) {
      // Extract from headers and body
      sender = req.headers['x-sms-sender'];
      timestamp = req.headers['x-sms-timestamp'];
      message = req.body; // This is the raw text with newlines!
      
      console.log("📱 Sender (from header):", sender);
      console.log("⏰ Timestamp (from header):", timestamp);
      console.log("📝 Message (raw text with newlines):");
      console.log("---START OF MESSAGE---");
      console.log(message);
      console.log("---END OF MESSAGE---");
      console.log("📏 Message length:", message.length);
      console.log("🔢 Number of lines:", message.split('\n').length);
      
      // Show each line separately
      console.log("\n📋 Line-by-line breakdown:");
      message.split('\n').forEach((line, index) => {
        console.log(`  Line ${index + 1}: "${line}"`);
      });
      
    } else {
      // OLD: JSON format (backward compatibility)
      sender = req.body.sender;
      message = req.body.message;
      timestamp = req.body.timestamp;
      
      console.log("📨 Using JSON format (old method)");
      console.log("📨 Data received:", { sender, message });
    }

    // Validate required fields
    if (!sender || !message) {
      console.log("❌ Validation failed - missing sender or message");
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sender, message",
      });
    }

    console.log("✅ Message validation passed!");
    
    // Keep history (optional, for debugging)
    smsHistory.push({ sender, message, timestamp });

    // 1. Save RAW SMS immediately
    console.log("\n💾 Saving raw SMS to database...");
    const rawEntry = await RawSMS.create({
      sender: sender,
      text: message,
      receivedAt: new Date(),
    });

    console.log("✅ Saved raw SMS with ID:", rawEntry._id);

    // 2. Try to parse SMS
    console.log("\n🔍 Attempting to parse SMS...");
    try {
      const parsedData = parseSMS(message);

      if (parsedData) {
        console.log("✅ SMS parsed successfully!");
        console.log("📊 Parsed data:", JSON.stringify(parsedData, null, 2));
        
        // 3. Categorize transaction
        parsedData.category = categorizeTransaction(parsedData.vendor);
        console.log("🏷️ Category assigned:", parsedData.category);

        // 4. Generate unique hash to prevent duplicates
        const hash = crypto
          .createHash("sha256")
          .update(
            parsedData.amount +
              parsedData.referenceId +
              parsedData.date.toISOString()
          )
          .digest("hex");
        
        console.log("🔐 Transaction hash generated:", hash.substring(0, 16) + "...");

        // 5. Save parsed transaction
        console.log("\n💾 Saving parsed transaction to database...");
        const transaction = await Transaction.create({
          ...parsedData,
          hash,
          transactionType: "debit", // You can improve this later
          rawId: rawEntry._id,
        });

        console.log("✅ Saved transaction with ID:", transaction._id);
        console.log("=".repeat(60) + "\n");

        return res.status(200).json({
          success: true,
          message: "SMS received and parsed",
          rawId: rawEntry._id,
          transactionId: transaction._id,
          parsedData: parsedData,
        });
      } else {
        console.log("⚠️ Parser returned null/undefined - SMS format not recognized");
      }
    } catch (parseError) {
      console.log("⚠️ Could not parse SMS:");
      console.log("   Error:", parseError.message);
      console.log("   Stack:", parseError.stack);
      // Raw SMS is still safely stored
    }

    // Parsing failed but raw SMS saved
    console.log("📝 SMS saved as raw only (parsing failed or not applicable)");
    console.log("=".repeat(60) + "\n");
    
    res.status(200).json({
      success: true,
      message: "SMS received (parsing failed)",
      rawId: rawEntry._id,
    });
    
  } catch (err) {
    console.error("\n❌ ERROR PROCESSING SMS:");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);
    console.log("=".repeat(60) + "\n");

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

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 SMS Forwarder Server Running on Render");
  console.log("=".repeat(60));
  console.log(`🌍 Listening on port: ${PORT}`);
  console.log("📱 Waiting for SMS from Android app...");
  console.log("=".repeat(60) + "\n");
});


// ## Key Changes Made:

// 1. **Added `express.text()` parser** to handle `text/plain` content
// 2. **Detects content type** and extracts data accordingly
// 3. **Extensive logging** to show:
//    - The complete message with newlines
//    - Number of lines received
//    - Each line separately
// 4. **Commented out DB logic** temporarily so we can test first
// 5. **Returns success immediately** with diagnostic info

// ## What to Do Next:

// 1. **Deploy this code to Render**
// 2. **Send a test SMS** from your phone
// 3. **Check Render logs** - you should see something like:
// ```
// ============================================================
// 📨 NEW SMS RECEIVED
// ============================================================
// Content-Type: text/plain
// 📱 Sender (from header): CP-HDFCBK-T
// ⏰ Timestamp (from header): 2026-02-15 14:30:45
// 📝 Message (raw text with newlines):
// ---START OF MESSAGE---
// _id
// 69917e772aa52f50dbb848cd
// sender
// "CP-HDFCBK-T"
// text
// Your account debited
// ---END OF MESSAGE---
// 📏 Message length: 89
// 🔢 Number of lines: 5

// 📋 Line-by-line breakdown:
//   Line 1: "_id"
//   Line 2: "69917e772aa52f50dbb848cd"
//   Line 3: "sender"
//   Line 4: ""CP-HDFCBK-T""
//   Line 5: "text"
//   Line 6: "Your account debited"
// ✅ Message received successfully!
