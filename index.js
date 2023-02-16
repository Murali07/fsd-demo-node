import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
// console.log(process.env.MONGO_URL);

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

const client = await createConnection();

app.use(cors());

app.use(express.json());

const mobiles = [
  {
    model: "OnePlus 9 5G",
    img: "https://m.media-amazon.com/images/I/61fy+u9uqPL._SX679_.jpg",
    company: "Oneplus",
  },
  {
    model: "Iphone 13 mini",
    img: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-blue-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1645572315986",
    company: "Apple",
  },
  {
    model: "Samsung s21 ultra",
    img: "https://m.media-amazon.com/images/I/81kfA-GtWwL._SY606_.jpg",
    company: "Samsung",
  },
  {
    model: "Xiomi mi 11",
    img: "https://m.media-amazon.com/images/I/51K4vNxMAhS._AC_SX522_.jpg",
    company: "Xiomi",
  },
];

app.get("/", function (request, response) {
  response.send("Welcome to our Mobile Shop");
});

app.get("/mobiles", async function (request, response) {
  const result = await client
    .db("mobile-ecom")
    .collection("mobiles")
    .find({})
    .toArray();

  response.send(result);
});

app.post("/mobiles", async function (request, response) {
  const data = request.body;
  console.log(data);

  const result = await client
    .db("mobile-ecom")
    .collection("mobiles")
    .insertMany(data);

  response.send(result);
});

app.post("/users/signup", async function (request, response) {
  const { username, password } = request.body;
  const userFromDB = await client
    .db("mobile-ecom")
    .collection("users")
    .findOne({ username: username });

  if(userFromDB){
    response.status(400).send({msg: "User already exists"});
  }else{
    const result = await client
    .db("mobile-ecom")
    .collection("users")
    .insertOne({ username: username, password: password });

    response.send(result);
  }

  console.log(userFromDB);
  response.send(userFromDB);  
});

app.listen(PORT, () => console.log(`The app is started in ${PORT}`));
