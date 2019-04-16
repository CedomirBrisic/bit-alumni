const getStudents = () => {
    return fetch("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETStudenti")
        .then((response) => {
            const values = response.json()
            return values
        })
};

export default getStudents