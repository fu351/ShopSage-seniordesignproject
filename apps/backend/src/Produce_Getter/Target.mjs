import axios from 'axios';
// Add this import for decoding HTML entities
import he from 'he';

// Function to fetch products from Target API
export async function getTargetProducts(keyword, zipCode, sortBy = "price") {
    const baseUrl = "https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2";
    const params = {
        key: "9f36aeafbe60771e321a7cc95a78140772ab3e96",
        channel: "WEB",
        count: 10,
        default_purchasability_filter: "true",
        include_dmc_dmr: "true",
        include_sponsored: "true",
        include_review_summarization: "false",
        keyword,
        new_search: "true",
        offset: 0,
        page: `/s/${encodeURIComponent(keyword)}`,
        platform: "desktop",
        pricing_store_id: 3309,
        scheduled_delivery_store_id: 3309,
        spellcheck: "true",
        store_ids: "3309,1762,111,1366,1063",
        useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        visitor_id: "019669F54C3102019409F15469E30DAF",
        zip: zipCode
    };

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
    };

    try {
        const response = await axios.get(baseUrl, { params, headers });
        const products = response.data.data.search.products;
        const cleanedProducts = products.map(product => {
            const price = product.price?.current_retail || null;
            const unit = parseFloat(product.price?.formatted_unit_price?.split(" ")[0]) || Infinity;
            const pricePerUnit = price && unit ? (price / unit).toFixed(2) : Infinity;

            return {
                title: he.decode(product.item?.product_description?.title || ""), // Decode HTML entities
                brand: product.item?.primary_brand?.name || "",
                price,
                priceFormatted: product.price?.formatted_current_price || "",
                unit,
                pricePerUnit,
                unitPriceSuffix: product.price?.formatted_unit_price_suffix || "",
                bulletDescriptions: product.item?.product_description?.bullet_descriptions || [],
                softBullets: product.item?.product_description?.soft_bullets?.bullets || [],
                provider: "Target",
                image_url: product.item?.enrichment?.images?.primary_image_url || "",
                category: product.item?.product_classification.item_type.name || "",
                id: product.tcin || "",
            };
        });

        cleanedProducts.sort((a, b) => (a[sortBy] ?? Infinity) - (b[sortBy] ?? Infinity));
        // console.log("Target products fetched successfully:", products);
        // console.log("Target products fetched successfully:", cleanedProducts);
        return cleanedProducts;
    } catch (error) {
        console.error("Error fetching Target products:", error.response?.data || error.message);
        throw new Error("Failed to fetch Target products.");
    }
}
