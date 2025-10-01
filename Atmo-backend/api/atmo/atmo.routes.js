import express from 'express'
import { getHealthyCheck, sendConsultation } from './atmo.controller.js'

export const atmoRoutes = express.Router()


atmoRoutes.get('/healthy', getHealthyCheck)
atmoRoutes.post('/consultation', sendConsultation)


