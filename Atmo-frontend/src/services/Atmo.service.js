import { httpService } from './http.service'
import { utilService } from './util.service'

const BASE_URL = 'atmo/'



export const atmoService = {
    // query,
    // get,
    // save,
    // remove,
    sendConsultation
}

function sendConsultation(messages) {
    console.log(123, messages);

    return httpService.post(BASE_URL + 'consultation', messages)
}