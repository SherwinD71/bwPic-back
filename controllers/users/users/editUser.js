const getDB = require("../../db");
const { savePhoto, generateRandomString, sendMail } = require("../../helpers");


const editUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id_users } = req.params;

    
    const { name, email } = req.body;

    
    if (req.userAuth.id_users !== Number(id_users)) {
      const error = new Error("No puedes editar los datos de otro usuario");
      error.httpStatus = 403;
      throw error;
    }

    
    if (req.files && req.files.avatar) {
      
      const userAvatar = await savePhoto(req.files.avatar);
       await connection.query("UPDATE users SET userphoto=? WHERE id_users=?", [
        userAvatar,
        id,
      ]);
    }

    
    const [currentUser] = await connection.query(
      `
        SELECT email
        FROM users
        WHERE id_users=?
    `,
      [id]
    );

    
    if (email && email !== currentUser[0].email) {
      
      const [existingEmail] = await connection.query(
        `
        SELECT id_users
        FROM users
        WHERE email=?
      `,
        [email]
      );
      if (existingEmail.length > 0) {
        const error = new Error(
          "El correo electronico ya existe en la base de datos"
        );
        error.httpStatus = 409;
        throw error;
      }

      
      const registrationCode = generateRandomString();

      const emailBody = `
         Cambiaste el correo electronico en B&WPic.
         Pulsa aqui para validar tu usuario: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        `;

      sendMail({
        to: email,
        subject: "Activa tu usuario de B&WPic",
        body: emailBody,
      });

      
      await connection.query(
        `
                UPDATE users
                SET name=?, email=?, lastAuthUpdate=?, active=0, registrationCode=?
                WHERE id_users=?
            `,
        [name, email, new Date(), registrationCode, id]
      );

      res.send({
        status: "ok",
        message:
          "Usuario actualizado. Valida la nueva email desde el correo que hemos enviado",
      });
    } else {
      await connection.query(
        `
                UPDATE users
                SET name=?
                WHERE id_users=?
            `,
        [name, id]
      );

      res.send({
        status: "ok",
        message: "Usuario actualizado",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
