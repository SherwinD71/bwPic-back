const getDB = require("../../db");
const { validate } = require("../../helpers");
const { newUserSchema } = require("../../schemas");

const newUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { email, password, username, name } = req.body;

    await validate(newUserSchema, req.body);

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

    await connection.query(
      `
      INSERT INTO users(created_at,email,password, username, name)
      VALUES (?,?,SHA2(?, 512),?, ?)
    `,
      [new Date(), email, password, username, name]
    );

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
