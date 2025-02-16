import { Router } from "express";
import { deleteUser, deleteUserAdmin, getAll, updateUser, updateUserClientforAdmin, updateUserClient, updateUserRole } from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { validUpdateRole, validUpdateUser } from "../../helpers/validators.js";

const api = Router()

//Rutas privadas
api.put(
    '/changerole/:id',
    [
        validateJwt,
        isAdmin,
        validUpdateRole
    ],
    updateUserRole
)

api.put(
    '/update/:id',
    [
        validUpdateUser
    ],
    updateUser
)

api.delete(
    '/delete/:id',
    [
        validateJwt,
        isAdmin
    ],
    deleteUser
)

api.get(
    '/',
    [
        validateJwt,
        isAdmin
    ],
    getAll
)

api.post(
    '/updateMyClient/:id',
    [
        validateJwt
    ],
    updateUserClient
)

api.delete(
    '/deleteAd/:id',
    [
        validateJwt
    ],
    deleteUserAdmin
)

api.post(
    '/updateAdmin/:id',
    [
        validateJwt
    ],
    updateUserClientforAdmin
)
export default api