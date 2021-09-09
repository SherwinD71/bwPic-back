const getDB = require("../../db");

const listEntries = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    let result;

    [result] = await connection.query(`select * from users;`);

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
