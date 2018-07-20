const POSTAPIUSER = (link, user, tagname) => {
    return (fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            user: user,
            tagname: tagname
        })
    }))
    .then(response => response.json())
}

export default POSTAPIUSER;