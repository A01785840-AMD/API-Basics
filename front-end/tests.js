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
        return result;
    }).catch(error => {
        console.error('[ TEST ERROR ] ', error);
    });
}

async function test_getItems() {
    return await fetch(API_URL + 'items')
        .then(response => response.json())
        .then(data => {
            console.log('[GET] All Items:', data);
            return data;
        })
        .catch(error => {
            console.error('[ TEST ERROR - GET ]', error);
        });
}

async function test_getItemById(id) {
    return await fetch(`${API_URL}items/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(`[GET] Item ID ${id}:`, data);
            return data;
        })
        .catch(error => {
            console.error('[ TEST ERROR - GET BY ID ]', error);
        });
}

async function test_patchItem(id, data_) {
    return await fetch(`${API_URL}items/${id}`, {
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
            console.log(`[PATCH] Item ID ${id}:`, data);
            return data;
        })
        .catch(error => {
            console.error('[ TEST ERROR - PATCH ]', error);
        });
}

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
            return data;
        })
        .catch(error => {
            console.error('[ TEST ERROR - DELETE ]', error);
        });
}

async function test_postUsers(data) {
    console.log(data);
    return await fetch(API_URL + 'users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.error('[ TEST ERROR ]', error));
}



async function test_getUsers() {
    return await fetch(API_URL + 'users')
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.error('[ TEST ERROR ]', error));
}




async function test_getUserById(id) {
    return await fetch(`${API_URL}users/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => {
            console.log(result)
            return result;
        })
        .catch(error => console.error('[ TEST ERROR ]', error));
}




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
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.error('[ TEST ERROR ]', error));
}




async function test_deleteUser(id) {
    return await fetch(`${API_URL}users/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
            return response.json();
        })
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.error('[ TEST ERROR ]', error));
}

