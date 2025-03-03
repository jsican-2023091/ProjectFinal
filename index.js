//Ejecutar el proyecto
import { initServer } from './configs/app.js'
import { config } from 'dotenv'
import { connect } from './configs/mongo.js'
import { createAdminUser, createCategory } from './configs/init.js'

config()
initServer()
createAdminUser()
createCategory()
connect()