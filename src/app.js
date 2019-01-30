const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoURL} = require('./config/data');
const passport = require('passport');

const port = process.env.PORT || 3000;

mongoose.connect(mongoURL).then((db)=>{
    console.log('Connected to MongoDB');
}).catch(err=>console.log(err));



//Static content - CSS, client side JS etc
app.use(express.static(path.join(__dirname,'public')));

// View engine rendering html
//util function
const {select, formatDate, paginate} = require('./util/handlebars-helper');
app.engine('handlebars',exphbs({defaultLayout: 'home', helpers:{select: select, formatDate: formatDate, paginate: paginate}}));
app.set('view engine', 'handlebars');

//Method Override
app.use(methodOverride('_method'));

//File upload
app.use(upload());


// Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//Sessions
app.use(session({
    secret: 'mycms',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());


//local vars using middleware
app.use((request, response, next)=>{
    response.locals.user = request.user || null;

    response.locals.success_message = request.flash('success_message');
    response.locals.error_message = request.flash('error_message');
    response.locals.error = request.flash('error');
    next();
});

// Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// Middleware use routing
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);

app.listen(port,()=>{
    console.log(`Server Started on Port: ${port} 🎉`);
});