const axios = require('axios');
// const {ipcRenderer} = require("electron");

// config axios
axios.defaults.baseURL = 'http://localhost:8081';


let result = document.querySelector('#result')

// front processing
ipcRenderer.on('asynchronous-reply', function (event, args) {
    console.log(args)

    if (args === 'fp') {
        axios.get('/ocr')
            .then(function (response) {
                // handle success
                console.log(response)
                console.log(response.data);
                result.textContent = response.data
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    } else if (args === 'fp-error') {
        result.textContent = "Screenshots not acquired"
    }

    // todo back the status
})
