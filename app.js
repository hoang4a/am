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
  let cutStr = nameInput.substring(1);
  let staffStr = staffInput.substring(1);
  let errorMsg = {
    name: "",
    price: "",
    staff: "",
  };
  if (nameInput != null && nameInput.length < 5) {
    errorMsg.name = "Name's length >=5";
    console.log(nameInput);
  }
  if (priceInput != null && eval(priceInput) < 5) {
    errorMsg.price = "Price must >=0";
  }
  if (errorMsg.name.length != 0 || errorMsg.price.length) {
    res.render("insert", { error: errorMsg });
  }
  if (staffInput != null && staffInput.length < 5) {
    errorMsg.staff = "Staff must >=10";
  }
  if (checkiput(cutStr) === false || checkiput(staffStr) === false) {
    /// check viet hoa
    errorMsg.name = "ki tu viet hoa";
    errorMsg.staff = "ki tu staff phai viet hoa";
  } else {
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
  }
});
function checkiput(str) {
  // Check viet hoa
  if (str === str.toUpperCase()) {
    console.log("Check chu hoa");
    return true;
  } else return false;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server is running");
