import Joi from 'joi';

const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().regex(/^[a-z0-9!#],{3,30}$/i),
    phoneNumber: Joi.string().required(),
    otp: Joi.number().required(),
});
