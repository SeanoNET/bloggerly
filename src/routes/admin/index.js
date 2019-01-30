const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {userIsAuth} = require('../../util/auth');

// router.all('/*', userIsAuth, (request,response,next)=>{
//     request.app.locals.layout = 'admin';
//     next();
// });

router.all('/*', (request,response,next)=>{
    request.app.locals.layout = 'admin';
    next();
});

router.get('/', (request, response)=>{

    const promises = [
        Post.count({}).exec(),
        Category.count({}).exec(),
        Comment.count({}).exec()
    ];

    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        response.render('admin/index',{postCount:postCount, categoryCount: categoryCount, commentCount: commentCount});
    });
    
});

router.post('/generate-posts', (request, response)=>{
    for(let i = 0; i < request.body.amount; i++){

        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.file = 'placeholder.png';
        post.save(function(err){

            if (err) throw err;

        });

        
    }
    response.redirect('/admin/posts');
});


module.exports = router;