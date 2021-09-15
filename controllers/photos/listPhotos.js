const getDB = require("../../db");

const listPhotos = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    let result;

    // saco el query string
    const { search, order, direction, user } = req.query;

    const validOrders = ["created_at", "likes", "numComentarios"];
    const orderBy = validOrders.includes(order) ? order : "created_at";

    const validDirections = ["ASC", "DESC"];
    const orderDirection = validDirections.includes(direction)
      ? direction
      : "DESC";

    // trozo de query comun
    const queryListPhotos = `
    SELECT p.id_photos, url, p.place, p.created_at, p.id_users, username, count(likes.id_photos) as likes, IFNULL(nComentarios, 0) as numComentarios
      FROM photos AS p
      LEFT JOIN likes ON (p.id_photos = likes.id_photos)
      LEFT JOIN users ON (p.id_users = users.id_users)
      LEFT JOIN (
      SELECT id_photos, count(id_comments) AS nComentarios
      FROM comments
      GROUP BY id_photos
      ) AS c ON (p.id_photos = c.id_photos)
    `;

    if (search) {
      if (user) {
        [result] = await connection.query(
          `
        ${queryListPhotos}
        WHERE (p.place LIKE ? OR p.description LIKE ?) AND p.id_users = ?
        GROUP BY p.id_photos
        ORDER BY ${orderBy} ${orderDirection}
      `,
          [`%${search}%`, `%${search}%`, user]
        );
      } else {
        [result] = await connection.query(
          `
          ${queryListPhotos}
          WHERE p.place LIKE ? OR p.description LIKE ? 
          GROUP BY p.id_photos
          ORDER BY ${orderBy} ${orderDirection}
        `,
          [`%${search}%`, `%${search}%`]
        );
      }
    } else {
      if (user) {
        [result] = await connection.query(
          `
          ${queryListPhotos}
          WHERE p.id_users = ?
          GROUP BY p.id_photos
          ORDER BY ${orderBy} ${orderDirection}
        `,
          user
        );
      } else {
        [result] = await connection.query(
          `
          ${queryListPhotos}
          GROUP BY p.id_photos
          ORDER BY ${orderBy} ${orderDirection}
        `
        );
      }
    }

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