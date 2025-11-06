import { httpService } from './http.service'
import { utilService } from './util.service'

const BASE_URL = 'atmo/'



export const atmoService = {
    // query,
    // get,
    // save,
    // remove,
    sendConsultation,
    getCostSavingDashboard,
    getLogInsights
}

function sendConsultation(messages) {
    console.log(123, messages);

    return httpService.post(BASE_URL + 'consultation', messages)
}
function getLogInsights() {
    return httpService.get(BASE_URL + 'loganalysis')


}

function getCostSavingDashboard() {

       return httpService.get(BASE_URL + 'costsaving')

}