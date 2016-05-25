var express = require('express');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
var Promotions = require('../models/promotions');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());
router.route('/')


.get(function(req,res,next){
    Promotions.find({}, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });  
})
.post(Verify.verifyOrdinaryUser,function(req, res, next){
     Promotions.create(req.body, function (err, promotion) {
        if (err) return next(err);
        console.log('promotion created!');
        var id = promotion._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,function(req, res, next){
    Promotions.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
    
});

router.route('/:promoId')

.get(Verify.verifyOrdinaryUser,function(req,res,next){
    Promotions.findById(req.params.promoId, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });
})

.put(Verify.verifyOrdinaryUser,function(req, res, next){
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) return next(err);
        res.json(promotion);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req, res, next){
    Promotions.findByIdAndRemove(req.params.promoId, function (err, resp) {        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = router;