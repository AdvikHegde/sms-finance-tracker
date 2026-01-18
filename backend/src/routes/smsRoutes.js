// // This file is now replaced by server.js 
// // The file server.js now listens fro POST requests made by the Mobile application, parses them and adds both the rawSMS and the parsedData to the MongoDB Atlas 

// import crypto from "crypto";
// import express from "express";

// import { Transaction } from "../models/schemas.js";
// import { parseSMS } from "../parsers/index.js";
// import { categorizeTransaction } from "../utils/categorizeTransaction.js";

// const router = express.Router();
// // Just like we create an express application, we can also create an express router, how do the two compare in function and usage?
// // The express router helps us navigate through the express application

// // This is backend-routing which handles HTTP requests, and handles data and logic when HTTP requests are made at specific end-points

// router.post("/", async (req,res) => {
//     try{
//         const {rawMessage} = req.body;
//         // What would be present inside of this variable of rawMessage? Depends on the content-type of the data it was sent

//         if (!rawMessage){
//             return res.status(400).json({ error : "SMS Content required!"})
//         }
//         // Error handling incase of an empty sms

//         const parsed = parseSMS(rawMessage);
//         // Parses the rawMessage according to out parsing function

//         parsed.category = categorizeTransaction(parsed.vendor);
//         // This step adds a new key-value pair to the object that is stored inside of the parsed const, consts are immutable meaning they cannot be re-assigned but the existing values can be modified

//         const hash = crypto.createHash("sha256").update(parsed.amount + parsed.referenceId + parsed.date.toISOString()).digest("hex");
//         const newTransaction = await Transaction.create({
//             ...parsed,
//             hash
//         })
//         // What does this line of code accomplish precisely?
//         // Use the crypto library to create unique hash for each transaction so that no transaction is duplicated in the DB
//         // The parser function parses all of the important data out of the SMS message and this code-block adds that data as individual fields to the DB as a unique transaction

//         res.json({success:true, newTransaction});
//         // We are used to using message as a key, what will using success do??
//         // Also btw, the messages sent using re.json() are only visible to clients so either the frontend, browsers or using tools like curl or postman, for developer's we make use of the console.log() 

//     }
//     catch(error){
//         console.log(error);
//         // Console the entire error in the backend terminal

//         if (err.code === 11000) {
//         return res.status(200).json({
//             status: "duplicate",
//             message: "Transaction already recorded"
//         });
//         }

//         res.status(500).json({error : error.message})
//         // Why use .json() here?
//         // Because it automatically converts data into the json format, sends data with the content-type of json and then closes the connection, without this, that data would have to be manually parsed as json in the front-end
//     }
// })

// export default router;
// // Export this router so that it can be mounted for use and recognized by the application