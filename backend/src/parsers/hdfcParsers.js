import { normalizeDate } from "../utils/dateUtils.js";

export function parseHDFCSMS(message) {
    // Split and remove empty lines to ensure indexing is consistent
    const lines = message.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const data = {};

    // LINE 0: Sent Rs.10.00
    const amountMatch = lines[0].match(/Rs\.(\d+\.?\d*)/);
    if (amountMatch) {
        data.amount = parseFloat(amountMatch[1]);
    }

    // LINE 1: From HDFC Bank A/C *7003
    // Improved Regex to handle the "*" and capture bank name + account
    const bankMatch = lines[1].match(/From\s(.+?)\sA\/C\s+\*(\d+)/);
    if (bankMatch) {
        data.bank = bankMatch[1]; // HDFC Bank
        data.accountLast4 = bankMatch[2]; // 7003
    }

    // LINE 2: To Mr SAHIL DINESH MOTIRAMANI
    const toMatch = lines[2].match(/To\s(.+)/);
    if (toMatch) {
        // Removes "Mr " (case insensitive) and trims whitespace
        data.vendor = toMatch[1].replace(/^Mr\s+/i, '').trim();
    }

    // LINE 3: On 08/05/25
    const dateMatch = lines[3].match(/On\s(\d{2}\/\d{2}\/\d{2})/);
    if (dateMatch) {
        const normalized = normalizeDate(dateMatch[1]);
        data.date = normalized.date;
        data.day = normalized.day;
        data.month = normalized.month;
        data.year = normalized.year;
    }

    // LINE 4: Ref 104456867967
    const refMatch = lines[4].match(/Ref\s(\d+)/);
    if (refMatch) {
        data.referenceId = refMatch[1];
    }

    data.rawMessage = message;
    return data;
}