#borrado de tablas si existen

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS users;

#crear tabla users;
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
      PRIMARY KEY (id_users));

#crear tabla photos
CREATE TABLE photos (
      id_photos INT NOT NULL AUTO_INCREMENT,
      url VARCHAR(200) NOT NULL,
      description VARCHAR(500),
      place VARCHAR(250),
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users));
      
#crear tabla comments
CREATE TABLE comments (
      id_comments INT NOT NULL AUTO_INCREMENT,
      comment_text VARCHAR(250) NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_comments),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users));

#crear tabla likes
CREATE TABLE likes (
      id_likes INT NOT NULL AUTO_INCREMENT,
      vote bool NOT NULL,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id_likes),
      id_photos INT NOT NULL,
      FOREIGN KEY (id_photos) REFERENCES photos(id_photos),
      id_users INT NOT NULL,
      FOREIGN KEY (id_users) REFERENCES users(id_users),
      UNIQUE(id_photos,id_users));

      
      
select * from users;
select * from photos;
select * from comments;    
select * from likes;  

update photos set created_at= "2021-09-09 13:20:32" where id_photos = 2;

select * from photos order by created_at desc;

      
      
      
      