require('dotenv').config();
const axios = require('axios');
// Add your Kroger API credentials
const CLIENT_ID = process.env.KROGER_CLIENT_ID;
const CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET;
console.log(CLIENT_ID, CLIENT_SECRET);
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
        return response.data.access_token;
    } catch (error) {
        // console.error("Error fetching auth token:", error);
        return null;
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
        // console.error("Error fetching location ID:", error);
        return null;
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
        // console.error("Error fetching products:", error);
        return [];
    }
}

async function Krogers(zipCode = 47906, searchTerm, brand = '') {
    const token = await getAuthToken();
    if (!token) {
        // console.error("Failed to obtain auth token.");
        return [];
    }

    const locationId = await getLocationId(zipCode, token);
    if (!locationId) {
        // console.error("No valid location found.");
        return [];
    }

    const products = await getProducts(brand, searchTerm, locationId, token);
    return products;
}

module.exports = { Krogers };