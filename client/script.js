console.log('Script is working!');

let currentData = {};

// fetch call to get all our data
fetch("/people")
.then((data) => data.json())
.then((results) => currentData = results);

const body = document.body;
const resultsButton = document.querySelector("#results-button");

resultsButton.addEventListener('click', (e) => {
    for (let index in currentData) {
        // create a div
        const div = document.createElement('div');
        // add text to that div
        div.textContent = currentData[index].name;
        // append that div to the body
        body.appendChild(div);
    }
});