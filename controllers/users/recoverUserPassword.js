const getDB = require("../../db");
const { generateRandomString, sendMail } = require("../../helpers");

const recoverUserPassword = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

       const { email } = req.body;

    
    if (!email) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    
    const [currentEmail] = await connection.query(
      `
        SELECT id_users
        FROM users
        WHERE email=?
    `,
      [email]
    );

    if (currentEmail.length === 0) {
      const error = new Error("Ningun usuario registrado con esta email");
      error.httpStatus = 400;
      throw error;
    }

    
    const recoverCode = generateRandomString();

    
    await connection.query(
      `
        UPDATE users
        SET recoverCode=?
        WHERE email=?
    `,
      [recoverCode, email]
    );

    
    const emailBody = `
      Se solicitó el cambio de contraseña en B&WPic.
      El codigo de recuperación es: ${recoverCode}
      Si no fuiste tu a solicitar el cambio de la contraseña, por favor ignora este email.
      Gracias!
    `;

    sendMail({
      to: email,
      subject: "Cambio de contraseña de B&WPic",
      body: emailBody,
    });

    
    res.send({
      status: "ok",
      message: "Email enviado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recoverUserPassword;