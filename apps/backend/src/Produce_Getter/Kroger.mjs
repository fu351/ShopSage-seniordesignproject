import 'dotenv/config';
import axios from 'axios';

// Add your Kroger API credentials
const CLIENT_ID = process.env.KROGER_CLIENT_ID;
const CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET;

// Helper function to encode Base64
function encodeBase64(clientId, clientSecret) {
    return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
}

// Function to get the Auth Token
async function getAuthToken() {
    try {
        const response = await axios.post(
            "https://api.kroger.com/v1/connect/oauth2/token",
            new URLSearchParams({
                "grant_type": "client_credentials",
                "scope": "product.compact"
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + encodeBase64(CLIENT_ID, CLIENT_SECRET)
                }
            }
        );
        console.log("Auth token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching auth token:", error.response ? error.response.data : error.message);
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
        return response.data.data[0].locationId;
    } catch (error) {
        console.error("Error fetching location ID:", error.response ? error.response.data : error.message);
        throw new Error("Error fetching location ID:", error);
    }
}

// Function to get products
async function getProducts(brand = '', searchTerm, locationId, authToken) {
    try {
        const response = await axios.get(`https://api.kroger.com/v1/products?filter.brand=${brand}&filter.term=${searchTerm}&filter.locationId=${locationId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const availableProducts = response.data.data.filter(item => 
            item.items.some(subItem => subItem.inventory.stockLevel !== "TEMPORARILY_OUT_OF_STOCK")
        );
        
        return availableProducts;
    } catch (error) {
        console.error("Error fetching products:", error.response ? error.response.data : error.message);
        throw new Error("Error fetching products:", error);
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