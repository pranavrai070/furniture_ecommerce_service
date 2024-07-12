const express = require('express');
const app = express();
const cors=require("cors");
const bodyparser=require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(express.json());

app.use(bodyparser.json({ limit: "50mb" }));
app.use(
  bodyparser.urlencoded({
    extended: true,
    // parameterLimit: 50000,
  })
);

// Define CORS options
const corsOptions = {
    origin: '*', // Allow any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Allow specific headers
    credentials: true // Allow cookies to be sent
  };
  
  // Use CORS middleware with defined options
  app.use(cors(corsOptions));
  
  // Handle preflight requests
  app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204);
  });

  
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/',(_req,res)=>{
 return res.status(200).json({message:"Furniture Server is Running Fine"});
})

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
