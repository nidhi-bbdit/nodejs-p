const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const Registration = mongoose.model('Registration');
const path = require('path');
const auth = require('http-auth');

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('form', {title : 'Registration Form'});
});

router.get('/registrations', (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

router.get('/login', (req, res) => {
  res.render('login', {title : 'Login Form'});
});

router.post('/', 
	 [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    body('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Please enter password'),
  ], (req, res) => {
	//console.log(req.body);
  //res.render('form', { title: 'Registration form' });
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      //res.send('Thank you for your registration!');
      const registration = new Registration(req.body);
      registration.save()
      .then(() => {res.send('Thank you for your registration!');})
      .catch(() => { res.send('Sorry! Something went wrong.'); });

    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
});

router.post('/login', [
  body('email')
  .isLength({ min: 1 })
  .withMessage('Please enter email'),
  body('password')
  .isLength({ min: 2 })
  .withMessage('Please enter password'),
  ], (req, res) => {
    const errors = validationResult(req);
    var email = req.body.email;
    var password = req.body.password;
    if(errors.isEmpty()){
      Registration.findOne({email : email, password : password}, function (err, result) {
      
      if (result == null)
        res.send('Email or password is invalid');
      else
        var success_msg  = 'Logged in successfully';
       res.redirect('/registrations');

     });
      
     
    }
    else{
        res.render('login', {
          errors : errors.array()

        });
   } 

  });


router.get('/delete/:_id', (req, res) =>{
  if(req.params._id != null)
  {
    Registration.remove({_id :req.params._id}, function (err, result) {
      if(err) throw err
        res.redirect('/registrations');
    });
  }
  else
  {
    res.send('Something went wrong !!!');
  }
});

router.get('/edit/:_id', (req, res) =>{
  if(req.params._id != null){
    Registration.findOne({_id : req.params._id}, function(err, result) {
      if(err) throw err;
      res.render('update', {title :'Update Form', result});

    });
  }
  else{
    res.render('update', {title : 'Update Form'});
  }

});

router.post('/update', [
  body('name')
  .isLength({min : 1})
  .withMessage('Please enter name'),
  body('email')
  .isLength({min :1})
  .withMessage('Please enter email'),
  ], (req, res) =>{
   const errors = validationResult(req);
    if(errors.isEmpty()){
      Registration.updateOne({_id : req.body._id}, {$set : { name : req.body.name, email : req.body.email}}, function (err, result) {
        if(err) throw err;
        res.redirect('/registrations');
      });
    }
    else
    {
      res.render('update', { errors : errors});
    }

});
  
module.exports = router;