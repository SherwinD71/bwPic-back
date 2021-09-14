require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const isUser = require("./middlewares/isUser");
const {
  listEntries,
  newEntry,
  getEntry,
  modEntry,
  deleteEntry,
} = require("./controllers/entries");

const { newUser, loginUser } = require("./controllers/users");

const { PORT, HOST } = process.env;

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send({
    status: "ok",
    message: "Pagina Inicio",
  });
});

/*
ENDPOINT ENTRIES
*/
app.get("/entries", listEntries);
app.get("/entries/:id", getEntry);
app.post("/entries", isUser);
app.put("/entries/:id", modEntry);
app.delete("/entries/:id", deleteEntry);

/*
ENDPOINT USUARIOS
*/

// Nuevo usuario
app.post("/users", newUser);
// Login usuario
app.post("/users/login", loginUser);

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
