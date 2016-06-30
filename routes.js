var express     = require('express');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('../config/database'); // get db config file
var User        = require('../app/models/user'); // get the mongoose model
var Team        = require('../app/models/team');
var port 	    = process.env.PORT || 8080;
var jwt 	    = require('jwt-simple');
var router      = express.Router();
var Key         = require('../app/models/key');
var request     = require('request');
var key         = 'eb771b4e-dfa1-4e6f-a039-226552a84b6e';

/////////////////////////////////////////////////////

////// FRONT END API CALLS //////
router.get('/champions', function(req,res,next){
  request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags,image&api_key='+key ,function(error,response,body){
    var data = JSON.parse(body);
    res.json(data);
  });
});

router.get('/champions/:id', function(req,res,next){
  request("https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/"+req.params.id+"?champData=all&api_key=eb771b4e-dfa1-4e6f-a039-226552a84b6e" ,function(error,response,body){
    var data = JSON.parse(body);
    res.json(data);
  });
});

// router.get('/api/users', function(req, res, next){
//   Users.find(function(err, users){
//     if(err) return next(err);
//     res.json(users);
//     });
//   });

// router.get('/api/users/:id', function(req, res, next){
//   Users.findById(req.params.id,function(err, user){
//     if(err) return next(err);
//     res.json(user);
//     });
//   });


router.get('/matches', function(req,res,next){
  request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags,image&api_key='+key ,function(error,response,body){
    var data = JSON.parse(body);
    res.json(data);
  });
});


////// BACK END API CALLS //////
router.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password || !req.body.role ) {
    res.json({succes: false, msg: 'Please Summoner name, password, and your role.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      role: req.body.role 
    });
    newUser.save(function(err) {
      if (err) {
        res.json({succes: false, msg: 'Summoner name already exists.'});
      } else {
        res.json({succes: true, msg: 'Successfully created user!'});
      }
    });
  }
});

router.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/addTeam', function(req, res) {
	
  if (!req.body.name) {
    res.json({success: false, msg: 'Please put a team name.'});
  } else {
    var newTeam = new Team({
      name: req.body.name 
    });
    newTeam.save(function(err) {
      if (err) {
        res.json({success: false, msg: 'Team already exists.'});
      } else {
        res.json({success: true, msg: 'Successfully created Team!'});
      }
    });
  }
});

router.get('/findteams', function(req, res, next){
  Team.find(function(err, team){
    if(err) return next(err);
    res.json(team);
    });
  });

router.get('/getkey',function(req, res){
  Key.find(function(err, key){
    if(err) return (err);
    res.json(key);
    });
});

router.get('/apiKey', function(req,res) {
  res.send('eb771b4e-dfa1-4e6f-a039-226552a84b6e');
});




router.get('/userinfo', passport.authenticate('jwt', {session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        return res.json(user);
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
