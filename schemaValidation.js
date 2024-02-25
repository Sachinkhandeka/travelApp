const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(1).positive(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.string().allow("", null),
        category : Joi.string().valid("Amazing-View", "Play", "Tiny-Home", "Tree-House", "Farm", "Amazing-Pools", "Arctic", "Beach", "Mountain", "Peaceful", "Wild-Life", "OMG", "Yoga", "Nature", "Trending")
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        comment : Joi.string().required(),
    })
});

module.exports = {
    listingSchema , 
    reviewSchema
}