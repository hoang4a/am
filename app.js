var express = require("express");
var hoang = express();
var hbs = require("hbs");
var bodyparse = require("body-parser");
hoang.use(
  bodyparse.urlencoded({
    extended: false,
  })
);

hoang.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://hoang4a:hoang4a@cluster0.qhhzb.mongodb.net/test";

hoang.get("/", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let results = await dbo.collection("icream").find({}).toArray();
  res.render("index", { model: results });
});
hoang.get("/insert", (req, res) => {
  res.render("insert");
});
hoang.post("/doInsert", async (req, res) => {
  let nameInput = req.body.txtName;

  let priceInput = req.body.txtPrice;
  let amoutInput = req.body.txtAmout;
  let staffInput = req.body.txtStaff;
  let newProduct = {
    productName: nameInput,
    price: priceInput,
    amout: amoutInput,
    StaffName: staffInput,
  };
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  await dbo.collection("icream").insertOne(newProduct);
  res.redirect("/");
});
hoang.get("/delete", async (req, res) => {
  //id: string from URL
  let id = req.query.id;
  //convert id from URL to MongoDB' id
  let ObjectID = require("mongodb").ObjectID(id);
  //the conditon to delete
  let condition = { _id: ObjectID };
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  await dbo.collection("icream").deleteOne(condition);
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
hoang.listen(PORT);
console.log("Server is running");
