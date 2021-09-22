const getDB = require("../../db");

const likePhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    // un usuario puede votar solo una vez
    const [existingVote] = await connection.query(
      `
      SELECT id_likes
      FROM likes
      WHERE id_users=? AND id_photos=?
    `,
      [req.userAuth.id, id]
    );

    if (existingVote.length > 0) {
      const error = new Error("Ya votaste esta foto");
      error.httpStatus = 403;
      throw error;
    }

    const now = new Date();

    // añado el voto a la tabla
    await connection.query(
      `
        INSERT INTO likes (created_at, id_photos, id_users)
        VALUES (?,?,?)
    `,
      [now, id, req.userAuth.id]
    );

    // saco la nueva media de los votos
    const [newLikes] = await connection.query(
      `
        SELECT count(id_likes) AS numLikes
        FROM likes
        WHERE id_photos = ?
    `,
      [id]
    );

    res.send({
      status: "ok",
      data: {
        id: id,
        likes: newLikes[0].numLikes,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = likePhoto;
