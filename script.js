const api={
    key: 'aae6c1208cf04f6492d01510210402',
    base_url: 'http://api.weatherapi.com/v1/'
}
const search_box=document.querySelector(".search-box");
const form = document.getElementById("form");
const notificationEl = document.querySelector(".notification");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    getWeatherResults(search_box.value);
    search_box.value="";
})
window.addEventListener("load",()=>{
    loadLocation();
    showDate();
});
function loadLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }else{
        notificationEl.innerHTML="<p>Unable to load weather at your location. Geolocation is not supported by this browser.</p>";
    }
    
}

function showError(error){
    notificationEl.innerHTML=`<p>${error.message}</p>`;
}
function showPosition(position){    
    let latitude = position.coords.latitude;
    let longitude=position.coords.longitude;
    loadCurrentPossionWeather(latitude, longitude);
    
}
function loadCurrentPossionWeather(latitude, longitude){    
    let api_url=api.base_url+`forecast.json?q=${latitude},${longitude}&days=3&key=${api.key}`;
    console.log(api_url);
    fetch(api_url)
    .then(function(weather){
        return weather.json();
    }).then(displayResults);
}


function getWeatherResults(search_input){
    let api_url=api.base_url+`forecast.json?q=${search_input}&days=3&key=${api.key}`;
    console.log(api_url);
    notificationEl.style.display='none';
    fetch(api_url)
    .then(function(weather){
        return weather.json();
    })
    .then(displayResults)
}
function displayResults(weather){
    
    showDate();

    let city = document.querySelector('.location .city');
    city.innerText = `${weather.location.name}, ${weather.location.country}`;

    let temp=document.querySelector(".temp");
    temp.innerHTML=`${Math.round(weather.current.temp_c)}<span>°c</span>`;

    let iconId=document.querySelector(".iconId");
    iconId.innerHTML=`<img src="${weather.current.condition.icon}" />`;

    let weather_description=document.querySelector('.weather-description p');
    weather_description.innerText=weather.current.condition.text;   

    let hi_low=document.querySelector(".hi-low");
    hi_low.innerText=`${Math.floor(weather.forecast.forecastday[0].day.mintemp_c)}°c / ${Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°c`;
    

    let sub=document.querySelector('sub');
    let eachDayForcastEl='';
    let daysForcast=weather.forecast.forecastday;
    
    
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day='';
    let d='';
    
 
    var i=0;   
    for(i; i< daysForcast.length; i++)
    {       d=new Date(daysForcast[i].date);
            day = days[d.getDay()];
            eachDayForcastEl+=`<div class="forecast">
                    <div class="date">${day}</div>
                    <div class="forcast_iconId"><img src="${daysForcast[i].day.condition.icon}"/></div>
                    <div class="forcast_weather-description"><p>${daysForcast[i].day.condition.text}</p></div>
                    <div class="forcast_hi-low">${Math.floor(daysForcast[i].day.mintemp_c)}°c / ${Math.round(daysForcast[i].day.maxtemp_c)}°c</div>
            </div>`;
    }
    sub.innerHTML=eachDayForcastEl;
}
function buildDate(d){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let day=days[d.getDay()];
    let date=d.getDate();
    let month=months[d.getMonth()];
    let year=d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
}
function showDate(){
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = buildDate(now);
}
