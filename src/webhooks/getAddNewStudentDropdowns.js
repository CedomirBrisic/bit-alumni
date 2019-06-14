const getAddNewStudentDropdowns = () => {
    const qwe = sessionStorage.getItem('hijeroglif');
    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETaddNewStudentDropdowns?secret=${qwe}`)
        .then((response) => {
            if (response.ok) {
                const values = response.json()
                return values
            } else {
                alert(`ACHTUNG !!!
                Došlo je do neke greške pri povezivanju sa serverom...
                Pokušaj malko kasnije opet :-)`)
            }
        })
};

export default getAddNewStudentDropdowns