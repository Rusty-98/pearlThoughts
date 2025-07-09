import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './routes/emailRoutes.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use('/api', router);



app.get('/', (req, res) => {
    res.send(
        `<h1>🚀 server is running !! </h1>`
    );
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
