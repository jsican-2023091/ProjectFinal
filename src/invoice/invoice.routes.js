//Rutas de factura
import { Router } from "express"
import { createInvoice, purchaseHistory } from "./invoice.controller.js"

const api = Router()

api.post(
    '/saveInvoice',
    createInvoice
)

api.get(
    '/history/:id',
    purchaseHistory
)
export default api