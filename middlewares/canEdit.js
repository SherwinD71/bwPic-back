const getDB = require("../db");

const canEdit = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [current] = await connection.query(
      `
        SELECT id_users
        FROM photos
        WHERE id_users=?
      `,
      [id]
    );

    if (
      current[0].user_id !== req.userAuth.id &&
      req.userAuth.role !== "admin"
    ) {
      const error = new Error(
        "No tienes los permisos para editar esta entrada"
      );
      error.httpStatus = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = canEdit;
