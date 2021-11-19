const express = require("express");
const artistsRouter = express.Router();
const sqlite3 = require("sqlite3");

// instatiate a sqlite3 database from a local file or a test db
const db = new sqlite3.Database(
	process.env.TEST_DATABASE || "./database.sqlite"
);

// get artist using artist id (to be used in all routes having an artist id)
artistsRouter.param("artistId", (req, res, next, artistId) => {
	const sql = "SELECT * FROM Artist WHERE Artist.id = $artistId";
	const values = { $artistId: artistId };
	db.get(sql, values, (error, artist) => {
		if (error) {
			next(error);
		} else if (artist) {
			req.artist = artist;
			next();
		} else {
			res.sendStatus(404);
		}
	});
});

// get all artists
artistsRouter.get("/", (req, res, next) => {
	db.all(
		"SELECT * FROM Artist WHERE Artist.is_currently_employed = 1",
		(error, artists) => {
			if (error) {
				next(error);
			} else {
				res.status(200).json({ artists });
			}
		}
	);
});

//get one artist
artistsRouter.get("/:artistId", (req, res, next) => {
	res.status(200).json({ artist: req.artist });
});

// post an artist and return the created artist
artistsRouter.post("/", (req, res, next) => {
	const name = req.body.artist.name,
		dateOfBirth = req.body.artist.dateOfBirth,
		biography = req.body.artist.biography,
		isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
	if (!name || !dateOfBirth || !biography) {
		return res.sendStatus(400);
	}

	const sql =
		"INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)" +
		"VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)";
	const values = {
		$name: name,
		$dateOfBirth: dateOfBirth,
		$biography: biography,
		$isCurrentlyEmployed: isCurrentlyEmployed,
	};

	db.run(sql, values, function (error) {
		if (error) {
			next(error);
		} else {
			db.get(
				`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
				(error, artist) => {
					res.status(201).json({ artist: artist });
				}
			);
		}
	});
});

// update artist and return the updated aritist
artistsRouter.put("/:artistId", (req, res, next) => {
	const name = req.body.artist.name,
		dateOfBirth = req.body.artist.dateOfBirth,
		biography = req.body.artist.biography,
		isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
	if (!name || !dateOfBirth || !biography) {
		return res.sendStatus(400);
	}

	const sql =
		"UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, " +
		"biography = $biography, is_currently_employed = $isCurrentlyEmployed " +
		"WHERE Artist.id = $artistId";
	const values = {
		$name: name,
		$dateOfBirth: dateOfBirth,
		$biography: biography,
		$isCurrentlyEmployed: isCurrentlyEmployed,
		$artistId: req.params.artistId,
	};

	db.run(sql, values, (error) => {
		if (error) {
			next(error);
		} else {
			db.get(
				`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
				(error, artist) => {
					res.status(200).json({ artist: artist });
				}
			);
		}
	});
});

// delete an artist (set his status to unemployed)
artistsRouter.delete("/:artistId", (req, res, next) => {
	const sql =
		"UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId";
	const values = { $artistId: req.params.artistId };

	db.run(sql, values, (error) => {
		if (error) {
			next(error);
		} else {
			db.get(
				`SELECT * FROM Artist WHERE Artist.id = ${req.params.artistId}`,
				(error, artist) => {
					res.status(200).json({ artist: artist });
				}
			);
		}
	});
});
module.exports = artistsRouter;
