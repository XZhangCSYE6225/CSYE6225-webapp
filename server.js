import express from 'express'
import sequelize from './config/index.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'

// dotenv.config()
const app = express()
sequelize.sync().then((res)=>{
    // 
}).catch((error) => {
})

app.use(express.json());
// Default
app.get('/healthz', (req, res) => {  
    res.status(200).send()
});
// Routes
app.use("/v1", userRoutes)
app.use("/v1", productRoutes)
const port = 8080
export const server = app.listen(port)

