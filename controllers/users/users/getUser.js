const getDB = require("../../db");

const getUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    
    const [user] = await connection.query(
      `
     SELECT id_users, created_at, email, name, userphoto, role
     FROM users
     WHERE id_users=?
    `,
      [id]
    );

    const userInfo = {
      name: user[0].name,
      avatar: user[0].avatar,
    };

    if (user[0].id === req.userAuth.id || req.userAuth.role === "admin") {
      //date, email, role
      userInfo.date = user[0].date;
      userInfo.email = user[0].email;
      userInfo.role = user[0].role;
    }

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
