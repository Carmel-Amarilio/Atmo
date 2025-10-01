import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const atmoService = {
    msgAi
}

function msgAi(msg) {
    console.log("msg AI", msg);
    return msg

}