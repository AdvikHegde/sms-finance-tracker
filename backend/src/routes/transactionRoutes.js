// What kind of modularity are we going for here?
// We are separating files based on end-points and for each-point, all of it's routes will be within the same file

import express from "express";

import { Transaction } from "../models/schemas.js";

const router = express.Router();


// Get all of the transactions inside of the database
router.get("/", async (req,res) => {
    try{
        const transactions = await Transaction.find().sort({createdAt : -1});
        // The -1 ensures that the docs i.e the transactions are sorted in latest-to-oldest order 

        res.json(transactions);
    }
    catch(error){
        console.log(error);// For the developer (detailed error)
        res.json({error:error.message});// For the front-end (just the error message)
    }
})


// Get weekly or monthly transactions from inside the database, we will depend on the parameter that will be passed in the URL for this
router.get("/summary", async (req,res)=> {
    try{
        const { type } = req.query;// QUERY PARAMETER : used for filtering a request
        let groupFormat;
        // Can't this be a const as well, why not?

        if(type === "daily"){
            groupFormat = "$date";
            // All trnasactions on a given date
        }
        else if(type === "monthly"){
            groupFormat = {
                $substr : ["$date" , 3, 5]
                // If the date is 12-12-2026, it extracts the month substr which is the 3rd and 4th char which will be the month characters
            };
        }
        else{
            return res.json({error : "Invalid summary type"})
        }

        const summary = await Transaction.aggregate([
            {
                $group : {
                    _id : groupFormat,// groups will be on the basis of id which is on the basis of groupFormat (daily or weekly or monthly)
                    total : { $sum : "$amount" },// total amount for each group
                    count : { $sum : 1},// total snumber of transactions in each group
                }
            },
            { $sort : {_id : -1}}
        ]);
        // In this section, $sum, $group, $sort are all inbuilt functions that are used using this $ prefix syntax
        // Right now, we simply group the transactions on a daily or a monthly basis, so no filtering is being done, we can do that later

        res.json(summary);
    }
    catch(error){
        console.log(error);
        res.json({message: error.message});
    }
})


// Update category of a transaction if auto-categorize fails or is incorrect from the front-end
router.patch("/:id/category", async (req,res)=> {
    // What is id here? 
    // Is it a dynamic URL parameter, is it the same as what we did when passing ? type = "daily" or "monthly" in the URL 
    // If they are different, what is it ?
    try{
        const {id} = req.params;// PATH/URL PARAMETERS : the parameter is an important part of the URL, not just for filtering
        const {category} = req.body;

        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        const updated = await Transaction.findByIdAndUpdate(
            id,
            {category},
            {new:true}
        );

        if (!updated) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({
            success: true,
            transaction: updated
        });
    }
    catch(error){
        console.log(error);
        res.json({error : error.message});
    }
})

export default router;