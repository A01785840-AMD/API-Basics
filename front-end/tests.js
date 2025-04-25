const API_URL = 'http://localhost:3000/';

async function test_postItems(data) {

    console.log(data);
    return await fetch(API_URL + 'items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }
        return response.json();
    }).then(result => {
        console.log(result);
    }).catch(error => {
        console.error('[ TEST ERROR ] ', error);
    });
}

async function test_getItems() {
    return await fetch(API_URL + 'items')
        .then(response => response.json())
        .then(data => {
            console.log('[GET] All Items:', data);
        })
        .catch(error => {
            console.error('[ TEST ERROR - GET ]', error);
        });
}

