const getDB = require("../../db");

const getEntry = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;
    const [result] = await connection.query(
      `SELECT photos.url,users.username, photos.created_at, sum(likes.vote) as votos FROM photos 
      join users on photos.id_users=users.id_users 
      join likes on likes.id_photos=photos.id_photos
      where photos.id_photos = ?`,

      [id]
    );

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getEntry;
