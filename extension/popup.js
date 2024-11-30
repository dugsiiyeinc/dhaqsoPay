// Function to save data locally using chrome.storage
function saveData(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
        console.log(`Data saved locally: ${key} = ${value}`);
    });
}

// Function to retrieve data from local storage
function getData(key, callback) {
    chrome.storage.local.get([key], (result) => {
        console.log(`Data retrieved locally: ${key} = ${result[key]}`);
        callback(result[key]);
    });
}

// Function to fetch GitHub user data
async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error('User not found');
        }
        const data = await response.json();
        // Display the fetched username
        document.getElementById('response').innerText = `Username la soo helay: ${data.login}`;
        // Save the last searched username
        saveData('lastFetchedUser', data.login);
    } catch (error) {
        document.getElementById('response').innerText = 'Error: ' + error.message;
    }
}

// Event listener for the "Search" button
document.getElementById('search-user').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        fetchGitHubUser(username);
    } else {
        document.getElementById('response').innerText = 'Please enter a username';
    }
});

// Retrieve and display the last saved user data on popup load
window.onload = () => {
    getData('lastFetchedUser', (lastFetchedUser) => {
        if (lastFetchedUser) {
            document.getElementById('response').innerText = `Last searched user: ${lastFetchedUser}`;
        }
    });
};
