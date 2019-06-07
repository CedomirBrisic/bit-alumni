const updateStudentKomunikacija = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    console.log("updateStudentKomunikacija", qwe)

    // if (qwe !== null) {
    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTkomunikacijaAtStudent?secret=${qwe}`, {
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

export default updateStudentKomunikacija;