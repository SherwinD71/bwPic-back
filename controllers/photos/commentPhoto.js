const getDB = require("../../db");

const commentPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const { comment } = req.body;

    const now = new Date();

    // añado el voto a la tabla
    await connection.query(
      `
        INSERT INTO comments (created_at, id_photos, id_users, comment_text)
        VALUES (?,?,?,?)
    `,
      [now, id, req.userAuth.id, comment]
    );

    res.send({
      status: "ok",
      data: {
        status: "ok",
        message: "Nuevo comentario creado.",
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = commentPhoto;
