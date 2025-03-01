import { Krogers } from "./Kroger.mjs"; // Adjust import path as needed
import 'dotenv/config';
async function run() {
    const zipCode = '47906'; // You can change this to any zip code you want
    const searchTerm = 'apple'; // You can change this to any search term you want
    const brand = ''; // You can specify a brand if needed

    const products = await Krogers(zipCode, searchTerm, brand);
    for (const product of products) {
        console.log(product['upc'], product['brand'], product['description'], product['items']);
    }
}

run().catch(error => {
    console.error("Error running Krogers function:", error);
});