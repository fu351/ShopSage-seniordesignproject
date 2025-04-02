import express, { Request, Response } from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import { Krogers } from "./Produce_Getter/Kroger.mjs";
import fs from 'fs';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
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

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });

// https.createServer(options, app).listen(5000, '0.0.0.0', () => {
//   console.log('Server running on https://0.0.0.0:5000');
// });