//Node.JS Rancid Tomatoes Project - Alex Abraham - Web Development Final Project
//
//Import String.prototype.startsWith function
require("./helperFunctions.js");

//Import NOde modules
var express = require("express");
var fs = require("fs");
var path = require('path');

//Create server object and configure it
var app = express();
app.use(express.static('public')); //Add "public" folder as a static path so that server can reference files directly
app.set('view engine', 'jade'); //Set the view engine to jade so I can pass jade templates to res.render

app.get("/movie", function(req, res) {
	var data = {};
	var movie = {};

	movie.name = req.query.film; //film is passed as get request parameter and is stored in req.query

	var dirname = 'public/movies/' + movie.name + '/';
	
	//Check if film name is the name of a directory and throw 400 error if not
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
	

	//At this point we know that the film exists in our systen. Process info.txt
	var info = readFileToArray(dirname + 'info.txt');
	movie.title = info[0];
	movie.year = info[1];

	//Process overview.txt
	var overview = readFileToArray(dirname + 'overview.txt');
	movie.overview = {};
	for (var i in overview) {
		var arr = overview[i].split(":");
		movie.overview[arr[0]] = arr[1]
	}

	movie.rating = info[2];

	//Process all review files in folder
	var files = fs.readdirSync(dirname);
	var reviews = [];
	for (var i in files) {
		if (path.basename(files[i]).startsWith("review") && path.extname(files[i]) === ".txt") {
			// reviews.push(readFile('public/movies/tmnt/' + files[i]).split("\n"));

			reviews.push(readFileToArray(dirname + files[i]));
		}
	}
	movie.reviews = reviews;

	//Store all the data gathered into a movie object and store that movie object in a larger data object
	data.movie = movie;

	//Return a webpage with default status 200 using jade rendering engine and pass movie data
	res.render("movie", data);
});

/*
Function to read a file and return array of lines. Catches all error so it will never crash. Data returns null if there was a problem.
*/
var readFileToArray = function(name) {

	var data = null;
	try {
		data = fs.readFileSync(name, 'utf8').split("\n");
	} catch (e) {
	}

	return data;
	
};

//Port is 1337 if PORT is NOT an environment variable but otherwise it will be whatever the environment variable is
//This is necessary to have the server run on Heroku
var port = process.env.PORT || 1337;

//Function to start server!
app.listen(port, function() {
	console.log('App is running on http://localhost:' + port);
});