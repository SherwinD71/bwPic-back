const getDB = require("../../db");
const { savePhoto } = require("../../helpers");

// dditar un usuario (name, email, avatar) | Solo el propio usuario
const editUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // sacar el id del usuario que quiero editar (req.params)
    const { id } = req.params;

    // saco name, email desde el body
    const { name, username } = req.body;

    console.log("body", req.body);
    console.log("name", name);
    console.log("username", username);

    // comprobar que el usuario que quiero modificar es lo que hace login
    if (req.userAuth.id !== Number(id)) {
      const error = new Error("No puedes editar los datos de otro usuario");
      error.httpStatus = 403;
      throw error;
    }

    // saco userphoto
    if (req.files && req.files.userphoto) {
      // guardo la imagen del usuario en static/images
      const userPhoto = await savePhoto(req.files.userphoto);
      // hago el update de la base de datos
      await connection.query("UPDATE users SET userphoto=? WHERE id_users=?", [
        userPhoto,
        id,
      ]);
    }

    // actualizo los datos en el DB
    await connection.query(
      `
        UPDATE users
        SET name=?, username=?
        WHERE id_users=?
      `,
      [name, username, id]
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
