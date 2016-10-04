CREATE DATABASE whitespace;

USE whitespace;

   # If there is a constraint, it will be lower web
   # So, droped whole constraint.
CREATE TABLE member(
	  mbr_Id			VARCHAR(20) NOT NULL UNIQUE,
    mbr_Pwd			VARCHAR(255) NOT NULL,
    mbr_Salt    VARCHAR(255) NOT NULL,
    mbr_Nick		VARCHAR(30) NOT NULL UNIQUE,
    mbr_EMail		VARCHAR(100) NOT NULL UNIQUE,
    mbr_Verified	BOOLEAN NOT NULL DEFAULT FALSE,
    mbr_Chance		BOOLEAN NOT NULL DEFAULT FALSE,
    mbr_Profile		BLOB NULL DEFAULT NULL,
    mbr_Date		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(mbr_Id)
);

CREATE TABLE board(
	brd_Title	VARCHAR(20) NOT NULL UNIQUE,
    brd_Count	INT UNSIGNED NOT NULL DEFAULT 0,
    brd_Pwd		VARCHAR(20) NULL,
    brd_Opened	BOOLEAN NOT NULL DEFAULT TRUE,
    brd_Date	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    brd_Owner	VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY(brd_Title)
    # FOREIGN KEY(brd_Owner) REFERENCES member(mbr_Id)
);

CREATE TABLE post(
	brd_Title	VARCHAR(20) NOT NULL,
	pst_Id		INT NOT NULL UNIQUE AUTO_INCREMENT,
	pst_Title	VARCHAR(200) NOT NULL,
    pst_Content VARCHAR(20000) NOT NULL,
    pst_View	INT NOT NULL DEFAULT 0,
    pst_Writer	VARCHAR(30) NOT NULL,
    pst_Date	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(pst_Id)
    # FOREIGN KEY(brd_Title) REFERENCES board(brd_title)
);

CREATE TABLE img(
	pst_Id		INT NOT NULL,
    img_Num	 	INT NOT NULL UNIQUE AUTO_INCREMENT,
    pst_Img		BLOB NOT NULL,
    PRIMARY KEY(pst_Id, img_Num)
    # FOREIGN KEY(pst_Id) REFERENCES post(pst_Id)
);

CREATE TABLE coment( # there is a token named 'comment', so just think coment means comment
	pst_Id			INT NOT NULL,
	cmnt_Writer		VARCHAR(30) NOT NULL,
    cmnt_Content	VARCHAR(600) NOT NULL,
    cmnt_Date		DATETIME NOT NULL,
    PRIMARY KEY(cmnt_Writer, cmnt_Date)
    # FOREIGN KEY(pst_Num) REFERENCES post(pst_Num)
);
