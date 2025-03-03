//Lógica de Producto
import Product from '../product/product.model.js'
import Category from '../category/category.model.js'

//Crear 
export const productRegister = async (req, res) => {
    try {
        let data = req.body

        // Verificar si la categoría existe
        const categoryExists = await Category.findById(data.category)
        if (!categoryExists) {
            return res.status(400).send({
                message: 'Invalid category. The provided category does not exist.'
            })
        }

        // Crear y guardar el producto
        let product = new Product(data)
        await product.save()

        return res.send({
            message: `Registered successfully, the added product is: ${product.name}`
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            message: 'General error while registering the product',
            err
        })
    }
}

//Listar todos
export const getAll = async(req, res)=>{
    try {
        const { limit = 20, skip = 0} = req.query
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
        if(products.length === 0) return res.status(400).send(
            {
                success: false,
                message: 'Products not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Products found',
                total: products.length,
                products
            }
        )

    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}
export const getOne = async(req, res)=>{
    try {
        const { limit = 1, skip = 0} = req.query
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
        if(products.length === 0) return res.status(400).send(
            {
                success: false,
                message: 'Products not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Products found',
                total: products.length,
                products
            }
        )

    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}

//Buscar 1 Producto
export const get = async(req, res)=>{
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(404).send(
            {
                success: false,
                message: 'Product not Found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Product Found',
                product
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Actualizar 
export const update = async(req, res)=>{
    const { id } = req.params
    const { ...data } = req.body
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateProduct) return res.status(404).send(
            {
                success: false,
                message: 'Product not found, not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Product updated successfully :)',
                updateProduct
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Products',
                err
            }
        )
    }
}

//Eliminar 
export const deleteProduct = async(req, res)=>{
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if(!product) return res.status(404).send(
            {
                success: false,
                message: 'Product not found'
            }
        )
        await product.save()
        await Product.findByIdAndDelete(id)
        return res.send(
            {
                success: true,
                message: 'Product deleted successfully :)'
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                err
            }
        )
    }
}

// Listar los productos más vendidos
export const getMostSold = async(req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
        
        // Obtener los productos más vendidos, ordenados por la cantidad de ventas de mayor a menor
        const products = await Product.find()
            .sort({ sales: -1 })  // Ordenar por el campo 'sales' en orden descendente
            .skip(skip)
            .limit(limit);

        if (products.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'No products found'
            });
        }

        return res.send({
            success: true,
            message: 'Most sold products found',
            total: products.length,
            products
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'General Error',
            err
        });
    }
}
