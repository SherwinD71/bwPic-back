const getDB = require("../../db");

const getEntry = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;
    const [result] = await connection.query(
      `SELECT id_photos, url, description, place, created_at, id_users FROM photos where id_photos = ?`,

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
