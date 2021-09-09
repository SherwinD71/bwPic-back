const getDB = require("../../db");

const getEntry = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;
    const [result] = await connection.query(
      `SELECT photo_id, img_url, user_id, description, placephoto, created_at FROM photo where photo_id= ?`,

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
