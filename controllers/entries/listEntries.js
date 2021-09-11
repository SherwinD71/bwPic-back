const getDB = require("../../db");

const listEntries = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    let result;

    [result] =
      await connection.query(`select photos.url, users.username, photos.created_at, sum(likes.vote) , photos.id_photos from photos
    join users on photos.id_users=users.id_users 
    join likes on likes.id_photos=photos.id_photos
    group by photos.id_photos, likes.vote
    order by  photos.created_at  desc;`);

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
};

module.exports = listEntries;
