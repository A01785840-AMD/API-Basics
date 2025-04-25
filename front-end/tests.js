const API_URL = 'http://localhost:3000/';


async function test_patchUser(id, updateData) {
    return await fetch(`${API_URL}users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => console.log(result))
        .catch(error => console.error('[ TEST ERROR ]', error));
}

