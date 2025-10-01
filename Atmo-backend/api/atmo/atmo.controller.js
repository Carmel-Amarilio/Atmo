import { logger } from "../../services/logger.service.js"
import { atmoService } from "./atmo.service.js";


export function getHealthyCheck(req, res) {
    logger.error('Healthy')
    res.status(200).json('Healthy')
}

export async function sendConsultation(req, res) {
    try {
        const messages = req.body
        // console.log(messages);

        const respondsMessages = await atmoService.msgAi(messages)
        res.json(respondsMessages)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}