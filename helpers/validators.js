import { body } from "express-validator"; //Capturar todo el body de la solicitud
import { validateErrors , validateErrorWithoutImg} from "./validate.error.js";
import { existUsername, existEmail, objectIdValid } from "./db.validators.js";

export const registerValidation = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        // .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    body('direction', 'Direction cannot be empty')
        .notEmpty(),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

//login
export const loginValidation = [
    body('userLoggin', 'Username or Email cannot be empty')
        .notEmpty(),
        // .isLowercase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .isLength({min: 8})
        .withMessage('The password must be strong'),
    validateErrorWithoutImg
]

// Producto
export const validRegisProduct = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 70 characters')
        .notEmpty()
        .isLength({max: 70}),
    body('price', 'Price cannot be empty')
        .notEmpty(),
    body('stock', 'Stock cannot be empty')
        .notEmpty(),
    body('category', 'Category cannot be empty')
        .notEmpty()
        .custom(objectIdValid),
    validateErrorWithoutImg
]

export const validUpdateProduct = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 70 characters')
        .optional()
        .isLength({max: 70}),
    body('price', 'Price cannot be empty')
        .optional(),
    body('stock', 'Stock cannot be empty')
        .optional(),
    body('category', 'Category cannot be empty')
        .optional()
        .custom(objectIdValid),
    validateErrorWithoutImg
]

// Categoria
export const validRegisCategory = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 50 characters')
        .notEmpty()
        .isLength({max: 50}),
    validateErrorWithoutImg
]

export const validUpdatedCategory = [
    body('name', 'Name cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    body('description', 'Description cannot be empty, and can´t be overcome 50 characters')
        .optional()
        .isLength({max: 50}),
    validateErrorWithoutImg
]

//Usuario
export const validUpdateUser = [
    body('name', 'Name cannot be empty')
        .optional(),
    body('surname', 'Surname cannot be empty')
        .optional(),
    body('username', 'Username cannot be empty')
        .optional()
        .toLowerCase()
        .custom(existUsername),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .optional()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8}),
    body('direction', 'Direction cannot be empty')
        .optional(),
    body('phone', 'Phone cannot be empty')
        .optional()
        .isMobilePhone(),
    validateErrors
]

export const validUpdateRole = [
    body('role', 'Role must be either "ADMIN" or "CLIENT"')
        .toUpperCase()  
        .notEmpty()
        .isIn(['ADMIN', 'CLIENT'])
        .withMessage('Role must be either "ADMIN" or "CLIENT"'),
        validateErrorWithoutImg
]
