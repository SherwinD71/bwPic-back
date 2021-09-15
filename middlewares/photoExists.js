const getDB = require("../db");

const photoExists = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    console.log("Photo exist");

    // comprobar si existe la foto
    const [current] = await connection.query(
      `
     SELECT id_photos FROM photos WHERE id_photos=?
     `,
      [id]
    );

    if (current.length === 0) {
      const error = new Error("No existe ninguna foto con este id");
      error.httpStatus = 404;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = photoExists;
