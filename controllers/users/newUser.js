const getDB = require("../../db");
const { validate } = require("../../helpers");
const { newUserSchema } = require("../../schemas");

const newUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { email, password, username, name } = req.body;

    // valido los datos del body
    await validate(newUserSchema, req.body);

    // compruebo que no exista en la base de datos un usuario con esta email
    const [existingUser] = await connection.query(
      `
      SELECT id_users
      FROM users
      WHERE email=?
    `,
      [email]
    );

    if (existingUser.length > 0) {
      const error = new Error("Ya existe un usuario con este mail");
      error.httpStatus = 409;
      throw error;
    }

    // añado el usuario a la base de datos (con registrationCode=sbdhfbud809urut9304)
    await connection.query(
      `
      INSERT INTO users(created_at,email,password, username, name)
      VALUES (?,?,SHA2(?, 512),?, ?)
    `,
      [new Date(), email, password, username, name]
    );

    // mando una respuesta
    res.send({
      status: "ok",
      message: "Nuevo usuario creado.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
