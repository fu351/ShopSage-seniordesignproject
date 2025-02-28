import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import readline from "readline";
//import fs from 'fs';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8080;

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

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });