const getDB = require("../../db");
const { formatDateToDB, savePhoto } = require("../../helpers");

const newPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { place, description } = req.body;

    const now = new Date();

    let nombrePhoto;

    if (req.files && Object.keys(req.files).length > 0) {
      const photoData = Object.values(req.files)[0];
      nombrePhoto = await savePhoto(photoData);
    }

    const [result] = await connection.query(
      `
      INSERT INTO photos (created_at, place, description, id_users, url)
      VALUES (?, ?, ?, ?, ?)
    `,
      [formatDateToDB(now), place, description, req.userAuth.id, nombrePhoto]
    );

    const { insertId } = result;

    res.send({
      status: "ok",
      data: {
        id: insertId,
        place,
        description,
        user_id: req.userAuth.id,
        date: now,
        votes: 0,
        comments: [],
        foto: nombrePhoto,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newPhoto;
