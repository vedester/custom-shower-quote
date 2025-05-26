// test-apify-translate.js
import { ApifyClient } from 'apify-client';

// Initialize Apify client
const client = new ApifyClient({
    token: 'apify_api_Gg0YpHFnS27xW2756YFO9E8VtMdZXP4hoCtB', // Use your token
});

const input = {
    text: "Welcome to our bakery!",
    source: "auto-detect",
    destination: "he", // Hebrew
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
    delay: 1,
    proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"]
    }
};

(async () => {
    try {
        console.log("Sending text to Apify for translation...");
        const run = await client.actor("rqTxjr25HwoSAQzC3").call({ input });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log("\n🎯 Translated Text:");
        console.log(items[0]?.translatedText || "No translation found.");
    } catch (error) {
        console.error("❌ Error occurred:", error.message);
    }
})();
