const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");

const Farm = require("./models/farm");

// PRODUCT Categories
const categories = ["fruit", "vegetable", "dairy"];

//const AppError = require('../Middleware_Intro + Errors/AppError');

main().catch((err) => {
  console.log(err);
  console.log("OH NO, MONGO CONNECTION ERROR!");
});
async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStandTake2"); //can add any title after local host
  console.log("MONGO CONNECTION OPEN!!");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //tells express to use middleware to access req.body
app.use(methodOverride("_method")); // _method= query string(?) in forms

// FARM ROUTES

app.get("/farms", async (req, res) => {
  //farms index
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  //async bc we need to find farm in db w/ await
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/show", { farm });
});

app.post("/farms", async (req, res) => {
  //making a new mode/saving it = async
  const farm = new Farm(req.body); //req.body = farm name, city, email
  await farm.save();
  res.redirect("/farms");
});

//route to render the form to make a new product for the farm
app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params; //ensures id is passed in products/new template
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, id, farm });
});

//sends post req from ^; when we make new product, we need id for ea product the farm is assoc w/
app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params; //looks up farm using id
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body; //makes a product w no farm assoc w/ it
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save();
  await product.save();
  res.redirect(`/farms/${id}`);
});

app.get("/products", async (req, res) => {
  //waits for data to come back from mongoose & then responds
  const { category } = req.query; //looks to sees if there's a category in req.query
  if (category) {
    //if u did find category in req.query,
    const products = await Product.find({ category: category }); //find products based upon that category
    res.render("products/index", { products, category }); //if fruit, will say 'fruit products!'
  } else {
    const products = await Product.find({}); //otherwise, find ALL PRODUCTS
    res.render("products/index", { products, category: "All" });
  }
});

app.post("/products", async (req, res) => {
  //route where button submits to under new.ejs
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`); //redirects newly created product to page describing cost/category
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id); //to view specific product by ID
  //console.log(product)
  res.render("products/show", { product }); //output of webpage on show.ejs
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id); //use async/await when you know it takes long to obtain info
  res.render("products/edit", { product, categories }); //passes product through on edit
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  }); //finds product & updates it @ the same time
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3K!");
});
