const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../util/upload-helper');
const fs = require('fs');
const path = require('path');
const {userIsAuth} = require('../../util/auth');


router.all('/*', userIsAuth, (request,response,next)=>{
    request.app.locals.layout = 'admin';
    next();
});

// Get Posts
router.get('/',(request,response)=>{
    Post.find({})
    .populate('category')
    .then(posts=>{
        response.render('admin/posts/',{posts: posts});
    }).catch(err => console.log(err));  
});

router.get('/my-posts',(request,response)=>{
    Post.find({user: request.user.id})
    .populate('category')
    .then(posts=>{
        response.render('admin/posts/my-posts',{posts: posts});
    }).catch(err => console.log(err));  
});

// Creating post
router.get('/create',(request,response)=>{
    Category.find({}).then(categories=>{
        response.render('admin/posts/create',{categories: categories});
    });
    
});

router.post('/create',(request,response)=>{

    let errors=[];

    if(!request.body.title){
        errors.push({message: 'Please add a title'});
    }

    if(!request.body.status){
        errors.push({message: 'Please add a status'});
    }

    if(errors.length > 0){
        response.render('admin/posts/create',{
            errors: errors
        });
    }else{

        let fileName = 'placeholder.png';

        if(!isEmpty(request.files)){
            let file = request.files.file;
            fileName = Date.now() + '_' + file.name;

            file.mv(uploadDir + fileName,(err)=>{if(err)throw err});
        }
    
        

        let allowComments = false;

        if(request.body.allowComments){
            allowComments = true;
        }

        const newPost = new Post({
            user: request.user.id,
            title: request.body.title,
            status: request.body.status,
            allowComments: allowComments,
            body: request.body.body,
            file: fileName,
            category: request.body.category
        })

        newPost.save().then(savedPost =>{
            request.flash('success_message',`Post ${savedPost._id} was saved successfully.`)
            console.log(`${newPost.title} saved`);
            response.redirect('/admin/posts');
        }).catch(errors => {
            
            console.log(errors)}
        );

    }
});

router.get('/edit/:id',(request,response)=>{
    Post.findOne({_id: request.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            response.render('admin/posts/edit',{post: post,categories: categories});
        });
    }).catch(err => console.log(err)); 

    //response.render('admin/posts/edit');
});

router.put('/edit/:id',(request,response)=>{

    if(!isEmpty(request.files)){
            let file = request.files.file;
            fileName = Date.now() + '_' + file.name;

            file.mv(uploadDir + fileName,(err)=>{if(err)throw err});
        }




    Post.findOne({_id: request.params.id}).then(post=>{

        let allowComments = false;

        if(request.body.allowComments){
            allowComments = true;
        }

        post.title = request.body.title;
        post.status = request.body.status;
        post.allowComments = allowComments;
        post.body = request.body.body;
        post.category = request.body.category;

        if(!isEmpty(request.files)){
            let file = request.files.file;
            fileName = Date.now() + '_' + file.name;
            post.file = fileName
            file.mv(uploadDir + fileName,(err)=>{if(err)throw err});
        }

        post.save().then(updatedPost=>{
            request.flash('success_message',`Post ${updatedPost._id} was updated successfully.`)
            response.redirect('/admin/my-posts');
        }).catch(err => console.log(err)); 
    }).catch(err => console.log(err)); 
});

router.delete('/:id',(request,response)=>{
    Post.findOne({_id: request.params.id}).populate('comments').then(post=>{
        if(post.file === 'placeholder.png'){post.file='';}
        fs.unlink(uploadDir + post.file,(err=>{
            // Remove comments 
            if(!post.comments.length <1){
                post.comments.forEach(comment=>{
                    comment.remove();
                });
            }
            post.remove();
            request.flash('success_message',`Post ${request.params.id} was deleted successfully.`)
            response.redirect('/admin/my-posts');
        }));

    }).catch(err => console.log(err)); 
});

module.exports = router;