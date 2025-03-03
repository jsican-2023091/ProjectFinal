//Lógica de factura
import Invoice from '../invoice/invoice.model.js'
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'

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
            paymentStatus: 'pending'
        })

        // Guardar la facture en la base de datos
        await invoice.save()

        return res.status(201).send({
            success: true,
            message: 'Invoice created successfully',
            invoice
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error creating facture',
            error
        })
    }
}


export const purchaseHistory = async(req,res) => {
    try {
        const { userId } = req.params // Obtener el ID

        // Buscar todas las facturas del usuario
        const invoices = await Invoice.find({ user: userId })
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 }) // Ordenar por fecha, de la más reciente a la más antigua

        if (invoices.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No purchase history found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Purchase history retrieved successfully',
            history: invoices
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error retrieving purchase history',
            error
        })
    }
}