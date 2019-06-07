const updatePohadjaniProgramAtStudent = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
        console.log("updatePohadjaniProgramAtStudent", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTpohadjaniProgramAtStudent?secret=${qwe}`, {
        body: JSON.stringify({
            data
        }),
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        return response
    })
// }
}

export default updatePohadjaniProgramAtStudent;