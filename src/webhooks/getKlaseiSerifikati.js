const getKlaseiSertifikati = () => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("getKlaseiSertifikati", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETklaseisertifikati?secret=${qwe}`)
        .then((response) => {
            const values = response.json()
            console.log("getKlaseiSertifikati", values)
            return values
        })
    // }
};

export default getKlaseiSertifikati