//Lógica de factura
import Invoice from '../invoice/invoice.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

export const createInvoice = async (req, res) => {
    try {
        const { userId } = req.body

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId }).populate('products.product')

        if (!cart || cart.products.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Cart is empty or not found'
            })
        }

        // Mapear los productos con sus precios actuales
        const products = cart.products.map(item => ({
            product: item.product._id,
            amount: item.amount,
            price: item.product.price
        }))

        // Calcular el total 
        const total = products.reduce((sum, item) => sum + item.price * item.amount, 0)

        // Crear la facture
        const invoice = new Invoice({
            user: userId ,
            cart: cart._id,
            products,
            total,
            status: 'PENDING'
        })
        // Guardar la facture en la base de datos
        await invoice.save()

        return res.status(201).send({
            success: true,
            message: 'Invoice created successfully',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error creating facture',
            err
        })
    }
}

export const completePurchase = async (req, res) => {
    try {
        const { invoiceId } = req.body // Se espera que el ID de la factura sea enviado en el cuerpo de la solicitud

        // Buscar la factura por ID
        const invoice = await Invoice.findById(invoiceId)

        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: 'Invoice not found'
            })
        }

        // Cambiar el estado de la factura a "COMPLETE"
        invoice.status = 'COMPLETE'

        // Guardar la factura con el nuevo estado
        await invoice.save()

        return res.status(200).send({
            success: true,
            message: 'Invoice status updated to COMPLETE successfully',
            invoice
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error completing purchase',
            err
        })
    }
}

export const cancelInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.body // Se espera que el ID de la factura sea enviado en el cuerpo de la solicitud

        // Buscar la factura por ID
        const invoice = await Invoice.findById(invoiceId)

        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: 'Invoice not found'
            })
        }

        // Cambiar el estado de la factura a "CANCELLED"
        invoice.status = 'CANCELED'

        // Guardar la factura con el nuevo estado
        await invoice.save()

        return res.status(200).send({
            success: true,
            message: 'Invoice status updated to CANCELLED successfully',
            invoice
        })        
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success:false,
            message: 'Error updating invoice status',
            err
        })
    }
}

// Obtener historial de compras de un usuario
export const purchaseHistory = async (req, res) => {
    try {
        const userId = req.user.uid  
 
        // Verificar si el usuario existe
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found.'
            })
        }
 
        // Obtener las facturas asociadas al usuario, con populate para obtener los detalles de los productos
        const invoices = await Invoice.find({ user: userId })
            .populate(
                {
                    path: 'user',
                    select: 'name -_id'
                }
            )
            .populate(
                {
                    path: 'products.product',
                    select: 'name price -_id'  
                }
            )
 
 
        if (!invoices || invoices.length === 0) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'No purchase history found.'
                }
            )
        }
 
        return res.send(
            {
                success: true,
                message: 'Purchase history retrieved successfully.',
                invoices
            }
        )
 
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving purchase history.',
                err
            }
        )
    }
}