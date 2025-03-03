//Rutas dse carrito
import { Router } from "express"
import { addToCart, deleteCart, deleteProductCart } from "./cart.controller.js"

const api = Router()

api.post(
    '/save',
    addToCart
)

api.delete(
    '/deleteproduct',
    deleteProductCart
)

api.delete(
    '/delete/:userId',
    deleteCart
)
export default api