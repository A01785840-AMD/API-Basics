// CONST //
const endpointSelectMethod = document.getElementById('endpoint-method-select');
const endpointSelectUrl = document.getElementById('endpoint-url-select');
const endpointInputId = document.getElementById('endpoint-id-input');

const result_msg = document.getElementById("results-msg");
const test_btn = document.getElementById("test-btn");

const results = document.getElementById('results');


// UTILS //
let users_ids = [];
let items_ids = [];

const get_ids = (data, ids) => {
    data.forEach((obj) => {
        ids.push(obj.id);
    });
};

const displayResponse = (response) => {
    if (typeof response === 'object') {
        results.innerHTML = JSON.stringify(response, null, 2);
    } else {
        results.innerHTML = response;
    }
};

const updateResultStatus = (isSuccess, message) => {
    result_msg.innerText = message;
    result_msg.classList.remove('successful', 'fail');
    result_msg.classList.add(isSuccess ? 'successful' : 'fail');
};

const showDataForm = (method, endpoint) => {
    const needsForm = ['POST', 'PATCH'].includes(method);

    let formContainer = document.getElementById('data-form-container');
    if (!formContainer) {
        formContainer = document.createElement('div');
        formContainer.id = 'data-form-container';
        formContainer.style.marginBottom = '1.5rem';

        const testSelector = document.getElementById('test-selector');
        testSelector.parentNode.insertBefore(formContainer, testSelector.nextSibling);
    }

    if (!needsForm) {
        formContainer.style.display = 'none';
        return;
    }

    let fields = [];
    if (endpoint === 'users') {
        fields = [
            { name: 'name', type: 'text', placeholder: 'User Name' },
            { name: 'email', type: 'email', placeholder: 'user@example.com' }
        ];

        if (method === 'PATCH') {
            fields.push({ name: 'items', type: 'text', placeholder: 'Item IDs (comma separated)' });
        }
    } else if (endpoint === 'items') {
        fields = [
            { name: 'name', type: 'text', placeholder: 'Item Name' },
            { name: 'type', type: 'text', placeholder: 'Item Type' },
            { name: 'effect', type: 'text', placeholder: 'Item Effect' }
        ];
    }

    let formHTML = `
            <div class="form-container">
                <h2>${method} ${endpoint.toUpperCase()}</h2>
                <form id="data-form">
        `;

    fields.forEach(field => {
        formHTML += `
                <div class="form-group">
                    <label for="${field.name}">${field.name.charAt(0).toUpperCase() + field.name.slice(1)}:</label>
                    <input
                        type="${field.type}"
                        id="${field.name}"
                        name="${field.name}"
                        placeholder="${field.placeholder}"
                        ${method === 'POST' ? 'required' : ''}
                    />
                </div>
            `;
    });

    formHTML += `
                </form>
            </div>
        `;

    formContainer.innerHTML = formHTML;
    formContainer.style.display = 'block';
};

const merge = (id, data) => {
    const base = {};

    if (typeof id === 'number') {
        base.id = id;
    }

    if (data && typeof data === 'object') {
        Object.assign(base, data);
    }

    return base;
};

const updateIdPlaceholder = (selectedEndpoint) => {
    const ids = selectedEndpoint === 'users' ? users_ids : items_ids;
    const methodValue = endpointSelectMethod.value;
    const needsId = ['GET', 'DELETE', 'PATCH'].includes(methodValue);

    if (needsId && ids.length > 0) {
        const minId = Math.min(...ids);
        const maxId = Math.max(...ids);
        endpointInputId.placeholder = `ID range: ${minId}-${maxId}`;
    } else {
        endpointInputId.placeholder = 'ID range unknown';
    }

    endpointInputId.style.display = needsId ? 'block' : 'none';
};

// API //
async function updateIds() {
    items_ids = [];
    users_ids = [];
    await fetch('http://localhost:3000/users').then(res => res.json()).then(data => get_ids(data, users_ids));
    await fetch('http://localhost:3000/items').then(res => res.json()).then(data => get_ids(data, items_ids));
}

async function fetchUsers(method, data) {
    let res = null;
    switch (method) {

    }

    return res;
}

async function fetchItems(method, data) {
    let res = null;
    switch (method) {
        case 'DELETE':
            res = await test_deleteItem(data.id);
            break;
    }

    return res;
}

async function fetchAndUpdate(method, endpoint, data) {
    let res = null;

    try {
        switch (endpoint) {
            case 'users':
                res = await fetchUsers(method, data);
                break;
            case 'items':
                res = await fetchItems(method, data);
                break;
        }

        updateResultStatus(res !== null, "Successful");
    } catch (error) {
        console.error('fetchAndUpdate error:', error);
        updateResultStatus(false, { message: error.message });
    }
}


// LISTENERS //

endpointSelectMethod.addEventListener('change', function () {
    const method = this.value;
    const endpoint = endpointSelectUrl.value;

    updateIdPlaceholder(endpoint);
    showDataForm(method, endpoint);

    console.log('Selected method:', method);
});

endpointSelectUrl.addEventListener('change', function () {
    const method = endpointSelectMethod.value;
    const endpoint = this.value;

    updateIdPlaceholder(endpoint);
    showDataForm(method, endpoint);

    console.log('Selected endpoint:', endpoint);
});

test_btn.addEventListener('click', async function () {
    const method = endpointSelectMethod.value;
    const endpoint = endpointSelectUrl.value;
    const id = endpointInputId.value;
    let formData = null;

    if (['POST', 'PATCH'].includes(method)) {
        const form = document.getElementById('data-form');
        if (form) {
            formData = {};
            const formElements = form.elements;

            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name && element.value) {
                    if (element.name === 'items' && element.value) {
                        formData[element.name] = element.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    } else {
                        formData[element.name] = element.value;
                    }
                }
            }

            if (Object.keys(formData).length === 0) {
                formData = null;
            }
        }
    }

    if ((method === 'GET' || method === 'DELETE' || method === 'PATCH') && !id) {
        updateResultStatus(false, `Failed: ID is required for ${method}`);
        displayResponse(`Error: Please provide an ID for ${method} request`);
        return;
    }

    if ((method === 'POST' || method === 'PATCH') && !formData) {
        updateResultStatus(false, `Failed: Data is required for ${method}`);
        displayResponse(`Error: Please provide data for ${method} request`);
        return;
    }

    const requestDetails = `Preparing ${method} request to /${endpoint}${id ? '/' + id : ''}...`;
    const dataDetails = formData ? `\nWith data: ${JSON.stringify(formData, null, 2)}` : '';
    displayResponse(requestDetails + dataDetails);

    console.log({
        method, endpoint, id, formData
    });

    updateResultStatus(true, "Request prepared");
    await fetchAndUpdate(method, endpoint, merge(id, formData));
});


// INIT //

showDataForm(endpointSelectMethod.value, endpointSelectUrl.value);
updateIdPlaceholder(endpointSelectUrl.value);
displayResponse("Select endpoint and click TEST");
updateResultStatus(false, "No test run yet");
updateIds();
