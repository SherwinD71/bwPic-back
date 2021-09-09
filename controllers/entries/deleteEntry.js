const deleteEntry = async (req, res, next) => {
  res.send({ status: "ok", message: "Elimina una entrada" });
};

module.exports = deleteEntry;
