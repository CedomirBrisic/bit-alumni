const updateObrazovanjeAtStudentiDropdowns = (obrazovanje) => {
    return fetch("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTobrazovanjeAtStudentiDropdowns", {
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
}

export default updateObrazovanjeAtStudentiDropdowns;