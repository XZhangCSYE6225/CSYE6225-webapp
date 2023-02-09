import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/index.js'
// import userRoutes from './routes/users.js';
// import productRoutes from './routes/products.js';

// dotenv.config()
const app = express()
try {
    sequelize.sync();
} catch (error) {
    
}
app.use(express.json())
app.use(express.urlencoded())
// Default
app.get('/healthz', (req, res) => {  
    res.status(200).json({ msg: "Succesful access" });
});
// Routes
// app.use("/v1", userRoutes);
// app.use("/v1", productRoutes);
const port = 8080
export const server = app.listen(port);

