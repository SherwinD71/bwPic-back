const newEntry = async (req, res, next) => {
  res.send({ status: "ok", message: "Nueva entrada" });
};

module.exports = newEntry;
