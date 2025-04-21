import axios from 'axios';

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
        page: `/s/${keyword}`,
        platform: "desktop",
        pricing_store_id: 3309,
        scheduled_delivery_store_id: 3309,
        spellcheck: "true",
        store_ids: "3309,1762,111,1366,1063",
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        visitor_id: "019603CB251B020186DC9640FEF301B9",
        zip: zipCode
    };

    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
    };

    try {
        const response = await axios.get(baseUrl, { params, headers });
        const products = response.data.data.search.products;
        const cleanedProducts = products.map(product => {
            const price = product.price?.current_retail || null;
            const unit = parseFloat(product.price?.formatted_unit_price?.split(" ")[0]) || null;
            const pricePerUnit = price && unit ? (price / unit).toFixed(2) : null;

            return {
                title: product.item?.product_description?.title || "",
                brand: product.item?.primary_brand?.name || "",
                price,
                priceFormatted: product.price?.formatted_current_price || "",
                unit,
                pricePerUnit,
                unitPriceSuffix: product.price?.formatted_unit_price_suffix || "",
                bulletDescriptions: product.item?.product_description?.bullet_descriptions || [],
                softBullets: product.item?.product_description?.soft_bullets?.bullets || [],
                provider: "Target"
            };
        });

        cleanedProducts.sort((a, b) => (a[sortBy] ?? Infinity) - (b[sortBy] ?? Infinity));
        return cleanedProducts;
    } catch (error) {
        console.error("Error fetching Target products:", error.response?.data || error.message);
        throw new Error("Failed to fetch Target products.");
    }
}
