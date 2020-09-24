function fetchWeatherInfo(city) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=";
    // const loc = document.querySelector('#loc').value;
    console.log("city is", city);
    url += city + "&appid=67be3f3781487fb4955817a37e61dfb4";
    console.log("url is", url);
    return fetch(url).then(response => response.json());
}
const formInput = document.querySelector('#form-input');

formInput.addEventListener('submit', (event) => {
    event.preventDefault();
    const place = document.querySelector('#form-place').value;
    console.log("place is", place);
    let url = "http://api.openweathermap.org/data/2.5/weather?q=";
    url += place + "&appid=67be3f3781487fb4955817a37e61dfb4";
    fetch(url).then(response => response.json()).then(json => {
        console.log('json.statuscode', json.cod);
        if (json.cod == 200) {
            console.log("populating the html", json.weather);
            const weather = json.weather;
            console.log("populating the html its type is", weather[0].main);
            const weatherElement = document.querySelector('.weather');
            const cardElement = document.createElement('div');
            cardElement.className = "card list-group-item border";
            // cardElement.innerHTML = `Weather in ${place}`;
            const cardHeader = document.createElement('div');
            cardHeader.style.fontSize = "2rem";
            cardHeader.className = "card-header";
            cardHeader.innerHTML = place;
            const cardBody = document.createElement('card-body');
            cardBody.style.fontSize = "1rem";
            cardBody.className = "card-body";
            weatherElement.appendChild(cardElement);
            cardElement.appendChild(cardHeader);
            cardHeader.appendChild(cardBody);
            pElement = document.createElement('p');
            pElement.innerHTML = `${json.weather[0].main} with ${json.weather[0].description}`;
            cardBody.appendChild(pElement);

            let temp = json.main.temp;
            temp = temp - 273.15;
            pElement2 = document.createElement('p');
            pElement2.innerHTML = Math.round(temp);
            supElement = document.createElement('sup');
            supElement.innerHTML = "oC";
            pElement2.appendChild(supElement);
            cardBody.appendChild(pElement2);
            const imgUrl = `http://openweathermap.org/img/wn/${weather[0].icon
                }@2x.png`;
            console.log(imgUrl);
            const imgElement = document.createElement('img');
            imgElement.setAttribute('src', imgUrl);
            cardBody.appendChild(imgElement);
        }
        else { alert("No City Found.Could not get info from the server"); }
    });
});
