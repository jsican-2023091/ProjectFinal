//Lógica de autenticación
import User from '../user/user.model.js'
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const test = (req, res)=>{
    console.log('Test is running')
    return res.send({message: 'Test is running'})
}

//Register 

export const register = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        await user.save()
        return res.send(
            {
                message: `Registred successfully, can be logger with username: ${user.username}`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General Error with rigestering user', 
                err
            }
        )
    }
}

export const registerAdmin = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        await user.save()
        return res.send(
            {
                message: `Registred successfully, can be logger with username: ${user.username}`
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General Error with rigestering user', 
                err
            }
        )
    }
}

//Login
export const login = async(req, res)=>{
    try {
        //Capturamos datos
        let { userLoggin, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne(
            {
                $or: [
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        )
        //Verificar que la contrasela coincida
        if(user && await checkPassword(user.password, password)){
            let loggerUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            //Generamos el Token
            let token = await generateJwt(loggerUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggerUser,
                    token
                }
            )
        }
        return res.status(400).send(
            {
                message: 'Wrong email or password'
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General error with login function'
            }
        )
    }
}