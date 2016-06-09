var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port 	    = process.env.PORT || 8080;
var jwt 		= require('jwt-simple');
var LolApi      = require('leagueapi');
var key         = 'eb771b4e-dfa1-4e6f-a039-226552a84b6e';
var request     = require('request');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

mongoose.connect(config.database);

require('./config/passport')(passport);

app.all('/*', function(req,res,next){
	//cors headers
	res.header('Access-Control-Allow-Origin', "*");//restrict to required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	//set custom headers for cors
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key, X-Requested-With');
	if(req.method == 'OPTIONS'){
		res.status(200).end();
	}else{
		next();
	}
});

var router = require('./routes/routes');

/////////
// request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags,image&api_key='+key, function(err,res,body){
// 	if (!err && res.statusCode == 200){
// 		console.log(body);
// 	}
// });

LolApi.init('eb771b4e-dfa1-4e6f-a039-226552a84b6e', 'na');

LolApi.getMapNames(function(Mnames){
	console.log(Mnames);
});

// LolApi.getChampions(false, function(err, champs) {
//     console.log(champs);
// });

// LolApi.Summoner.getByName('Lemon Beard', function(err, summoner) {
//     if(!err) {
//         console.log(summoner);
//     }
// })

//The wrapper also accepts promises:
LolApi.Summoner.getByName('Lemon Beard ')
.then(function (summoner) {
    // console.log(summoner);
});

/////

app.use('/api', router);

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
