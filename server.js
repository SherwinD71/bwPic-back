require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const isUser = require("./middlewares/isUser");
const photoExists = require("./middlewares/photoExists");
const userExists = require("./middlewares/userExists");
const fileUpload = require("express-fileupload");
const {
  listPhotos,
  newPhoto,
  getPhoto,
  likePhoto,
  commentPhoto,
} = require("./controllers/photos");

const {
  newUser,
  loginUser,
  getUser,
  editUser,
  editUserPassword,
} = require("./controllers/users");

const { PORT, HOST, UPLOAD_DIRECTORY } = process.env;

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.static(path.join(__dirname, UPLOAD_DIRECTORY)));

app.use(fileUpload());

app.get("/", (req, res, next) => {
  res.send({
    status: "ok",
    message: "Pagina Inicio",
  });
});

app.post("/users", newUser);

app.post("/users/login", loginUser);

app.get("/users/:id", isUser, userExists, getUser);

app.put("/users/:id", isUser, userExists, editUser);

app.put("/users/:id/password", isUser, userExists, editUserPassword);

app.get("/photos", listPhotos);

app.get("/photos/:id", isUser, userExists, getPhoto);

app.post("/photos", isUser, userExists, newPhoto);

app.post("/photos/:id/like", isUser, userExists, photoExists, likePhoto);

app.post("/photos/:id/comment", isUser, userExists, photoExists, commentPhoto);

app.use((error, req, res, next) => {
  res.status(error.HttpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

app.use((req, res, next) => {
  res.status(404).send({
    status: "error",
    message: "Ruta no encontrada",
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor ok en http://${HOST}:${PORT}`);
});
