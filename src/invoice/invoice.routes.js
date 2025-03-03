//Rutas de factura
import { Router } from "express"
import { cancelInvoice, completePurchase, createInvoice, purchaseHistory } from "./invoice.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post(
    '/saveInvoice',
    createInvoice
)

api.get(
    '/history/:id',
    [
      validateJwt  
    ],
    purchaseHistory
)

api.post(
  '/complete',
  completePurchase
)

api.post(
  '/cancel',
  cancelInvoice
)
export default api