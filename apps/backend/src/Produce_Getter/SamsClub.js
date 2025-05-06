import 'dotenv/config';
import axios from 'axios';

// Utility function to handle timeouts
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    );
    return Promise.race([promise, timeout]);
};

// Function to fetch store locations
async function getLocations(zipCode) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.samsclub.com/api/node/vivaldi/browse/v2/clubfinder/list`,
            params: {
                distance: 100,
                nbrOfStores: 20,
                singleLineAddr: zipCode
            },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        };

        const response = await withTimeout(axios.request(config), 5000); // Timeout after 5 seconds
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error.response?.data || error.message);
        throw new Error("Failed to fetch Sam's Club locations.");
    }
}

// Function to fetch products from Sam's Club
async function SamsClubs(zipCode = 47906, searchTerm) {
    let location;
    try {
        const location_data = await getLocations(zipCode);

        if (!location_data?.data || location_data.data.length === 0) {
            throw new Error(`No Sam's Club locations found for ZIP code: ${zipCode}`);
        }

        location = {
            locationId: location_data.data[0].id,
            name: location_data.data[0].name,
            Address: location_data.data[0].address?.address1 || "Unknown"
        };
    } catch (error) {
        console.error("Location lookup failed:", error.message);
        throw new Error("Location lookup failed. Please try a different ZIP code.");
    }

    try {
        const response = await withTimeout(
            axios.get(`https://www.samsclub.com/api/node/vivaldi/browse/v2/products/search`, {
                params: {
                    "sourceType": 1,
                    "limit": 45,
                    "clubId": location["locationId"],
                    "searchTerm": searchTerm,
                    "br": true,
                    "secondaryResults": 2,
                    "wmsponsored": 1,
                    "wmsba": true,
                    "banner": true,
                    "wmVideo": true
                },
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
                }
            }),
            5000 // Timeout after 5 seconds
        );

        const Products = response.data.payload.records;

        if (!Products || Products.length === 0) {
            console.warn("No products found for search term:", searchTerm);
            return [];
        }

        // Translate into shared format
        const details = Products.map(p => ({
            id: p.productId,
            name: p.descriptors?.name || null,
            brand: "N/A",
            description: p.descriptors?.productdescription || null,
            category: p.category?.name || null,
            price: p.skus?.[0]?.clubOffer?.price?.finalPrice?.amount || null,
            unit: "each",
            pricePerUnit: "N/A",
            image_url: `https://scene7.samsclub.com/is/image/samsclub/${p.skus?.[0]?.assets?.image || ''}`,
            location: location["name"]
        }));

        // Sort by price and return the 10 cheapest options
        const sortedDetails = details
            .filter(item => item.price !== null) // Filter out items with null price
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);

        return sortedDetails;
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw new Error("Failed to fetch products from Sam's Club.");
    }
}

export { SamsClubs };