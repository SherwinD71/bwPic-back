const getDB = require("../../db");
const { generateRandomString, sendMail, validate } = require("../../helpers");
const { newUserSchema } = require("../../schemas");

const newUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { email, password } = req.body;
    
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

    
    const registrationCode = generateRandomString();
    
    
    await connection.query(
      `
      INSERT INTO users(created_at,email,password,registrationCode)
      VALUES (?,?,SHA2(?, 512),?)
    `,
      [new Date(), email, password, registrationCode]
    );

    
    const emailBody = `
      Te acabas de registrar en B&WPic.
      Pulsa aqui para validar tu usuario: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
    `;

    sendMail({
      to: email,
      subject: "Activa tu usuario de B&WPic",
      body: emailBody,
    });

    // mando una respuesta
    res.send({
      status: "ok",
      message: "Nuevo usuario creado. Comprueba tu correo para activarlo.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
