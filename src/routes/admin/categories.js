const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {userIsAuth} = require('../../util/auth');

router.all('/*', userIsAuth, (request,response,next)=>{
    request.app.locals.layout = 'admin';
    next();
});

router.get('/', (request, response)=>{
    Category.find({}).then(categories=>{
        response.render('admin/categories/index',{categories: categories});
    });
    
});

router.post('/create', (request, response)=>{
    const newCat = new Category({
        name: request.body.name
    });
    
    newCat.save().then(newCat=>{
        response.redirect('/admin/categories');
    });

});

router.get('/edit/:id', (request, response)=>{
    Category.findOne({_id: request.params.id}).then(category =>{
        response.render('admin/categories/edit', {category: category});
    });
});

router.put('/edit/:id', (request, response)=>{
    Category.findOne({_id: request.params.id}).then(category =>{
        category.name = request.body.name;
        category.save().then(savedCat=>{
            response.redirect('/admin/categories');
        });
        
    });
});

router.delete('/:id', (request, response)=>{
    Category.remove({_id: request.params.id}).then(result =>{
        response.redirect('/admin/categories');
    });
});

module.exports = router;