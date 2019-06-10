const postNewClassAndSertifikati = (data) => {
    const qwe = sessionStorage.getItem('hijeroglif');
    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/POSTklasaisertifikati?secret=${qwe}`, {
        method: "POST",
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
            console.log(response)
            alert(`ACHTUNG !!!
            Došlo je do neke greške pri povezivanju sa serverom...
            Pokušaj malko kasnije opet :-)`)
        }
    })
}

export default postNewClassAndSertifikati;