const getDB = require("../../db");

const deleteUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id_users} = req.params;
    
    console.log("ID usuario", id);

    
    if (Number(id_users) === 1) {
      const error = new Error("El administrador no se pude eliminar");
      error.httpStatus = 403;
      throw error;
    }

        if (req.userAuth.role !== "admin" && req.userAuth.id !== Number(id)) {
      const error = new Error(
        "No tienes los permisos para eliminar este usuario"
      );
      error.httpStatus = 403;
      throw error;
    }

    
    await connection.query(
      `
        UPDATE users
        SET password="[BORRADO]", name="[BORRADO]", avatar=NULL, active=0, deleted=1, lastAuthUpdate=?
        WHERE id=?
    `,
      [new Date(), id_users]
    );

    res.send({
      status: "ok",
      message: `Usuario con id=${id_users} eliminado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteUser;
