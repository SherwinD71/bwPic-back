const modEntry = async (req, res, next) => {
  res.send({ status: "ok", message: "Modifico una entrada" });
};

module.exports = modEntry;
