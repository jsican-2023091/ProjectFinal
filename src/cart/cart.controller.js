//Lógica de Carrito
import Cart from '../cart/cart.model.js'
import Product from '../product/product.model.js'

//SaveCart
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, amount } = req.body

        // Verificar si el producto existe
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        // Verificar si hay suficiente stock disponible
        if (product.stock < amount) {
            return res.status(400).json({ success: false, message: 'Not enough stock available' })
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            // Si no existe un carrito, crear uno nuevo
            cart = new Cart({
                user: userId,
                products: [{ product: productId, amount }],
                total: product.price * amount
            })
        } else {
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product.toString() === productId)

            if (existingProduct) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                existingProduct.amount += amount
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: productId, amount })
            }

            // Recalcular el total del carrito
            cart.total = cart.products.reduce((sum, item) => {
                const productPrice = product.price // Asumimos que el precio no cambia durante la compra
                return sum + productPrice * item.amount
            }, 0)
        }

        // Reducir el stock del producto y aumentar las ventas
        product.stock -= amount
        product.sales += amount
        await product.save() // Guardar los cambios en el producto

        // Guardar el carrito actualizado
        await cart.save()

        return res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Error adding product to cart',
            error
        })
    }
}


export const deleteCart = async (req, res) => {
    try {
        const { userId } = req.params 
        
        const deletedCart = await Cart.findOneAndDelete({ user:userId })

        if (!deletedCart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Cart deleted successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error deleting cart',
            error
        })
    }
}

export const updateCart = async (req, res) => {
    try {
        const { userId, productId, amount } = req.body

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: userId }).populate('products.product')

        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            })
        }

        // Buscar el producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId)

        if (productIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Product not found in cart'
            })
        }

        if (amount > 0) {
            // Si la cantidad es mayor a 0, actualizarla
            cart.products[productIndex].amount = amount
        } else {
            // Si la cantidad es 0, eliminar el producto del carrito
            cart.products.splice(productIndex, 1)
        }

        // Recalcular el total del carrito
        cart.total = cart.products.reduce((sum, item) => {
            return sum + item.product.price * item.amount
        }, 0)

        // Guardar los cambios en el carrito
        await cart.save()

        return res.status(200).send({
            success: true,
            message: 'Cart updated successfully',
            cart
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error updating cart',
            error
        })
    }
}
