import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AWS from 'aws-sdk';

// Import Kroger dynamically if using .mjs
const { Krogers } = await import("./Produce_Getter/Kroger.mjs");
const { SamsClubs } = await import("./Produce_Getter/SamsClub.mjs")

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
      const products = await Krogers(Number(zipCode), String(searchTerm), String(brand));
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
      const products = await SamsClubs(Number(zipCode), String(searchTerm));
      res.json(products);
  } catch (error) {
      console.error("Error fetching products from Sams Club API:", error);
      res.status(500).json({ error: "Failed to fetch products from Sams Club API" });
  }
});

app.get('/', (req, res) => {
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
app.post("/register", registerHandler);

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
app.post("/login", loginHandler);

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

// Protected Route
app.get("/protected", authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ message: `Welcome ${req.user.username}! This is a protected route.` });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});