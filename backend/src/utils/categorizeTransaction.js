import { CATEGORY_RULES } from "./categoryUtils.js";

export function categorizeTransaction(vendor){
    if(!vendor) return "Others";

    const upperVendor = vendor.toUpperCase();

    for (const rule of CATEGORY_RULES){// I assume that this is just a for-each loop
        for(const keyword of rule.keywords){
            if(upperVendor.includes(keyword)){
                return rule.category;
            }
        }
    }

    return "Others";
}