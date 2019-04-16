const postNewProgramiAndSertifikati = (data) => {
    return fetch("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/POSTprogramAndSertifikat", {
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
}

export default postNewProgramiAndSertifikati;