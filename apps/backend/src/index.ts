import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(8080, () => {
    console.log('Backend running on http://localhost:8080');
});