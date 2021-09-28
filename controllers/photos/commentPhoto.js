const getDB = require("../../db");

const commentPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    let result;

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

    // devuelvo numero commentario
    [result] = await connection.query(
      `
      SELECT id_photos, count(id_comments) AS nComentarios
      FROM comments
      WHERE id_photos=?
    `,
      [id]
    );

    const [result2] = await connection.query(
      `SELECT id_comments, comment_text, c.created_at, id_photos, c.id_users, username, userphoto
      FROM comments AS c
      LEFT JOIN users ON (c.id_users = users.id_users)
      WHERE id_photos = ?
      ORDER BY c.created_at DESC
      `,
      [id]
    );

    res.send({
      status: "ok",
      data: { ...result[0], comments: result2 },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = commentPhoto;
