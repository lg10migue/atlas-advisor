// Get the button elements.
const searchButton = document.getElementById("search-btn");
const clearButton = document.getElementById("clear-btn");
const searchInput = document.getElementById("search-input");
const homeContent = document.getElementById("content-container");
const recommendationsContainer = document.getElementById("recommendations");

function fetchTravelData() {
    fetch("travel_recommendation.json")
        .then((response) => response.json())
        .then((data) => searchRecommendations(data))
        .catch((error) => {
            console.error(error);
        });
}

function searchRecommendations(fullData) {
    const searchValue = searchInput.value.toLowerCase();
    let filteredData = [];
    if (searchValue === "") {
        alert("Please enter a search value.");
        return;
    } else if (searchValue.includes("countries")) {
        alert("Please enter a valid search value.");
        return;
    }

    // Search by category.
    Object.keys(fullData).forEach((key) => {
        if (key.toLowerCase().includes(searchValue)) {
            filteredData = fullData[key];
        } else if (searchValue.includes("country")) {
            fullData.countries.forEach((country) => {
                filteredData = filteredData.concat(country.cities);
            });

            // Display 3 random recommendations.
            filteredData = getRadomRecommendations(filteredData);
        }
    });

    // Search by country.
    fullData.countries.forEach((country) => {
        if (country.name.toLowerCase().includes(searchValue)) {
            filteredData = country.cities;
        }
    });

    if (filteredData.length === 0) {
        alert("No recommendations found.");
        return;
    }

    displayRecommendations(filteredData);
}

function displayRecommendations(dataArray) {
    // Clear current recommendations.
    clearRecommendations();

    // Add a class to the content container to display the recommendations in two columns.
    homeContent.classList.add("two-columns");

    // Display the filtered data.
    dataArray.forEach((recommendation) => {
        const recommendationElement = document.createElement("div");
        recommendationElement.classList.add("recommendation");
        recommendationElement.innerHTML = `
            <img src="images/${recommendation.imageUrl}" alt="${
            recommendation.name
        }" />
            <h2>${recommendation.name}</h2>
            <p>${recommendation.description}</p>
            <p><b>Current Time: ${getCurrentTime(
                recommendation.timeZone
            )}</b></p>
            <button type="button" class="book-btn">Visit!</button>
        `;
        recommendationsContainer.appendChild(recommendationElement);
    });
}

function clearRecommendations() {
    // Clear the recommendations.
    homeContent.classList.remove("two-columns");
    recommendationsContainer.innerHTML = "";
}

function clearSearchBar() {
    searchInput.value = "";
}

function getCurrentTime(timeZone) {
    const date = new Date();
    const options = {
        timeZone: timeZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
}

function getRadomRecommendations(array) {
    const randomRecommendations = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        randomRecommendations.push(array[randomIndex]);
    }
    return randomRecommendations;
}

searchButton.addEventListener("click", fetchTravelData);
clearButton.addEventListener("click", clearSearchBar);
