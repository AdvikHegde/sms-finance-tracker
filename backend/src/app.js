// app.js
import express from "express";
// used to create and start our express application
import cors from "cors";
// enables cross-origin-resource-scripting allowing servers on different ports to communicate without being blocked
// is used as an ODM ( Object Data Modelling ) making database operations easy to perform by abstracting common CRUD operations

const app = express();
// creating our express application instance calle "app"

app.use(cors());

// app.use(express.json())
// app.use() is used to register middleware, ensures that the arguments specified are enforced for every request-response cycle?
// Here, we ensure that our application will make use of cors enabling cross-port communication and we parse the incoming request data which is of json wformat, which is provided by the express middleware

// It receives data sent via frontend requests with the content-type as "application/json", so it accordingly converts the raw binary stream of data into the JSON type and attaches it to the req body for easy access

// Route Imports - This route will be useful for the front-end to fetch data later
// import transactionRoutes from "./routes/transactionRoutes.js";
// app.use("/api/transactions",transactionRoutes);

// 1. Tell Express to catch raw text if the caller says it's "application/json"
app.use(express.text({ type: 'application/json' }));

// 2. Add a custom middleware to handle BOTH regular JSON and "Broken" MacroDroid JSON
app.use((req, res, next) => {
    if (typeof req.body === 'string' && req.body.trim().startsWith('{')) {
        try {
            // Try to parse normally first
            req.body = JSON.parse(req.body);
        } catch (e) {
            try {
                // If it fails (because of newlines), fix the newlines and try again
                const fixedJson = req.body.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                req.body = JSON.parse(fixedJson);
            } catch (finalError) {
                return res.status(400).json({ error: "Invalid JSON format" });
            }
        }
    }
    next();
});

app.listen(process.env.PORT, () => console.log("Backend server running on the port 3000!"))
// Ensuring that the application is listening for requests directed to it on the specified port of 3000