//Lógica del User
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import User from '../user/user.model.js'

//Editar Rol
export const updateUserRole = async(req, res)=>{
    const { id } = req.params
    const { name, surname, username, email, password, direction, phone, ...data } = req.body
    try {
        const updateRole = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateRole) return res.status(404).send(
            {
                success: false,
                message: 'User not found, role not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Role updated successfully :)',
                updateRole
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding Role',
                err
            }
        )
    }
}
//Editar usaario
export const updateUser = async(req, res)=>{
    const { id } = req.params
    const { role, ...data } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateUser) return res.status(404).send(
            {
                success: false,
                message: 'User not found, not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated successfully :)',
                updateUser
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding User',
                err
            }
        )
    }
}

//Eliminación de cuenta de usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        const user = await User.findById(id)
        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )

        // Verificar contraseña
        const isMatch = await checkPassword(user.password, password)
        if (!isMatch) return res.status(400).send(
            {
                success: false,
                message: 'Incorrect password, can not deleted the user'
            }
        )

        // Eliminar usuario
        await User.findByIdAndDelete(id)

        return res.send(
            {
                success: true,
                message: `Account ${user.name} deleted successfully`
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

//Obtener los usuarios
export const getAll = async(req, res)=>{
    const { limit , skip } = req.query
    try {
        const users = await User.find()
            .skip(skip)
            .limit(limit)
        if(users.length === 0){
            return res.send(
                {
                    success: false,
                    message: 'Users not Found :('
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found :)',
                total: users.length,
                users
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

//Update solo por cliente   
export const updateUserClient = async(req, res)=>{
    const { id } = req.params
    const { role, ...data } = req.body
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!updateUser) return res.status(404).send(
            {
                success: false,
                message: 'User not found, not updated'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated successfully :)',
                updateUser
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding User',
                err
            }
        )
    }
}

//Eliminar del admin
export const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body
        const requestingUser = req.user // Se asume que el usuario autenticado está en req.user

        // Buscar usuario a eliminar
        const userToDelete = await User.findById(id)
        if (!userToDelete) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        // Verificar si el usuario autenticado es admin
        if (requestingUser.role === 'admin') {
            // El admin solo puede eliminar clientes o a sí mismo
            if (userToDelete.role !== 'client' && requestingUser.id !== id) {
                return res.status(403).send({
                    success: false,
                    message: 'Admins can only delete clients or their own account'
                })
            }
        }

        // Verificar contraseña antes de eliminar
        const isMatch = await checkPassword(userToDelete.password, password)
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Incorrect password, cannot delete the user'
            })
        }

        // Eliminar usuario
        await User.findByIdAndDelete(id)

        return res.send({
            success: true,
            message: `Account ${userToDelete.name} deleted successfully`
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Actualización de usuario por admin
export const updateUserClientforAdmin = async (req, res) => {
    const { id } = req.params
    const { password, role, ...data } = req.body
    try {
        // Buscar usuario a actualizar
        const userToUpdate = await User.findById(id)
        if (!userToUpdate) {
            return res.status(404).send({
                success: false,
                message: 'User not found, not updated'
            })
        }

        // Verificar si el usuario es cliente
        if (userToUpdate.role !== 'client') {
            return res.status(403).send({
                success: false,
                message: 'Only clients can be updated'
            })
        }

        // Actualizar usuario sin modificar la contraseña ni el rol
        const updatedUser = await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )

        return res.send({
            success: true,
            message: 'Client updated successfully :)',
            updatedUser
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when updating client',
            err
        })
    }
}
