const API_URL = 'http://localhost:3000/';


async function test_deleteItem(id) {
    return await fetch(`${API_URL}items/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(`[DELETE] Item ID ${id}:`, data);
        })
        .catch(error => {
            console.error('[ TEST ERROR - DELETE ]', error);
        });
}

