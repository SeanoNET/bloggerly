const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*', (request,response,next)=>{
    request.app.locals.layout = 'admin';
    next();
});

router.get('/',(request,response)=>{

    Comment.find({user: request.user.id}).populate('user').then(comments=>{
        response.render('admin/comments',{comments: comments});
    });
  
});

router.post('/',(request,response)=>{
    Post.findOne({_id: request.body.id}).then(post=>{
        const newComment = new Comment({
            user: request.user.id,
            body: request.body.body
        });

        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                request.flash('success_message',`Comment has been submitted and is pending approval.`)
                response.redirect(`/post/${post.id}`);
            });
        });
    });
});

router.delete('/:id',(request,response)=>{
    Comment.findOne({_id: request.params.id}).then(comment=>{
        comment.remove();
        Post.findOneAndUpdate({comments: request.params.id},{$pull: {comments: request.params.id}}).then(updatedPost=>{
            //request.flash('success_message',`Post ${request.params.id} was deleted successfully.`)
            response.redirect('/admin/comments');
        }).catch(err => console.log(err));          
    }).catch(err => console.log(err)); 
});

router.post('/approve-comment',(request,response)=>{

    Comment.findByIdAndUpdate({_id: request.body.id},{$set: {approvedComment: request.body.approvedComment}}, (err, result)=>{
        if(err) console.log(err);
        response.send(result);
    });
});

module.exports = router;