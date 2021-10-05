const getDB = require("../../db");

const getUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [user] = await connection.query(
      `
     SELECT id_users, created_at, email, name, username, userphoto , role
     FROM users
     WHERE id_users=?
    `,
      [id]
    );

    const userInfo = {
      id: user[0].id_users,
      date: user[0].created_at,
      email: user[0].email,
      name: user[0].name,
      username: user[0].username,
      avatar: user[0].userphoto,
      role: user[0].role,
    };

    res.send({
      status: "ok",
      data: userInfo,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUser;
