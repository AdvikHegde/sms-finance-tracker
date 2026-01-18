// Exports the mongoose model which is used by the other files
import mongoose from "mongoose";
import { atlasDB } from "../db/db.js";

const rawSchema = new mongoose.Schema({
  sender : String,
  text : String,
  receivedAt : Date
})

const transactionSchema = new mongoose.Schema({
  amount: Number,

  vendor: String,

  // Proper Date object (this is critical)
  date: {
    type: Date,
    required: true
  },

  // Pre-computed fields for faster queries
  day: String,     // Monday, Tuesday...
  month: Number,   // 1–12
  year: Number,    // 2025

  transactionType: String, // debit / credit
  bank: String,
  accountLast4: String,
  referenceId: String,

  category: {
    type: String,
    default: "Uncategorized"
  },

  rawMessage: String,

  hash: {
    type: String,
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const RawSMS = atlasDB.model("RawSMS", rawSchema);
export const Transaction =  atlasDB.model("Transaction", transactionSchema);

// The Schemas created using Mongoose are tied to a specific database connection which here is atlasDB so that the collections will be created inside of the atlasDB

// The name of the model will be converted into lowercase and become the name for the collection that will adopt this schema
