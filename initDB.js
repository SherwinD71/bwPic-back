const faker = require("faker");
const getDB = require("./db");
const { formatDateToDB } = require("./helpers");
const { yourRandomGenerator } = require("./helpers");
const { random } = require("lodash");

let connection;

async function main() {
  try {
    connection = await getDB();

    // drop tablas
    await connection.query(`DROP TABLE IF EXISTS likes`);
    await connection.query(`DROP TABLE IF EXISTS comments`);
    await connection.query(`DROP TABLE IF EXISTS photos`);
    await connection.query(`DROP TABLE IF EXISTS users`);

    // tabla users
    await connection.query(`
    CREATE TABLE users (
      id_users INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(250) NOT NULL,
      name VARCHAR(250) NOT NULL, 
      email VARCHAR(100) NOT NULL,
      userphoto VARCHAR(200),
      password VARCHAR(250) NOT NULL,
      created_at DATETIME NOT NULL,
      active BOOLEAN DEFAULT true,
      role ENUM("admin","normal") DEFAULT "normal" NOT NULL,
      registrationCode VARCHAR(100),
      deleted BOOLEAN DEFAULT false,
      lastAuthUpdate DATETIME,
      recoverCode VARCHAR(100),
      PRIMARY KEY (id_users))
    
    `);

    // tabla photos
    await connection.query(`
    CREATE TABLE photos (
      id_photos INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(200) NOT NULL,
      description TEXT,
      place VARCHAR(250),
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users))
    
    `);

    // tabla comments
    await connection.query(`
    CREATE TABLE comments (
      id_comments INT NOT NULL AUTO_INCREMENT,
      comment_text VARCHAR(250) NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_comments),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users))
    `);

    //tabla likes
    await connection.query(`
    CREATE TABLE likes (
      id_likes INT NOT NULL AUTO_INCREMENT,
      vote bool NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_likes),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users))
    `);
    console.log("Tablas creadas");

    //añadir usuario admin
    console.log("Añado usuario admin");
    await connection.query(`
    INSERT INTO users(created_at, email, password, name, username, active, role)
      VALUES (
        "${formatDateToDB(new Date())}", 
        "admin@mail.com",
        SHA2("${process.env.ADMIN_PASSWORD}", 512),
        "admin", 
        "admin", 
        true, 
        "admin");
      `);

    //introducir usuarios faker
    console.log("Añadir usuarios faker");

    const numeroUsers = 10;

    for (let index = 0; index < numeroUsers; index++) {
      let time = yourRandomGenerator(20, 8, 2);
      await connection.query(`
  INSERT INTO users (username, name, email, userphoto, password, created_at, active)
  VALUES (
           "${faker.internet.userName()}",
           "${faker.name.firstName()}",
           "${faker.internet.email()}",
           "${faker.image.avatar()}",
           SHA2("${faker.internet.password()}", 512),
           "${formatDateToDB(time)}",
           true
             )
  `);
    }

    //   //introducir fotos faker
    console.log("Añadir fotos faker");
    const numeroFotos = 20;

    for (let index = 0; index < numeroFotos; index++) {
      let time = yourRandomGenerator(20, 8, 2);
      await connection.query(`
     INSERT INTO photos (url, description, place, created_at, id_users)
     VALUES (

              "${faker.image.image()}",
              "${faker.lorem.paragraph()}",
              "${faker.address.city()}",
              "${formatDateToDB(time)}",
              "${random(2, numeroUsers + 1)}"
     )
     `);
    }
    // crear comentarios
    console.log("Añadir comentario faker");
    const crearComentarios = 20;
    for (let index = 0; index < crearComentarios; index++) {
      let time = yourRandomGenerator(20, 8, 2);
      await connection.query(`
     INSERT INTO comments (comment_text, created_at, id_photos, id_users)
    VALUES (

            "${faker.lorem.words()}",
            "${formatDateToDB(time)}",
            "${random(1, numeroFotos)}",
            "${random(1, numeroUsers + 1)}"

    )
    `);
    }

    //   //generar votos
    const crearVotos = 20;

    for (let index = 0; index < crearVotos; index++) {
      let time = yourRandomGenerator(20, 8, 2);
      await connection.query(`
      INSERT INTO likes (vote, created_at, id_users, id_photos)
      VALUES (

               "1",
               "${formatDateToDB(time)}",
               "${random(2, numeroUsers + 1)}",
               "${random(1, numeroFotos)}"
      )
      `);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

main();
