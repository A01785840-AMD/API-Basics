const API_URL = 'http://localhost:3000/';

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

