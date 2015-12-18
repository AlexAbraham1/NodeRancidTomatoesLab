require("./helperFunctions.js");

var express = require("express");
var fs = require("fs");
var path = require('path');

var app = express();

app.use(express.static('public'));

app.set('view engine', 'jade');

app.get("/movie", function(req, res) {
	var data = {};
	var movie = {};

	movie.name = req.query.film;

	var dirname = 'public/movies/' + movie.name + '/';
	

	try {
		stats = fs.lstatSync(dirname);

		if (!stats.isDirectory()) {
			throw new Error('NOT A DIRECTORY');
		}
	} catch (e) {
		content = "<h1>THAT MOVIE IS NOT IN OUR DATABASE!</h1>";
		res.setHeader("Content-type", "text/html");
		res.status(400).send(content);
	}
	


	var info = readFileToArray(dirname + 'info.txt');
	movie.title = info[0];
	movie.year = info[1];

	var overview = readFileToArray(dirname + 'overview.txt');
	movie.overview = {};
	for (var i in overview) {
		var arr = overview[i].split(":");
		movie.overview[arr[0]] = arr[1]
	}

	movie.rating = info[2];

	var files = fs.readdirSync(dirname);
	var reviews = [];
	for (var i in files) {
		if (path.basename(files[i]).startsWith("review") && path.extname(files[i]) === ".txt") {
			// reviews.push(readFile('public/movies/tmnt/' + files[i]).split("\n"));

			reviews.push(readFileToArray(dirname + files[i]));
		}
	}
	movie.reviews = reviews;

	data.movie = movie;
	res.render("movie", data);
});

var readFileToArray = function(name) {

	var data = null;
	try {
		data = fs.readFileSync(name, 'utf8').split("\n");
	} catch (e) {
	}

	return data;
	
};

var port = process.env.PORT || 1337;

app.listen(port, "127.0.0.1", function() {
	console.log("Server is listening! \nGo to localhost:1337");
});