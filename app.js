var express = require("express");
var app = express();
var hbs = require("hbs");
var bodyparse = require("body-parser");
app.use(
  bodyparse.urlencoded({
    extended: false,
  })
);

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://hoang4a:hoang4a@cluster0.qhhzb.mongodb.net/test";

app.get("/", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("ProductDB");
  let results = await dbo.collection("icream").find({}).toArray();
  res.render("index", { model: results });
});
app.get("/insert", (req, res) => {
  res.render("insert");
});
app.post("/doInsert", async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server is running");
