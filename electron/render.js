const axios = require('axios');
axios.defaults.baseURL = 'https://api.example.com';

let name = document.querySelector('#name')
let result = document.querySelector('#result')

let ocr_button = document.querySelector('#capture')

ocr_button.addEventListener('click', () => {
    console.log("click event")
    axios.get('/ocr')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
})


// name.dispatchEvent(new Event('input'))
//
// name.addEventListener('input', () => {
//     client.invoke("hello", name.value, (error, res) => {
//         if (error) {
//             console.error(error)
//         } else {
//             result.textContent = res
//         }
//     })
// })
// name.dispatchEvent(new Event('input'))
