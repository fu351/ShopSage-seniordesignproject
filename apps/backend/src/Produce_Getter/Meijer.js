import 'dotenv/config';
import axios from 'axios';

async function getLocations(zipCode) {
    try {
      const url = `https://www.meijer.com/bin/meijer/store/search?locationQuery=${zipCode}&radius=20`;
      
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url,
        headers: {
          'accept': 'application/json, text/plain, */*',
          'referer': 'https://www.meijer.com/shopping/store-finder.html',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
          // Avoid including cookies unless absolutely necessary; it may violate TOS
        }
      };
  
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error.message);
      return null;
    }
  }

async function Meijers(zipCode=47906, searchTerm) {
    /*const location_data = await getLocations(zipCode);
    const location = {
        "locationId": location_data.pointsOfService[0].mfcStoreId,
        "name": location_data.pointsOfService[0].displayName,
        "Address": location_data.pointsOfService[0].address
    }*/

    //console.log(location["locationId"]);
    //console.log(location["name"]);

    try {
        const response = await axios.get(`https://ac.cnstrc.com/search/${encodeURIComponent(searchTerm)}`, {
            params: {
                "c": "ciojs-client-2.62.4",
                "key": "key_GdYuTcnduTUtsZd6",
                "i": "60163d8f-bfab-4c6d-9117-70f5f2d9f534",
                "s": 4,
                "us": "web",
                "page": 1,
                "num_results_per_page": 52,
                "filters[availableInStores]": 319,
                "sort_by": "relevance",
                "sort_order": "descending",
                "fmt_options[groups_max_depth]": 3,
                "fmt_options[groups_start]": "current",
                "_dt": 1746061217801
            },
            headers: { 
                'accept': '*/*', 
                'accept-language': 'en-US,en;q=0.9', 
                'origin': 'https://www.meijer.com', 
                'priority': 'u=1, i', 
                'referer': 'https://www.meijer.com/', 
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"', 
                'sec-ch-ua-mobile': '?0', 
                'sec-ch-ua-platform': '"Windows"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'cross-site', 
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        });

        //console.log(JSON.stringify(response.data));
        const Products = response.data.response.results

        // Translate into shared format
        const details = Products.map(p => ({
            id: p.data.id,
            name: p.data.summary || null,
            brand: "N/A",
            description: p.value || null,
            category: null,
            price: p.data.price || null,
            unit: p.data.productUnit || null,
            pricePerUnit: "N/A",
            image_url: p.data.image_url,
            location: "West Lafayette Meijer"
        }));

        // Sort by price and return the 10 cheapest options
        const sortedDetails = details
            .filter(item => item.price !== null) // filter out items with null price
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);
        
        //console.log(sortedDetails)
        return sortedDetails;
        
    }
    catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw new Error("Error fetching products.");
    }
}

export { Meijers };