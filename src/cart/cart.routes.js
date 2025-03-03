//Rutas dse carrito
import { Router } from "express"
import { addToCart, deleteCart, updateCart } from "./cart.controller.js"

const api = Router()

api.post(
    '/save',
    addToCart
)

api.put(
    '/update/:id',
    updateCart
)

api.delete(
    '/delete/:userId',
    deleteCart
)
export default api