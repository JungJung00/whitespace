CREATE DATABASE whitespace;

USE whitespace;

CREATE TABLE member(
	mbr_Id			VARCHAR(20) NOT NULL UNIQUE,
    mbr_Pwd			VARCHAR(20) NOT NULL,
    mbr_Nick		VARCHAR(30) NOT NULL UNIQUE,
    mbr_EMail		VARCHAR(100) NOT NULL UNIQUE,
    mbr_Verified	BOOLEAN NOT NULL DEFAULT FALSE,
    mbr_Chance		BOOLEAN NOT NULL DEFAULT FALSE,
    mbr_Profile		BLOB NULL DEFAULT NULL,
    mbr_Date		DATETIME NOT NULL,
    PRIMARY KEY(mbr_Id)
);

CREATE TABLE board(
	brd_Title	VARCHAR(20) NOT NULL UNIQUE,
    brd_Count	INT UNSIGNED NOT NULL DEFAULT 0,
    brd_Pwd		VARCHAR(20) NULL,
    brd_Opened	BOOLEAN NOT NULL DEFAULT TRUE,
    brd_Date	DATETIME NOT NULL,
    brd_Owner	VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY(brd_Title),
    FOREIGN KEY(brd_Owner) REFERENCES member(mbr_Id)
);

CREATE TABLE post(
	brd_Title	VARCHAR(20) NOT NULL,
	pst_Num		INT NOT NULL UNIQUE,
	pst_Title	VARCHAR(400) NOT NULL,
    pst_Writer	VARCHAR(30) NOT NULL UNIQUE,
    pst_Date	DATETIME NOT NULL,
    PRIMARY KEY(pst_Num),
    FOREIGN KEY(brd_Title) REFERENCES board(brd_title)
);

CREATE TABLE img(
	pst_Num		INT NOT NULL,
    img_Num	 	INT NOT NULL,
    pst_Img		BLOB NOT NULL,
    PRIMARY KEY(pst_Num, img_Num),
    FOREIGN KEY(pst_Num) REFERENCES post(pst_Num)
);

CREATE TABLE coment( # there is a token named 'comment', so just think coment means comment
	pst_Num			INT NOT NULL,
	cmnt_Writer		VARCHAR(30) NOT NULL,
    cmnt_Content	VARCHAR(600) NOT NULL,
    cmnt_Date		DATETIME NOT NULL,
    PRIMARY KEY(cmnt_Writer, cmnt_Date),
    FOREIGN KEY(pst_Num) REFERENCES post(pst_Num)
);