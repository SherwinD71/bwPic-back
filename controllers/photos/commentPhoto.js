const getDB = require("../../db");

const commentPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // codigo ...
    const { id_photos } = req.body;
    const { comment_text } = req.body;
    const { id_users } = req.body;

    //añado el comentario a la base de datos

    await connection.query(
      `
      INSERT INTO comments(comment_text, created_at, id_photos, id_users)
      VALUES (?,?,?,?)
    `,
      [comment_text, new Date(), id_photos, id_users]
    );

    res.send({
      status: "ok",
      message: "commentPhoto",
      data: "data",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = commentPhoto;
