const getDB = require("../../db");

const editUserPassword = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const { oldPassword, newPassword } = req.body;

    
    if (req.userAuth.id !== Number(id)) {
      const error = new Error("No puedes cambiar la password de otro usuario");
      error.httpStatus = 403;
      throw error;
    }

    
    const [current] = await connection.query(
      `
      SELECT id_users
      FROM users
      WHERE id_users=? AND password=SHA2(?,512)
    `,
      [id, oldPassword]
    );

    if (current.length === 0) {
      const error = new Error("La contraseña antigua no es correcta");
      error.httpStatus = 401;
      throw error;
    }

    
    await connection.query(
      `
      UPDATE users
      SET password=SHA2(?,512), lastAuthUpdate=?
      WHERE id_users=?
    `,
      [newPassword, new Date(), id]
    );

    res.send({
      status: "ok",
      message: "Contraseña cambiada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserPassword;
