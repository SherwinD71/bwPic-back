const { format } = require("date-fns");
const { ensureDir, unlink } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const crypto = require("crypto");

function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

const { UPLOAD_DIRECTORY } = process.env;
console.log(UPLOAD_DIRECTORY);

const uploadDir = path.join(__dirname, UPLOAD_DIRECTORY);

async function savePhoto(fotoData) {
  // fotoData tengo las informaciones de la imagen

  // compruebo que exista el directorio donde quiero guardar las fotos (static/upload)
  await ensureDir(uploadDir);

  // leer el buffer (fotoData.data) de la imagen (con sharp)
  const image = sharp(fotoData.data);

  // hago un resize
  image.resize(400);
  image.grayscale();

  // generar un nombre unico para la imagen (UUID)
  const saveImageName = `${uuid.v4()}.jpg`;

  // guardo la imagen en static/images
  await image.toFile(path.join(uploadDir, saveImageName));

  // devuelvo el nombre de la photo
  return saveImageName;
}

async function deletePhoto(imageName) {
  const pathImage = path.join(uploadDir, imageName);
  console.log(path.join(uploadDir, imageName));
  await unlink(pathImage);
}

function generateRandomString() {
  return crypto.randomBytes(40).toString("hex");
}

async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}

function yourRandomGenerator(rangeOfDays, startHour, hourRange) {
  let today = new Date(Date.now());
  return new Date(
    today.getYear() + 1900,
    today.getMonth(),
    today.getDate() + Math.random() * rangeOfDays,
    Math.random() * hourRange + startHour,
    Math.random() * 60
  );
}

module.exports = {
  formatDateToDB,
  yourRandomGenerator,
  savePhoto,
  deletePhoto,
  generateRandomString,
  validate,
};
