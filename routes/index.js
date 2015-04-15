var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
//it is strongly recommended that you use an environment variable for referencing your secret.
//Make sure to use the same secret as the one in models/User.js
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//Mongoose
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


/*Post routes*/

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);

  });
});

router.post('/posts', auth, function(req, res, next) {
//router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username; //El username se ha guardado en el payload. Lo hemos definido en línea 7

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
    res.json(post);
  });
});

//Para probar esto he utilizad: curl -X POST http://localhost:3000/posts/234123412341234/comments --data "body=estosescomentario"
//El -X es necesario para indicarle un método concreto: POST, PUT..., si no, por defecto usa GET

router.post('/posts/:post/comments', auth, function(req, res, next) {
//router.post('/posts/:post/comments', function(req, res, next) {
  console.log("hola");
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


/*Comments routes*/

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
//router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});





module.exports = router;
