require('dotenv').config();
const path = require("node:path");
const express = require("express");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const homeRouter = require('./routes/home');
app.use( "/", homeRouter);

const productRouter = require('./routes/product');
app.use( "/products", productRouter);

const categoryRouter = require('./routes/category');
app.use( "/categories", categoryRouter);

app.use((req, res) => {
  res.status(404).send("Page Not Found!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}!`);
});