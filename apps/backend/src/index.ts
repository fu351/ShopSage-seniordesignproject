import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Import Kroger dynamically if using .mjs
const { Krogers } = await import("./Produce_Getter/Kroger.mjs");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

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

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const users: { username: string; password: string }[] = []; // Dummy user database

// Register Route
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered successfully" });
});

const loginHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  res.json({ token });
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
