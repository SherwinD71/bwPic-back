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

// middleware recursos statico
app.use(express.static(path.join(__dirname, UPLOAD_DIRECTORY)));

// body parser para la subida de imagenes (multipart form data)
// multer o express-fileupload
app.use(fileUpload());

app.get("/", (req, res, next) => {
  res.send({
    status: "ok",
    message: "Pagina Inicio",
  });
});

/*
ENDPOINT USUARIOS
*/

// POST - /users - Crear un usuario
app.post("/users", newUser);
// POST - /users/login - Hará el login de un usuario y devolverá el TOKEN
app.post("/users/login", loginUser);
// GET - /users/:id - Devolver información del usuario
app.get("/users/:id", isUser, userExists, getUser);
// PUT - /users/:id - Editar un usuario (name, email, avatar) | Solo el propio usuario
app.put("/users/:id", isUser, userExists, editUser);
// PUT - /users/:id/password - Editar la contraseña de un usuario | Solo el propio usuario
app.put("/users/:id/password", isUser, userExists, editUserPassword);

/*
ENDPOINT PHOTOS
*/

// GET - /pothos/:id - devuelve las fotos
app.get("/photos", listPhotos);
// GET - /pothos/:id - devuelve los datos de una foto
app.get("/photos/:id", isUser, userExists, getPhoto);
// POST - /pothos/:id - añade una foto
app.post("/photos", isUser, userExists, newPhoto);
// POST - /pothos/:id/like - like a una foto
app.post("/photos/:id/like", isUser, userExists, photoExists, likePhoto);
// POST - /pothos/:id/comment - commenta una foto
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
