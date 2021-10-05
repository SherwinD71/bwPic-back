const getDB = require("../db");
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }

    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (err) {
      const error = new Error("Token no valido");
      error.httpStatus = 401;
      throw error;
    }

    req.userAuth = tokenInfo;

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isUser;
