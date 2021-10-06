const getDB = require("../../db");

const getPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;
    const [result] = await connection.query(
      `SELECT p.id_photos, url, description, place, p.created_at, p.id_users, userphoto, username, users.created_at as fecharegistro, count(likes.id_photos) as likes
      FROM photos AS p
      LEFT JOIN likes ON (p.id_photos = likes.id_photos)
      LEFT JOIN users ON (p.id_users = users.id_users)
      WHERE p.id_photos = ?
      GROUP BY p.id_photos;
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
module.exports = getPhoto;
