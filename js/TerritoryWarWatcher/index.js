const isCityPage = window.location.href.includes('https://www.torn.com/city.php');

// Retrieve stored values from localStorage
var storedApiKey = localStorage.getItem('territoryWarApiKey') || '';
var storedTtToStalk = localStorage.getItem('territoryWarTtToStalk') || 'NFF';
var storedPollingRate = localStorage.getItem('territoryWarPollingRate') || '30';
var storedPause = localStorage.getItem('territoryWarPause') || 'false';

// Create input elements for API key, faction to stalk, and polling rate
var apiKeyInput = document.createElement('input');
apiKeyInput.type = 'text';
apiKeyInput.value = storedApiKey;
apiKeyInput.placeholder = 'Enter API key';

var apiKeyLabel = document.createElement('label');
apiKeyLabel.innerText = 'API Key: ';
apiKeyLabel.appendChild(apiKeyInput);

var ttToStalkInput = document.createElement('input');
ttToStalkInput.type = 'text';
ttToStalkInput.value = storedTtToStalk;
ttToStalkInput.placeholder = 'Enter territory to stalk';

var ttToStalkLabel = document.createElement('label');
ttToStalkLabel.innerText = 'Territory to Stalk: ';
ttToStalkLabel.appendChild(ttToStalkInput);

var pollingRateInput = document.createElement('input');
pollingRateInput.type = 'text';
pollingRateInput.value = storedPollingRate;
pollingRateInput.placeholder = 'Enter polling rate (in seconds)';

var pollingRateLabel = document.createElement('label');
pollingRateLabel.innerText = 'Polling Rate: ';
pollingRateLabel.appendChild(pollingRateInput);

// Create styled toggle switch for pause/resume
var pauseToggleLabel = document.createElement('label');
pauseToggleLabel.classList.add('toggle-switch');

var pauseToggleButton = document.createElement('input');
pauseToggleButton.type = 'checkbox';
pauseToggleButton.checked = storedPause === 'true';

var pauseToggleSlider = document.createElement('span');
pauseToggleSlider.classList.add('slider', 'round');

pauseToggleLabel.appendChild(pauseToggleButton);
pauseToggleLabel.appendChild(pauseToggleSlider);

// Create save button to store settings
var saveButton = document.createElement('button');
saveButton.innerText = 'Save';
saveButton.classList.add('save-button');

// Create clear button to clear settings
var clearButton = document.createElement('button');
clearButton.innerText = 'Clear';
clearButton.classList.add('clear-button');

var intervalId = null;

// Retrieve stored values or default values if not present
var apiKey = storedApiKey || '';
var ttToStalk = storedTtToStalk || 'NFF';
var pollingRate = parseInt(storedPollingRate) || 30;

var previousWarValue = null;

const build = () => {
    if (isCityPage) {
        // Append inputs and buttons to a container div
        var containerDiv = document.createElement('div');
        containerDiv.classList.add('territory-war-container');
        containerDiv.appendChild(apiKeyLabel);
        containerDiv.appendChild(ttToStalkLabel);
        containerDiv.appendChild(pollingRateLabel);
        containerDiv.appendChild(pauseToggleLabel);
        containerDiv.appendChild(saveButton);
        containerDiv.appendChild(clearButton);

        // Insert the container div at the top of the content-wrapper
        var contentWrapper = document.querySelector('.content-wrapper');
        contentWrapper.insertBefore(containerDiv, contentWrapper.firstChild);

        // Add event listener to save button
        saveButton.addEventListener('click', function() {
            // Store values in localStorage
            localStorage.setItem('territoryWarApiKey', apiKeyInput.value);
            localStorage.setItem('territoryWarTtToStalk', ttToStalkInput.value);
            localStorage.setItem('territoryWarPollingRate', pollingRateInput.value);
        });

        // Add event listener to clear button
        clearButton.addEventListener('click', function() {
            // Clear values and localStorage
            apiKeyInput.value = '';
            ttToStalkInput.value = '';
            pollingRateInput.value = '';
            pauseToggleButton.checked = false;
            localStorage.clear();
        });
    }


// Add event listener to toggle button
    pauseToggleButton.addEventListener('change', function() {
        // Store pause state in localStorage
        localStorage.setItem('territoryWarPause', pauseToggleButton.checked.toString());

        if (pauseToggleButton.checked) {
            // If paused, clear the interval
            clearInterval(intervalId);
        } else {
            // If resumed, start checking war value
            intervalId = setInterval(checkWarValue, pollingRate * 1000);
        }
    });
};


function checkWarValue() {
    console.log('Checking Territory')
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const currentWarValue = response.territory[ttToStalk].war.assaulting_faction;

            if (previousWarValue !== null && previousWarValue !== currentWarValue) {
                pauseToggleButton.checked = true; // Pause when war value changes
                playNotificationSound();
                alert('The territory ' + ttToStalk + ' has changed!');
                window.location = 'https://www.torn.com/city.php#terrName=' + ttToStalk;
            }

            previousWarValue = currentWarValue;
        }
    };

    xhr.open('GET', 'https://api.torn.com/torn/' + ttToStalk + '?selections=territory&key=' + apiKey + '&comment=Stalk' + ttToStalk, true);
    xhr.send();
}

function playNotificationSound() {
    var audio = new Audio('https://freesound.orghttps://cdn.freesound.org/previews/613/613650_12364629-lq.mp3');
    audio.play();
}



// Start checking war value if not paused
if (!pauseToggleButton.checked) {
    intervalId = setInterval(checkWarValue, pollingRate * 1000);
}

var styleElement = document.createElement('style');

// Define the CSS rules
var css = `
  .territory-war-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .territory-war-container label {
        margin-right: 10px;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .clear-button {
        padding: 5px 10px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .clear-button:hover {
        background-color: #d32f2f;
    }

    .save-button {
        padding: 5px 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .save-button:hover {
        background-color: #45a049;
    }
`;

// Set the CSS text of the <style> element
styleElement.textContent = css;

// Append the <style> element to the document's <head>
document.head.appendChild(styleElement);