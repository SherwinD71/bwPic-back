require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {
  listEntries,
  newEntry,
  getEntry,
  modEntry,
  deleteEntry,
} = require("./controllers/entries");

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

app.get("/entries", listEntries);
app.get("/entries/:id", getEntry);
app.post("/entries", newEntry);
app.put("/entries/:id", modEntry);
app.delete("/entries/:id", deleteEntry);

app.use((error, req, res, next) => {
  res.status(error.HttpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

app.use((req, res, next) => {
  res.status(404).send({
    status: "error",
    message: "No encontrado",
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor ok en http://${HOST}:${PORT}`);
});
