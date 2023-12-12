import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().min(5).max(10).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const signupSchema = Joi.object({
  username: Joi.string().min(5).max(10).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

export const postSchema = Joi.object({
  title: Joi.string().max(40).required(),
  body: Joi.string().max(100).required(),
  image: Joi.any(),
  likes: Joi.number(),
  authorId: Joi.object(),
  dateCreated: Joi.date(),
});
