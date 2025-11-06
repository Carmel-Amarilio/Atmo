import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getHealthyCheck, sendConsultation, sendCostSaving, sendLogAnalysis } from './atmo.controller.js'

export const atmoRoutes = express.Router()


atmoRoutes.get('/healthy', getHealthyCheck)
atmoRoutes.post('/consultation', requireAuth, sendConsultation)
atmoRoutes.get('/costsaving', requireAuth, sendCostSaving)
atmoRoutes.get('/loganalysis', requireAuth, sendLogAnalysis)


