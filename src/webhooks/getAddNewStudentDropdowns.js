const getAddNewStudentDropdowns = () => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("getAddNewStudentDropdowns", qwe)

        return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETaddNewStudentDropdowns?secret=${qwe}`)
        .then((response) => {
            const values = response.json()
            return values
        })
    // }
};

export default getAddNewStudentDropdowns