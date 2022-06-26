const express = require('express');
const cors = require("cors");
const path = require('path');

const app = express();
require('dotenv').config()

// import routes
const restaurantRoute = require('./routes/restaurant');
const productRoute = require('./routes/product');

app.use(express.json());
app.use(cors());
app.use('api/restaurant/files', express.static("uploads"));

app.use("/api/restaurant", restaurantRoute);
app.use("/api/product", productRoute);


const port = process.env.PORT || 8080;


app.listen(port, () => console.log("Server running"));