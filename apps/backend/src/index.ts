import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Krogers } from "./Produce_Getter/Kroger.mjs";
import { getTargetProducts } from "./Produce_Getter/Target.mjs";
import readline from "readline";
//import fs from 'fs';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })); // Add this line to enable CORS
  app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Example endpoint
app.get('/api/example', (req: Request, res: Response) => {
res.send('Hello, this is an example endpoint!');
});

// Kroger API endpoint
app.get('/api/kroger', async (req: Request, res: Response) => {
  const { zipCode, searchTerm, brand } = req.query;

  try {
      const products = await Krogers(Number(zipCode), String(searchTerm), String(brand));
      res.json(products);
  } catch (error) {
      console.error("Error fetching products from Kroger API:", error);
      res.status(500).json({ error: "Failed to fetch products from Kroger API" });
  }
});

// Target API endpoint
app.get('/api/target', async (req: Request, res: Response) => {
    const { keyword, zipCode, sortBy } = req.query;

    try {
        const products = await getTargetProducts(String(keyword), String(zipCode), String(sortBy || "price"));
        res.json(products);
    } catch (error) {
        console.error("Error fetching Target products:", error.message);
        res.status(500).json({ error: "Failed to fetch Target products." });
    }
});

// Combined API endpoint
app.get('/api/getAllProducts', async (req: Request, res: Response) => {
    const { zipCode, searchTerm, brand, keyword, sortBy } = req.query;

    try {
        // Fetch data from Kroger and Target APIs
        const [krogerProducts, targetProducts] = await Promise.all([
            Krogers(Number(zipCode), String(searchTerm), String(brand)),
            getTargetProducts(String(keyword || searchTerm), String(zipCode), String(sortBy || "price"))
        ]);

        // Normalize the responses to have the same structure
        const normalizeProduct = (product: any, provider: string) => ({
            title: product.title || "",
            brand: product.brand || "",
            price: product.price || null,
            unit: product.unit || "N/A",
            pricePerUnit: product.pricePerUnit || null,
            location: product.location || "N/A",
            provider,
        });

        const normalizedKrogerProducts = krogerProducts.map((product: any) => normalizeProduct(product, "Kroger"));
        const normalizedTargetProducts = targetProducts.map((product: any) => normalizeProduct(product, "Target"));

        // Combine the results
        const combinedProducts = [...normalizedKrogerProducts, ...normalizedTargetProducts];
        combinedProducts.sort((a, b) => {
            if (a.price && b.price) {
                return a.price - b.price;
            }
            return 0; // If prices are not available, keep the original order
        });   
        res.json(combinedProducts);
    } catch (error) {
        console.error("Error fetching combined products:", error.message);
        res.status(500).json({ error: "Failed to fetch combined products." });
    }
});

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });