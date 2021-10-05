const { format } = require("date-fns");
const { ensureDir } = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const crypto = require("crypto");

function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

const { UPLOAD_DIRECTORY } = process.env;

const uploadDir = path.join(__dirname, UPLOAD_DIRECTORY);

async function savePhoto(fotoData) {
  await ensureDir(uploadDir);
  const image = sharp(fotoData.data);
  image.resize(400);
  image.grayscale();
  const saveImageName = `${uuid.v4()}.jpg`;
  await image.toFile(path.join(uploadDir, saveImageName));
  return saveImageName;
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
  generateRandomString,
  validate,
};
