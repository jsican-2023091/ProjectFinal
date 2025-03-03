import User from '../src/user/user.model.js'
import Category from '../src/category/category.model.js'

import { encrypt } from '../utils/encrypt.js'

export const createAdminUser = async () => {
    try {
        const existingUser = await User.findOne({ username: 'Admin' })
        if(existingUser) {
            console.log('Admin user already exist')
            return
        }

        const passwordHaah = await encrypt('Admin|123')

        const user = new User (
            {
                name: 'Jeff',
                surname: 'Sican',
                username: 'Admin',
                email: 'Admin123@gmail.com',
                password: passwordHaah,
                direction: '22av 22calle zona 1',
                phone: '45895623',
                role: 'ADMIN',
                
            }
        )

        await user.save()
    } catch (err) {
        console.error(
            'Error creating admin user',
            err
        )
    }
}


export const createCategory = async() => {
    try {
        const existingCategory = await Category.findOne({name: 'Default'})
        if(existingCategory) {
            console.log('Category default already exist')
            return
        }
        const category = new Category(
            {
                name: 'Default',
                description: 'Category is default'
            }
        )

        await category.save()
    } catch (err) {
        console.error(
            'General error with saving category',
            err
        )
    }
}