const API_URL = 'http://localhost:3000/';


async function test_deleteUser(id) {
    return await fetch(`${API_URL}users/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => console.log(result))
        .catch(error => console.error('[ TEST ERROR ]', error));
}

