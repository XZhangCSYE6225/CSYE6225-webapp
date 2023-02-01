import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/users.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// Default
app.get('/healthz', (req, res) => {  
    res.status(200).json({ msg: "Succesful access" });
});

// Routes
app.use("/", userRoutes);

const port = 8080
export const server = app.listen(port, () => {
    console.log(`The server runs at ${port}.`);
});

