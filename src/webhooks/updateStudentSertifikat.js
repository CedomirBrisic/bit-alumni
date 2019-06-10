const updateStudentSertifikat = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTsertifikatAtStudent?secret=${qwe}`, {
        body: JSON.stringify({
            data
        }),
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if (response.ok) {
            return response
        } else {
            console.log(response)
            alert(`ACHTUNG !!!
            Došlo je do neke greške pri povezivanju sa serverom...
            Pokušaj malko kasnije opet :-)`)
        }
    })
}

export default updateStudentSertifikat;