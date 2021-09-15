const getDB = require("../db");
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { authorization } = req.headers;

    // comprobar que la petición tenga el token (authorization)
    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }

    // valido el token, y voy a leer id y role
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (err) {
      const error = new Error("Token no valido");
      error.httpStatus = 401;
      throw error;
    }

    // añadir a la request el token info (id, role)
    req.userAuth = tokenInfo;

    // Continuo en el siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isUser;