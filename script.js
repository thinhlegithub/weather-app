const api={
    key: 'e031ee04d2084d1d03a78f3fb53e3278',
    base_url: 'https://api.openweathermap.org/data/2.5/'
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
    //let api_url=api.base_url+`weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`;
    //let api_url=`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=7&appid=${api.key}`
    let api_url=`https://api.openweathermap.org/data/2.5/forecast/?lat=${latitude}&lon=${longitude}&cnt=40&units=metric&appid=${api.key}`
    console.log(api_url);
    fetch(api_url)
    .then(function(weather){
        return weather.json();
    }).then(displayResults);
}


function getWeatherResults(search_input){
    let api_url=api.base_url+`forecast/?q=${search_input}&cnt=40&units=metric&appid=${api.key}`;
    console.log(api_url);
    notificationEl.style.display='none';
    fetch(api_url)
    .then(function(forecast){
        return forecast.json();
    })
    .then(displayResults)
}

function displayResults(forecast){
    
    showDate();

    const currentWeather = forecast.list[0];

    let city = document.querySelector('.location .city');
    city.innerText = `${forecast.city.name}, ${forecast.city.country}`;

    let temp=document.querySelector(".temp");
    temp.innerHTML=`${Math.floor(currentWeather.main.temp)}<span>°c</span>`;

    let iconId=document.querySelector(".iconId");
    iconId.innerHTML=`<img src="icons/${currentWeather.weather[0].icon}.png" />`;

    let weather_description=document.querySelector('.weather-description p');
    weather_description.innerText=currentWeather.weather[0].description;   

    let hi_low=document.querySelector(".hi-low");
    hi_low.innerText=`${Math.floor(currentWeather.main.temp_min)}°c / ${Math.floor(currentWeather.main.temp_max)}°c`;


    let sub=document.querySelector('sub');
    let eachDayForcastEl='';
    let dayForcastEls=forecast.list;
    
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day=''
    //let d=new Date();
    let d='';
    var i=7;
    var j=0;
    var utcString='';
    for(i; i< dayForcastEls.length; i+=8)
    {       
        //build days loop the day of weeks
          /*j=d.getDay()+i;
          if(j>=7)
            {
                j=j-8;
                j++;
            }
        */
            d=new Date(forecast.list[i].dt*1000);
            console.log(d);
            day = days[d.getDay()];
            if(i===dayForcastEls.length){
                i=i-3;
                return;
            }
            eachDayForcastEl+=`<div class="forcast">
                    <div class="date">${day}</div>
                    <div class="forcast_iconId"><img src="icons/${forecast.list[i].weather[0].icon}.png" alt=""></div>
                    <div class="forcast_temp">${Math.floor(forecast.list[i].main.temp)}<span>°c</span></div>
                    <div class="forcast_weather-description"><p>${forecast.list[i].weather[0].description}</p></div>
                    <div class="forcast_hi-low">${Math.floor(forecast.list[i-3].main.temp_min)}°c / ${Math.floor(forecast.list[i].main.temp_max)}°c</div>
            </div>`;
    }
    sub.innerHTML=eachDayForcastEl;
}

/*
function getWeatherResults(search_input){
    let api_url=api.base_url+`forecast/?q=${search_input}&cnt=7&units=metric&appid=${api.key}`;
    console.log(api_url);
    notificationEl.style.display='none';
    fetch(api_url)
    .then(function(weather){
        return weather.json();
    })
    .then(displayResults)
}
function getWeatherResults(search_input){
    let api_url =api.base_url+`weather?q=${search_input}&units=metric&appid=${api.key}`;
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
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let temp=document.querySelector(".temp");
    temp.innerHTML=`${Math.floor(weather.main.temp)}<span>°c</span>`;

    let iconId=document.querySelector(".iconId");
    iconId.innerHTML=`<img src="icons/${weather.weather[0].icon}.png" />`;

    let weather_description=document.querySelector('.weather-description p');
    weather_description.innerText=weather.weather[0].description;   

    let hi_low=document.querySelector(".hi-low");
    hi_low.innerText=`${Math.floor(weather.main.temp_min)}°c / ${Math.floor(weather.main.temp_max)}°c`;
}
*/

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
