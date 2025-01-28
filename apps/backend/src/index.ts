import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});