import { logger } from "../../services/logger.service.js"
import { atmoCostService } from "./atmo.cost.js";
import { atmoLogsService } from "./atmo.logs.js";
import { atmoService } from "./atmo.service.js";


export function getHealthyCheck(req, res) {
    logger.error('Healthy')
    res.status(200).json('Healthy')
}

export async function sendConsultation(req, res) {
    const { loggedinUser } = req
    try {
        const messages = req.body

        const respondsMessages = await atmoService.msgAi(messages, loggedinUser)
        res.json(respondsMessages)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}
export async function sendLogAnalysis(req, res) {
    const { loggedinUser } = req
    try {
        const result  = await atmoLogsService.logsAI(loggedinUser)
        res.json(result)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}


export async function sendCostSaving(req, res) {
    const { loggedinUser } = req
    try {
        const responds = await atmoCostService.costAI(loggedinUser)
        res.json(responds)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}