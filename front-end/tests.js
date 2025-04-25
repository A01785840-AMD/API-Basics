const API_URL = 'http://localhost:3000/';


async function test_patchItem(data_) {
    return await fetch(`${API_URL}items/${data_.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(`[PATCH] Item ID ${data_.id}:`, data);
        })
        .catch(error => {
            console.error('[ TEST ERROR - PATCH ]', error);
        });
}

