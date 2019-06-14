const updatePaymentsAtStudent = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/PUTplacanjeAtStudent?secret=${qwe}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data
        })
    }).then((response) => {
        if (response.ok) {
            return response
        } else {
            alert(`ACHTUNG !!!
            Došlo je do neke greške pri povezivanju sa serverom...
            Pokušaj malko kasnije opet :-)`)
        }
    })
}

export default updatePaymentsAtStudent;