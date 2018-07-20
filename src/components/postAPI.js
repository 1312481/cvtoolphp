
const POSTAPI = (link,data) => {
    return (fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: data
    }))
        .then(response =>
            response.json()
        )

}

export default POSTAPI;