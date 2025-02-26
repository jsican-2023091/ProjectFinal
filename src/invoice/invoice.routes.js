//Rutas de factura
import { Router } from "express"
import { getAll, invoiceSave } from "./invoice.controller.js"

const api = Router()

api.get(
    '/getAll',
    getAll
)

api.put(
    '/save',
    invoiceSave
)
export default api