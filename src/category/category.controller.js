//Lógica de Producto
import Category from '../category/category.model.js'
import Product from '../product/product.model.js'

//Crear Producto
export const categoryRegister = async(req, res)=>{
    try{
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send(
            {
                message: `Registred successfully,the added category is: ${category.name}`
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error with rigestering Product',
                err
            }
        )
    }
}

//Obtener todos
export const getAll = async(req, res)=>{
    const { limit , skip } = req.query
    try {
        const categories = await Category.find()
            .skip(skip)
            .limit(limit)
        if(categories.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Categories not Found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Categories found',
                total: categories.length,
                categories
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
//Obetener 1
export const getOne = async(req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        if(!category) return res.status(404).send(
            {
                success: false,
                message: 'Category not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Category found',
                category
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
        const updateCategory = await Category.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(404).send(
            {
                success: false,
                message: 'Category not found, not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Category updated successfully :)',
                updateCategory
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Category',
                err
            }
        )
    }
}

//Eliminar y actualiza el producto
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        // Verificar si la categoría existe
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).send(
                {
                success: false,
                message: 'Category not found'
                }
            )
        }

        // Buscar una categoría por defecto
        let defaultCategory = await Category.findOne({ name: 'Uncategorized' })
        if (!defaultCategory) {
            defaultCategory = await Category.findOne()
        }

        if (!defaultCategory) {
            return res.status(400).send(
                {
                success: false,
                message: 'No available category to assign products'
                }
            )
        }

        // Actualizar los productos que pertenecen a la categoría eliminada
        const updatedProducts = await Product.updateMany(
            { category: id }, 
            { $set: { category: defaultCategory._id } }
        )

        console.log(`Updated ${updatedProducts.modifiedCount} products to category ${defaultCategory._id}`)

        // Eliminar la categoría
        await Category.findByIdAndDelete(id)

        return res.send(
            {
            success: true,
            message: 'Category deleted successfully and products reassigned',
            updatedProducts: updatedProducts.modifiedCount
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
