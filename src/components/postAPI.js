
const POSTAPI = (link,data) => {
    return (fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: data
    }))
        .then(response =>
            respone => respone.json()
        
            
        )

}

export default POSTAPI;