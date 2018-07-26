const POSTAPIDATA = (link, data, tagname,user) => {
    return (fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            data: data,
            tagname: tagname,
            user: user
        })
    }))
    .then(response => response.json())
}

export default POSTAPIDATA;