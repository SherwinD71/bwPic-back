const getDB = require("../../db");

const listPhotos = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    let result;

    //FIXME añadir filtro y id usuario para ver solo las fotos de un usuario

    [result] =
      await connection.query(`SELECT p.id_photos, url, place, p.created_at, p.id_users, username, count(likes.id_photos) as likes, numComentarios
      FROM photos AS p
      LEFT JOIN likes ON (p.id_photos = likes.id_photos)
      LEFT JOIN users ON (p.id_users = users.id_users)
      LEFT JOIN (
      SELECT id_photos, count(id_comments) AS numComentarios
      FROM comments
      GROUP BY id_photos
      ) AS c ON (p.id_photos = c.id_photos)
      GROUP BY p.id_photos 
      ORDER BY p.created_at desc;
      `);

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

module.exports = listPhotos;
