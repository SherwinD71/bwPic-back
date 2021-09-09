CREATE DATABASE bwpic;

USE bwpic;

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
      id INT NOT NULL AUTO_INCREMENT,
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
      recoverCode varchar(100),
      PRIMARY KEY (id)
      );

    CREATE TABLE photos (
      id INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(200) NOT NULL,
      description VARCHAR(500),
      place VARCHAR(250),
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      id_user INT NOT NULL,
      FOREIGN KEY (id_user) REFERENCES users(id)
      );

    CREATE TABLE comments (
      id INT NOT NULL AUTO_INCREMENT,
      comment_text VARCHAR(250) NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id),
      id_user INT NOT NULL,
      FOREIGN KEY (id_user) REFERENCES users(id)
      );

    CREATE TABLE likes (
      id INT NOT NULL AUTO_INCREMENT,
      vote bool NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id),
      id_user INT NOT NULL,
      FOREIGN KEY (id_user) REFERENCES users(id),
      UNIQUE(id_photos,id_user)
      );