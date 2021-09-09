const faker = require("faker");
const getDB = require("./db");
const { formatDateToDB } = require("./helpers");
const { random } = require("lodash");

let connection;

async function main() {
  try {
    connection = await getDB();

    await connection.query(`DROP TABLE IF EXISTS likes`);
    await connection.query(`DROP TABLE IF EXISTS comments`);
    await connection.query(`DROP TABLE IF EXISTS photos`);
    await connection.query(`DROP TABLE IF EXISTS users`);

    await connection.query(`
    CREATE TABLE users (
      id_users INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(250) NOT NULL,
      name VARCHAR(250) NOT NULL, 
      email VARCHAR(100) NOT NULL,
      userphoto VARCHAR(200),
      password VARCHAR(20) NOT NULL,
      created_at DATETIME NOT NULL,
      active BOOLEAN DEFAULT false,
      role ENUM("admin","normal") DEFAULT "normal" NOT NULL,
      registrationCode VARCHAR(100),
      deleted BOOLEAN DEFAULT false,
      lastAuthUpdate DATETIME,
      recoverCode VARCHAR(100),
      PRIMARY KEY (id_users))
    
    `);

    await connection.query(`
    CREATE TABLE photos (
      id_photos INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(200) NOT NULL,
      description VARCHAR(500),
      place VARCHAR(250),
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users))
    
    `);

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

    await connection.query(`
    CREATE TABLE likes (
      id_likes INT NOT NULL AUTO_INCREMENT,
      vote bool NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_likes),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users),
      UNIQUE(id_photos,id_users))
    `);

    //introducir usuarios faker

    const numeroDeEntradas = 10;

    for (let index = 0; index < numeroDeEntradas; index++) {
      await connection.query(`
  INSERT INTO users (username, name, email, userphoto, password, created_at, active )
  VALUES (
           "${faker.internet.userName()}",
           "${faker.name.firstName()}",
           "${faker.internet.email()}",
           "${faker.image.avatar()}",
           "${faker.internet.password()}",
           "${formatDateToDB(new Date())}",
           "${random(0, 1)}"
  )
  `);
    }

    //   //introducir fotos faker
    const fotosEntradas = 20;

    for (let index = 0; index < fotosEntradas; index++) {
      await connection.query(`
     INSERT INTO photos (url, description, place, created_at, id_users)
     VALUES (

              "${faker.image.image()}",
              "${faker.lorem.paragraph()}",
              "${faker.address.city()}",
              "${formatDateToDB(new Date())}",
              "${random(1, numeroDeEntradas)}"
     )
     `);
    }

    const crearComentarios = 20;
    for (let index = 0; index < crearComentarios; index++) {
      await connection.query(`
   INSERT INTO comments (comment_text, created_at, id_photos, id_users)
  VALUES (

          "${faker.lorem.words()}",
          "${formatDateToDB(new Date())}"
          "${random(1, fotosEntradas)}",
          "${random(1, numeroDeEntradas)}"

  )
  `);
    }

    //   //generar votos
    //   const crearVotos = 2000;

    //   for (let index = 0; index < crearVotos; index++) {
    //     await connection.query(`
    //   INSERT INTO likes (vote, photo_id, created_at)
    //   VALUES (

    //            "${random(0, 1)}",
    //            "${random(1, fotosEntradas)}",
    //            "${formatDateToDB(new Date())}"
    //   )
    //   `);
    //   }
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
  }
}

main();
