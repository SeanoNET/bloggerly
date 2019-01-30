const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (request,response,next)=>{
    request.app.locals.layout = 'home';
    next();
});

router.get('/', (request, response)=>{
    const perPage = 10;
    const page = request.query.page || 1;

    Post.find({})
    .skip((perPage*page) - perPage)
    .limit(perPage)
    .populate('user')
    .then(posts =>{
        Post.count().then(postCount=>{
            Category.find({}).then(categories=>{
                response.render('home/index',{
                    posts: posts,
                    categories: categories,
                    current: parseInt(page),
                    pages: Math.ceil(postCount / perPage)
                });
            });
        });     
    });
});

router.get('/about', (request, response)=>{
    response.render('home/about');
});

// Login
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done)=>{
   
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});

        bcrypt.compare(password, user.password,(err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
            }else{
                return done(null, false,{message: 'Wrong Password.'});
            }
        });

    });
}));

router.post('/login', (request, response)=>{

    passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(request, response);
});

router.get('/login', (request, response)=>{
    response.render('home/login');
});

router.get('/logout', function(request, response){
    request.logout();
    response.redirect('/');
});

router.get('/register', (request, response)=>{
    response.render('home/register');
});

router.post('/register', (request, response)=>{
   

    let errors=[];

    if(!request.body.firstName){
        errors.push({message: 'Please add a firstName'});
    }

    if(!request.body.lastName){
        errors.push({message: 'Please add a lastName'});
    }

    if(!request.body.email){
        errors.push({message: 'Please add a email'});
    }

    if(!request.body.password){
        errors.push({message: 'Please add a password'});
    }

    if(request.body.password !== request.body.passwordConfirm){
        errors.push({message: 'Passwords dont match'});
    }

    if(errors.length > 0){
        response.render('home/register',{
            errors: errors,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email
        });
    }else{

        User.findOne({email:request.body.email}).then(user=>{
            if(!user){
                const newUser = new User({
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    email: request.body.email,
                    password: request.body.password
                });
        
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt,(err, hash)=>{
                        newUser.password = hash
                        newUser.save().then(savedUser =>{
                            request.flash('success_message', 'Please login.');
                            response.redirect('/login');
                        });
                    });
                });
                
            }else{
                request.flash('error_message',`This email already exists, please login.`)
                response.redirect('/login');
            }
        });
    
              
    }

   
});

//Post

router.get('/post/:slug', (request, response)=>{
    Post.findOne({slug: request.params.slug})
    .populate('user')
    .populate({path: 'comments', match: {approvedComment: true}, populate: {path: 'user', model: 'users'}}).then(post =>{
        Category.find({}).then(categories=>{
            response.render('home/post',{post: post,categories: categories});
        });
        
    });
   
});

module.exports = router;