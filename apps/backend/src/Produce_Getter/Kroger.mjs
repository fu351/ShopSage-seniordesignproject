import 'dotenv/config';
import axios from 'axios';

// Add your Kroger API credentials
const CLIENT_ID = "shopsage-243261243034246d665a464b4d485545587677665835526a74466a2f2e704b6d6c4d4e43702f7758624341476a6d497947637268486441527250624f2908504214587086555";
const CLIENT_SECRET = "ZoCeBUn1HvoveqtZQA4h1ji4wFh_dpe3uWLynFiO";

// Helper function to encode Base64
function encodeBase64(clientId, clientSecret) {
    return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
}

// Print the Base64-encoded authorization string
const encodedAuth = encodeBase64(CLIENT_ID, CLIENT_SECRET);
//console.log("Encoded Authorization Header:", "Basic " + encodedAuth);

// Function to get the Auth Token
async function getAuthToken() {
    try {
        const requestBody = "grant_type=client_credentials&scope=product.compact";

        const response = await axios.post(
            "https://api.kroger.com/v1/connect/oauth2/token",
            requestBody,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + encodeBase64(CLIENT_ID, CLIENT_SECRET)
                }
            }
        );
        //console.log("Auth token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Full error object:", error);
        if (error.response) {
            console.error("Error fetching auth token:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);

        } else if (error.request) {
            console.error("Error fetching auth token, no response received:", error.request);
        } else {
            console.error("Error fetching auth token:", error.message);
        }
        throw new Error("Error fetching auth token:", error);
    }
}

// Function to get location ID
async function getLocationId(zipCode, authToken) {
    try {
        const response = await axios.get(`https://api.kroger.com/v1/locations?filter.zipCode.near=${zipCode}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log("Location API Response:", response.data); // Debugging

        if (!response.data || !response.data.data || response.data.data.length === 0) {
            throw new Error(`No location found for ZIP: ${zipCode}`);
        }

        return response.data.data[0].locationId;
    } catch (error) {
        console.error("Error fetching location ID:", error.response?.data || error.message);
        throw new Error("Error fetching location ID.");
    }
}

// Function to get products
async function getProducts(brand = '', searchTerm, locationId, authToken) {
    try {
        console.log(`Fetching products for: ${searchTerm} at location ${locationId}`);

        const url = `https://api.kroger.com/v1/products`
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
        const params = {
            "filter.term": searchTerm,
            "filter.locationId": locationId,
            ...(brand && { "filter.brand": brand }) // Only include brand if it's provided
        }
        console.log(url)
        console.log(headers)
        console.log(params)

        const response = await axios.get(`https://api.kroger.com/v1/products`, {
            params: {
                "filter.term": searchTerm,
                "filter.locationId": locationId
                // ...(brand && { "filter.brand": brand }) // Only include brand if it's provided
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log("Product API Response:", JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.data || response.data.data.length === 0) {
            console.warn("No products found for search term:", searchTerm);
            return []; // Return empty array instead of undefined
        }

        // Filter out products that are out of stock
        const availableProducts = response.data.data.filter(item =>
            item.items && item.items.some(subItem => subItem.inventory?.stockLevel !== "TEMPORARILY_OUT_OF_STOCK")
        );

        if (availableProducts.length === 0) {
            console.warn("No available (in-stock) products found.");
            return [];
        }

        // Sort by price (lowest first)
        availableProducts.sort((a, b) => {
            const priceA = a.items[0]?.price?.regular || Number.MAX_VALUE;
            const priceB = b.items[0]?.price?.regular || Number.MAX_VALUE;
            return priceA - priceB;
        });

        console.log("Filtered and Sorted Products:", availableProducts);
        return availableProducts;

    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw new Error("Error fetching products.");
    }
}

async function Krogers(zipCode = 47906, searchTerm, brand = '') {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Failed to obtain auth token.");
    }

    const locationId = await getLocationId(zipCode, token);
    if (!locationId) {
        throw new Error("No valid location found.");
    }

    const products = await getProducts(brand, searchTerm, locationId, token);
    return products;
}

export { Krogers };