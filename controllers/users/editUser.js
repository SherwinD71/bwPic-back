const getDB = require("../../db");
const { savePhoto } = require("../../helpers");

const editUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const { name, username, email } = req.body;

    if (req.userAuth.id !== Number(id)) {
      const error = new Error("No puedes editar los datos de otro usuario");
      error.httpStatus = 403;
      throw error;
    }

    if (req.files && req.files.userphoto) {
      const userPhoto = await savePhoto(req.files.userphoto);

      await connection.query("UPDATE users SET userphoto=? WHERE id_users=?", [
        userPhoto,
        id,
      ]);
    }

    await connection.query(
      `
        UPDATE users
        SET name=?, username=?, email=?
        WHERE id_users=?
      `,
      [name, username, email, id]
    );

    res.send({
      status: "ok",
      message: "Usuario actualizado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
