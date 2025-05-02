const url = 'http://localhost:8090/listDeviceType';  // Replace with your API endpoint

fetch(url, {
    method: 'GET',
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));