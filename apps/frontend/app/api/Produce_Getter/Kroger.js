const axios = require('axios');
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
        console.error("Error fetching auth token:", error);
    }
}

// Function to get location ID
async function getLocationId(zipCode) {
    try {
        const response = await axios.get(`https://api.kroger.com/v1/locations?filter.zipCode.near=${zipCode}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        return response.data.data[0].locationId;
    } catch (error) {
        console.error("Error fetching location ID:", error);
    }
}

// Function to get milk products
async function getProducts(brand, searchTerm, locID, authToken) {
    
    try {
        const response = await axios.get(`https://api.kroger.com/v1/products?filter.brand=${brand}&filter.term=${searchTerm}&filter.locationId=${locID}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        console.log("Milk Products:", response.data);
        let availableProducts = response.data.data.filter(item => {
            return item.items.some(subItem => subItem.inventory.stockLevel != "TEMPORARILY_OUT_OF_STOCK");
        })
        return availableProducts;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}""

export async function Krogers(zipCode, searchTerm, locID, authToken) {
    console.log("Starting main execution...");
    let authToken = await getAuthToken();
    if (!authToken) {
        console.error("Failed to obtain auth token.");
        return;
    }
    let locID = await getLocationId(zipCode);
    if (!locID) {
        console.error("No valid location found.");
        return;
    }
    await getProducts(brand, searchTerm, locID, authToken);
    console.log("Finished main execution.");
}
