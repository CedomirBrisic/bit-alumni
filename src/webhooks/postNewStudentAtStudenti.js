const postNewStudentAtStudenti = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("postNewStudentAtStudenti", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/POSTstudenti?secret=${qwe}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data
        })
    }).then((response) => {
        return response
    })
// }
}

export default postNewStudentAtStudenti;