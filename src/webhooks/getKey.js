const getKey = (key) => {

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/webhook0?secret=${key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        const values = response.json()
        return values
    })
}

export default getKey;