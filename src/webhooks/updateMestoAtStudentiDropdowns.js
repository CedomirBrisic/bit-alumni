const updateMestoAtStudentiDropdowns = (mesto) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("updateMestoAtStudentiDropdowns", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTmestoAtStudentiDropdowns?secret=${qwe}`, {
        body: JSON.stringify({
            mesto
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

export default updateMestoAtStudentiDropdowns;