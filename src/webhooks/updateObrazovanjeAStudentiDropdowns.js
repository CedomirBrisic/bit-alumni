const updateObrazovanjeAtStudentiDropdowns = (obrazovanje) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("updateObrazovanjeAtStudentiDropdowns", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTobrazovanjeAtStudentiDropdowns?secret=${qwe}`, {
        body: JSON.stringify({
            obrazovanje
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

export default updateObrazovanjeAtStudentiDropdowns;