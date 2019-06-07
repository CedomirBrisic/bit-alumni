const getStudents = () => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("getStudents", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETStudenti?secret=${qwe}`)
        .then((response) => {
            const values = response.json()
            return values
        })
    // }
};

export default getStudents