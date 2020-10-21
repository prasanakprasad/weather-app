const APIKey = '';
//function to fetch the data from the Weather API.
function fetchWeatherInfo(city) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=";
    url += city + "&appid=" + APIKey;
    // console.log("url is", url);
    return fetch(url).then(response => response.json());
}

//function to fetch the data from the WeatherAPI given the city and state and country

function fetchWeatherInfoWithStatAndCountry(city, state, country) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=";
    url = `${url}${city},{state},${country}&appid=${APIKey}`;
    // console.log("url is", url);
    return fetch(url).then(response => response.json());
}

//function to fetch the data using geographical coordinates
function fetchWeatherUsingCoord(x, y) {
    let url = "http://api.openweathermap.org/data/2.5/weather?lat=";
    url = `${url}${x}&lon=${y}&appid=${APIKey}`;
    // console.log("url is", url);
    return fetch(url).then(response => response.json());
}
let xcoord = 0;
let ycoord = 0;

function getPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
            console.log("positionInfo is", positionInfo);
            xcoord = position.coords.latitude;
            ycoord = position.coords.longitude;
            console.log("x and y are", xcoord, ycoord);
            return position;
        });
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
}
const formInput = document.querySelector('#form-input');

//create the Weather card Element which will be added to the Weather container on the Page
function createWeatherCard(place, main, description, temp, icon, from) {
    //find the html container element for the dynamic contents to be added to.
    const weatherElement = document.querySelector('.cardList');
    const cardElement = document.createElement('div');
    cardElement.className = "card list-group-item border";

    const cardHeader = document.createElement('div');
    cardHeader.style.fontSize = "2rem";
    cardHeader.className = "card-header";
    cardHeader.innerHTML = place;

    const cardBody = document.createElement('card-body');
    cardBody.style.fontSize = "1rem";
    cardBody.className = "card-body";
    cardElement.style.backgroundColor = getRandomColor();

    weatherElement.appendChild(cardElement);
    cardElement.appendChild(cardHeader);
    cardHeader.appendChild(cardBody);

    temp = temp - 273.15;
    pElement2 = document.createElement('p');
    pElement2.setAttribute("id", "temp");
    pElement2.innerHTML = Math.round(temp);
    pElement2.fontSize = "2rem";
    supElement = document.createElement('sup');
    supElement.innerHTML = "oC";
    pElement2.appendChild(supElement);
    cardBody.appendChild(pElement2);

    const imgUrl = `http://openweathermap.org/img/wn/${icon
        }@2x.png`;
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', imgUrl);
    cardBody.appendChild(imgElement);

    h4Element = document.createElement('h4');
    h4Element.setAttribute("id", "desc");
    (from === 'fromsubmit') ? h4Element.innerHTML = `${main} with ${description}` : h4Element.innerHTML = `${main} ${description}`

    cardBody.appendChild(h4Element);

    if (from === 'fromsubmit') {
        const buttonElement = document.createElement('button');
        buttonElement.className = "button  badge-secondary fav-add-button";
        buttonElement.innerHTML = "Add To Favourites";
        cardBody.appendChild(buttonElement);
    }
    /* else {
        const buttonElement = document.createElement('button');
        buttonElement.className = "button  badge-secondary fav-del-button";
        buttonElement.innerHTML = "Delete Favourites";
        cardBody.appendChild(buttonElement);
    } */
    document.querySelector('#form-place').value = "";
}

formInput.addEventListener('submit', (event) => {
    if (APIKey === '') {
        alert("Please look at the readme and provide a API Key from openweathermap for proper functioning");
    } else {
        event.preventDefault();
        let place = document.querySelector('#form-place').value;

        /* let url = "http://api.openweathermap.org/data/2.5/weather?q=";
        url += place + "&appid="; */
        if (place.indexOf(',') > 0) {
            const s = place.split(',');
            place = s[0];
            const state = s[1];
            const country = s[2];
            const fdata = fetchWeatherInfoWithStatAndCountry(place, state, country).then(json => {
                console.log("API return code ", json.cod);
                /* fetch(url).then(response => response.json()).then(json => {
                    console.log('json.statuscode', json.cod); */
                if (json.cod == 200) {
                    console.log("API fetch sucessful using city,state and Country. so rendering the html", json.weather);
                    const weather = json.weather;
                    createWeatherCard(place, json.weather[0].main, json.weather[0].description, json.main.temp, weather[0].icon, 'fromsubmit');
                }
                else {
                    alert("No City,State,Country Found.Could not get info from the server");
                    //add code here later to add this also as a card 
                }
            });
        }
        else {
            const fdata = fetchWeatherInfo(place).then(json => {
                console.log("API return code ", json.cod);
                /* fetch(url).then(response => response.json()).then(json => {
                    console.log('json.statuscode', json.cod); */
                if (json.cod == 200) {
                    console.log("API fetch sucessful using city. so rendering the html", json.weather);
                    const weather = json.weather;
                    createWeatherCard(place, json.weather[0].main, json.weather[0].description, json.main.temp, weather[0].icon, 'fromsubmit');
                }
                else {
                    alert("No City Found.Could not get info from the server");
                    //add code here later to add this also as a card 
                }
            });
        }
    }
});


const cardsContainer = document.querySelector('.cardList');
cardsContainer.addEventListener('click', (event) => {
    event.preventDefault();

    if (event.target.classList.contains("fav-add-button")) {
        // console.log("Inside addevent listener", event);

        //Find the parent node(card) and extract all the information from the card to pass to addToFavourites
        const cardBody = event.target.parentNode;
        const cardHeader = event.target.parentNode.parentNode;
        // addToFavourites(place, main, description, temp, icon)
        let place = cardHeader.innerHTML;
        place = place.substr(0, place.indexOf('<'));

        let description = cardHeader.querySelector('h4').innerHTML;
        const main = description.substr(0, description.indexOf(' '));
        description = description.substr(description.indexOf(' '));
        description = description.substr(description.indexOf(' '));

        let temp = cardHeader.querySelector('#temp').innerHTML;
        temp = temp.substr(0, temp.indexOf('<'));
        temp = Number(temp) + 273;

        let icon = cardHeader.querySelector('img').src;
        icon = icon.substr((icon.indexOf('@') - 3), 3);

        addToFavourites(place, main, description, temp, icon);
        console.log("Added the card to local Store favourites");

        //disable or make the button invisible
        const favButton = cardBody.querySelector('button');
        cardBody.removeChild(favButton);
    }
});

class card {
    constructor(place, main, description, temp, icon) {
        this.place = place;
        this.main = main;
        this.description = description;
        this.temp = temp;
        this.icon = icon;
    }
}
class cardLists {
    // cardsList = [];
    constructor(cardsList = []) {
        this.cardsList = cardsList;
        console.log("Initializing cardsList");
    }
    addCard(place, main, description, temp, icon) {
        const cardTBA = new card(place, main, description, temp, icon);
        this.cardsList.push(cardTBA);
    }
    removeCard() {

    }

}
const favCardLists = new cardLists();
function addToFavourites(place, main, description, temp, icon) {

    favCardLists.addCard(place, main, description, temp, icon);
    localStorage.setItem('favCardList', JSON.stringify(favCardLists.cardsList));

}
//this function is for loading the favourite cards from the localstorage
function loadFavouriteCards() {
    let lCardLists = localStorage.getItem('favCardList');
    lCardLists = JSON.parse(lCardLists);
    if (lCardLists !== null) {
        // Loop through the cardsList and call createWeatherCard
        // favCardLists = favCardLists.cardsList;
        for (let i = 0; i < lCardLists.length; i++) {
            console.log("Inside for loop", lCardLists[i].place, lCardLists[i].main, lCardLists[i].description, lCardLists[i].temp, lCardLists[i].icon);
            createWeatherCard(lCardLists[i].place, lCardLists[i].main, lCardLists[i].description, lCardLists[i].temp, lCardLists[i].icon, 'from store');
            favCardLists.cardsList = lCardLists;
        }
        favCardsLists = new cardLists(lCardLists);
    }
    else { console.log("No favourite cards in Local Store"); }
}
const cleanFavButton = document.querySelector('#clean-fav-button');
cleanFavButton.addEventListener('click', (event) => {
    console.log("Clearing up the local Store");
    localStorage.clear();
    document.querySelector('.cardList').innerHTML = "";
});

const localWeatherButton = document.querySelector('#form-local-button');
localWeatherButton.addEventListener('click', (event) => {
    // getPosition();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
            console.log("positionInfo is", positionInfo);
            xcoord = position.coords.latitude;
            ycoord = position.coords.longitude;
            console.log("x and y are", xcoord, ycoord);
            // return position;
            console.log("xcoord", xcoord);
            console.log("ycoord", ycoord);
            if (APIKey === '') {
                alert("Please look at the readme and provide a API Key from openweathermap for proper functioning");
            } else {
                fetchWeatherUsingCoord(xcoord, ycoord).then(json => {
                    console.log("API return code ", json.cod);
                    /* fetch(url).then(response => response.json()).then(json => {
                        console.log('json.statuscode', json.cod); */
                    if (json.cod == 200) {
                        console.log("API fetch sucessful using coordinates. Rendering the html", json.weather);
                        const weather = json.weather;
                        createWeatherCard("Local Weather", json.weather[0].main, json.weather[0].description, json.main.temp, weather[0].icon, 'fromsubmit');
                    }
                    else {
                        alert("Co ordinates Not Found.Could not get info from the server");
                        //add code here later to add this also as a card 
                    }
                });
            }
        });
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
});

function getRandomColor() {
    const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
    let hexcolor = "#";
    for (let i = 0; i < 6; i++) {
        console.log("colors", colors[Math.floor(Math.random() * colors.length)]);
        hexcolor += colors[Math.floor(Math.random() * colors.length)];
    }
    console.log("color is", hexcolor);
    return hexcolor;
}