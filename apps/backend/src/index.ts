import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
// Removed the static import of Krogers to avoid conflict with the dynamic import below
import { getTargetProducts } from "./Produce_Getter/Target.js";
import readline from "readline";
//import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AWS from 'aws-sdk';

// Import Kroger dynamically if using .mjs
const { Krogers } = await import("./Produce_Getter/Kroger.js");
const { SamsClubs } = await import("./Produce_Getter/SamsClub.js")
const { Meijers } = await import("./Produce_Getter/Meijer.js")

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = "Users";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

//if (!process.env.JWT_SECRET) {
//  throw new Error("JWT_SECRET is not defined in environment variables");
//}

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());

// Example endpoint
app.get('/api/example', (req: Request, res: Response) => {
  res.send('Hello, this is an example endpoint!');
});

// Kroger API endpoint
app.get('/api/kroger', async (req: Request, res: Response) => {
    const { zipCode, searchTerm, brand } = req.query;

    try {
        if (!zipCode || !searchTerm) {
            return res.status(400).json({ error: "Missing required query parameters: zipCode and searchTerm" });
        }
        const products = await Krogers(Number(zipCode ?? 47906), String(searchTerm), String(brand || ""));
        res.json(products);
    } catch (error) {
        console.error("Error fetching products from Kroger API:", error);
        res.status(500).json({ error: "Failed to fetch products from Kroger API" });
    }
});

// Sams Club API endpoint
app.get('/api/samsclub', async (req: Request, res: Response) => {
    const { zipCode, searchTerm } = req.query;

    try {
        if (!zipCode || !searchTerm) {
            return res.status(400).json({ error: "Missing required query parameters: zipCode and searchTerm" });
        }
        const products = await SamsClubs(Number(zipCode), String(searchTerm));
        res.json(products);
    } catch (error) {
        console.error("Error fetching products from Sams Club API:", error);
        res.status(500).json({ error: "Failed to fetch products from Sams Club API" });
    }
});

// Target API endpoint
app.get('/api/target', async (req: Request, res: Response) => {
    const { keyword, zipCode, sortBy } = req.query;

    try {
        if (!keyword || !zipCode) {
            return res.status(400).json({ error: "Missing required query parameters: keyword and zipCode" });
        }
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
      if (!zipCode || !searchTerm) {
          return res.status(400).json({ error: "Missing required query parameters: zipCode and searchTerm" });
      }

      const results = await Promise.allSettled([
          (async () => {
              try {
                  return await Krogers(Number(zipCode ?? 47906), String(searchTerm), String(brand || ""));
              } catch (error) {
                  console.error("Error fetching Kroger products:", error.message);
                  return [];
              }
          })(),
          (async () => {
              try {
                  return await SamsClubs(Number(zipCode ?? 47906), String(searchTerm));
              } catch (error) {
                  console.error("Error fetching Sams Club products:", error.message);
                  return [];
              }
          })(),
          (async () => {
            try {
                return await Meijers(Number(zipCode ?? 47906), String(searchTerm));
            } catch (error) {
                console.error("Error fetching Meijers products:", error.message);
                return [];
            }
          })(),
          (async () => {
              try {
                  return await getTargetProducts(String(keyword || searchTerm), String(zipCode), String(sortBy || "price"));
              } catch (error) {
                  console.error("Error fetching Target products:", error.message);
                  return [];
              }
          })()
      ]);

      const krogerProducts = results[0].status === "fulfilled" ? results[0].value : [];
      const samsClubProducts = results[1].status === "fulfilled" ? results[1].value : [];
      const meijerProducts = results[2].status === "fulfilled" ? results[2].value : [];
      const targetProducts = results[3].status === "fulfilled" ? results[3].value : [];

      const normalizeProduct = (product: any, provider: string) => ({
          id: `${provider}-${product.id || product.tcin || product.productId}`, // Ensure unique id by appending unique identifier
          name: product.title || product.name || "",
          brand: product.brand || "",
          description: product.description || "",
          category: product.category || "",
          price: product.price || null,
          unit: product.unit || "N/A",
          pricePerUnit: product.pricePerUnit || null,
          image_url: product.image_url || "",
          location: product.location || product.provider || "N/A",
          provider
      });

      const combinedProducts = [
          ...krogerProducts.map((product: any) => normalizeProduct(product, "Kroger")),
          ...samsClubProducts.map((product: any) => normalizeProduct(product, "Sams Club")),
          ...meijerProducts.map((product: any) => normalizeProduct(product, "Meijer")),
          ...targetProducts.map((product: any) => normalizeProduct(product, "Target"))
      ];

      combinedProducts.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
      res.json(combinedProducts);
  } catch (error) {
      console.error("Error fetching combined products:", error.message);
      res.status(500).json({ error: "Failed to fetch combined products." });
  }
});

app.get('/api/', (req, res) => {
    res.send('Hello from the backend!');
});

const registerHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };

  const params = {
    TableName: USERS_TABLE,
    Key: {
      username: username
    }
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (data.Item) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const putParams = {
      TableName: USERS_TABLE,
      Item: {
        username: username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      }
    };

    await dynamoDb.put(putParams).promise();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Could not register user" });
  }
};

// Register Route
app.post("/api/register", registerHandler);

const loginHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  
  const params = {
    TableName: USERS_TABLE,
    Key: {
      username: username
    }
  };

  try {
    const data = await dynamoDb.get(params).promise();
    const user = data.Item;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Could not log in" });
  }
};

// Login Route
app.post("/api/login", loginHandler);

// Authentication Middleware
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
  } catch (err) {
      res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/api/saveShoppingList", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { username } = req.user; // Extract username from the authenticated user
  const { items } = req.body; // Shopping list items sent from the frontend

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid shopping list data" });
  }

  const listId = `${username}-${Date.now()}`; // Unique list ID
  const createdAt = new Date().toISOString();

  const params = {
    TableName: "ShoppingLists",
    Item: {
      username,
      createdAt,
      listId,
      items,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res.json({ message: "Shopping list saved successfully", listId });
  } catch (error) {
    console.error("Error saving shopping list:", error);
    res.status(500).json({ error: "Could not save shopping list" });
  }
});

app.get("/api/getShoppingLists", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { username } = req.user;

  const params = {
    TableName: "ShoppingLists",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
    ScanIndexForward: false, // Sort by `createdAt` in descending order
  };

  try {
    const data = await dynamoDb.query(params).promise();
    res.json(data.Items || []);
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ error: "Could not fetch shopping lists" });
  }
});

// Protected Route
app.get("/api/protected", authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ message: `Welcome ${req.user.username}! This is a protected route.` });
});

// Start the server
//app.listen(port, '0.0.0.0', () => {
//    console.log(`Server is running on port ${port}`);
//});

app.listen(port, 'localhost', () => {
  console.log(`Server is running on port ${port}`);
});