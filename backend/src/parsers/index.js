import { parseHDFCSMS } from "./hdfcParsers.js";

export function parseSMS(message){
    if(message.includes("From HDFC Bank")){
        return parseHDFCSMS(message);
    }
    throw new Error("Unsupported SMS Format");
    // I was under the impression that you needed a try-catch block to throw errors, did not know you could throw errors just like this
}