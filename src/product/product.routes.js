import { Router } from 'express'
import { get, getAll, productRegister, update , deleteProduct  } from './product.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { validRegisProduct, validUpdateProduct } from '../../helpers/validators.js'


const api = Router()

//Rutas publicas
api.get(
    '/',
    getAll
)


//Rutas privadas
api.post(
    '/save',
    [
        validateJwt,
        isAdmin,
        validRegisProduct
    ],
    productRegister
)


api.get(
    '/get/:id',
    [
        validateJwt,
        isAdmin
    ],
    get
)

api.put(
    '/update/:id',
    [
        validateJwt,
        isAdmin,
        validUpdateProduct
    ],
    update
)

api.delete(
    '/delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteProduct
)


//Exportar api
export default api