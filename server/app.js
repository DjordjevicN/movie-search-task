const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const redis = require("redis");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
client.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET movie

const getMovie = async (req, res, next) => {
  const typeFilter = req.body.data.typeFilter;
  const yearFilter = req.body.data.yearFilter;
  const title = req.body.data.title;

  try {
    console.log("GETTING DATA");
    const response = await axios.get(
      `http://www.omdbapi.com/?i=tt3896198&apikey=706091b4&t=${title}${
        typeFilter && `&type=${typeFilter}`
      }${yearFilter && `&y=${yearFilter}`}`
    );
    const movieData = JSON.stringify(response.data);
    await client.hSet(title, title, movieData);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
};
// cash middleware

const cache = async (req, res, next) => {
  const movieTitle = req.body.data.title;
  console.log(movieTitle);
  const movieExists = await client.exists(movieTitle);
  if (movieExists) {
    console.log("CASHED MOVIE EXISTS");
    const redisResponse = await client.hGetAll(movieTitle);
    const cachedMovie = JSON.parse(redisResponse[movieTitle]);
    res.send(cachedMovie);
  } else {
    console.log("NEXT");
    next();
  }
};

app.post("/search", cache, getMovie);

app.get("/", async (req, res) => {
  client.set("name", "Nikola");
  client.set("age", "35");
  const redisResponse = await client.get("age");
  res.send(redisResponse);
});

app.post("/create_user", async (req, res) => {
  const { userName, password } = req.body;
  const userExists = await client.exists(userName);
  if (userExists === 1) {
    return res.send({ message: "User already exists", error: true });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = JSON.stringify({ userName, password: hashedPassword });
  await client.hSet(userName, userName, user);
  res.send({ message: "User created", error: false });
});
app.post("/login_user", async (req, res) => {
  const { userName, password } = req.body;
  const userExists = await client.exists(userName);
  if (userExists === 0) {
    return res.send({ message: "User name or password is wrong", error: true });
  }
  const redisResponse = await client.hGetAll(userName);
  const redisUser = JSON.parse(redisResponse[userName]);
  const matchPassword = await bcrypt.compare(password, redisUser.password);
  if (matchPassword) {
    return res.send({ message: "User logged in", error: false });
  } else {
    return res.send({ message: "User name or password is wrong", error: true });
  }
});

app.listen(5000, () => {
  console.log(`Running on ${PORT}`);
});
