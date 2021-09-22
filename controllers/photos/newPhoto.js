const getDB = require("../../db");
const { formatDateToDB, savePhoto, validate } = require("../../helpers");
// const { newEntrySchema } = require("../../schemas");

const newPhoto = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // valido los datos del body
    //await validate(newPhotoSchema, req.body);

    // saco los campos del body
    const { place, description } = req.body;

    const now = new Date();

    // proceso la imagen
    let nombrePhoto;

    if (req.files && Object.keys(req.files).length > 0) {
      // cojo la imagen
      const photoData = Object.values(req.files)[0];
      nombrePhoto = await savePhoto(photoData);
    }

    // hacemos la insert en la BD
    const [result] = await connection.query(
      `
      INSERT INTO photos (created_at, place, description, id_users, url)
      VALUES (?, ?, ?, ?, ?)
    `,
      [formatDateToDB(now), place, description, req.userAuth.id, nombrePhoto]
    );

    // saco el id de la fila insertada
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
