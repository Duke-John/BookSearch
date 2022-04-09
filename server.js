const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const mongoose = require("mongoose");

const url =
  "mongodb+srv://Suplex1702:Dukejohn90@cluster0.rnvgx.mongodb.net/BookSearch?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,

  useUnifiedTopology: true,
};
mongoose.connect(url, connectionParams);
mongoose.connection.on("connected", () => {
  console.log("mongoose is connected!!");
});

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

// const users = [];

// function upsert(array, item) {
//   const i = array.findIndex((_item) => _item.email === item.email);
//   if (i > -1) array[i] = item;
//   else array.push(item);
// }

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email } = ticket.getPayload();
  res.status(201);
  res.json({ name, email });
});

app.use(express.static(path.join(__dirname, "/build")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/build/index.html"))
);
const Schema = mongoose.Schema;
const UserData = new Schema({
  name: String,
  email: String,
  queries: Array,
});
const userDetail = mongoose.model("userDetail", UserData);
app.post("/api/save-user-data", async (req, res) => {
  const { name, email, queries } = req.body;
  const user = await userDetail.findOne({ email: email });
  if (user) {
    user.queries.push(queries);
    user.save();
  } else {
    const newuser = new userDetail({
      name,
      email,
      queries,
    });
    newuser.save();
  }
});
app.get("/api/get-user-data", (req, res) => {
  // userDetail.findOneAndDelete(
  //   { _id: "624eca0e50b216e80f57a38f" },
  //   (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(data);
  //     }
  //   }
  // );
  userDetail.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is ready at http://localhost:${process.env.PORT || 5000}`
  );
});
// const password = encodeURIComponent("Dukejohn90@");
