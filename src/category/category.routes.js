//Rutas de categoria
import { Router } from "express"
import { categoryRegister, deleteCategory, getAll, getOne, update } from "./category.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"
import { validRegisCategory, validUpdatedCategory } from "../../helpers/validators.js"

const api = Router()

//Rutas Publicas
api.get(
    '/',
    getAll
)

//Rutas Privadas
api.post(
    '/save',
    [
        validateJwt,
        isAdmin,
        validRegisCategory
    ],
    categoryRegister
)


api.put(
    '/update/:id',
    [
        validateJwt,
        isAdmin,
        validUpdatedCategory
    ],
    update
)

api.delete(
    '/delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteCategory
)

api.get(
    '/get/:id',
    [
        validateJwt,
        isAdmin
    ],
    getOne
    
)
export default api