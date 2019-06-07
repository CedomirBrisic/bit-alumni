const getFirms = () => {
    const qwe = sessionStorage.getItem('hijeroglif');
    // if (qwe !== null) {
    console.log("getFirms", qwe)

    return fetch(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/bit-alumni-app-dqykh/service/http/incoming_webhook/GETfirm?secret=${qwe}`)
        .then((response) => {
            const values = response.json()
            return values
        })
    // }
};

export default getFirms