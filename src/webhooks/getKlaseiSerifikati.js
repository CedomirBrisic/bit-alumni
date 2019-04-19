const getKlaseiSertifikati = () => {
    return fetch("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETklaseisertifikati")
        .then((response) => {
            const values = response.json()
            return values
        })
};

export default getKlaseiSertifikati