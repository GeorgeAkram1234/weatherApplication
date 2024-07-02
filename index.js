
let searchInput = document.querySelector('#searchInput')
let city = document.querySelector('#city')
let weather = document.querySelector('#weather')
let icon = document.querySelector('#icon')
let condition = document.querySelector('#condition')
let humidity = document.querySelector('#humidity')
let wind_speed = document.querySelector('#wind-speed')
let direction = document.querySelector('#direction')
let sec_day_icon = document.querySelector('#sec-day-icon')
let sec_day_weather = document.querySelector('#sec-day-weather')
let sec_day_note = document.querySelector('#sec-day-note')
let sec_day_condition = document.querySelector('#sec-day-condition')
let third_day_icon = document.querySelector('#third-day-icon')
let third_day_weather = document.querySelector('#third-day-weather')
let third_day_note = document.querySelector('#third-day-note')
let third_day_condition = document.querySelector('#third-day-condition')



let today = new Date();

let monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

let dayIndex = today.getDay();
let dayName = dayNames[dayIndex];

let monthIndex = today.getMonth();
let monthName = monthNames[monthIndex];


document.getElementById('dayName').innerHTML = `${dayName}`
document.getElementById('date').innerHTML = `${dayIndex}${monthName}`

document.getElementById('sec-day').innerHTML = `${dayNames[dayIndex + 1]}`
document.getElementById('third-day').innerHTML = `${dayNames[dayIndex + 2]}`



async function getAllWeather(location) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ee89923a6cf34770ac2212619242506&q=${location}&days=3`);
    let data = await response.json();
    // console.log(data)
    return data

}

async function displayToday(data){
    city.innerHTML = data.location.name
    weather.innerHTML = `${data.current.temp_c}°C`
    // icon.setAttribute("src" , data.current.condition.icon)
    condition.innerHTML = data.current.condition.text
    humidity.innerHTML = data.current.humidity + '%'
    wind_speed.innerHTML = data.current.wind_kph + 'km/h'
    direction.innerHTML = data.current.wind_dir

}

async function displayNextDay(data){
    sec_day_weather.innerHTML = data.forecast.forecastday[1].day.maxtemp_c + '°C'
    sec_day_condition.innerHTML = data.forecast.forecastday[1].day.condition.text
    sec_day_note.innerHTML = data.forecast.forecastday[1].day.avgtemp_c + '°C'
    // sec_day_icon.setAttribute("src" , data.forecast.forecastday[1].day.condition.icon)
    third_day_weather.innerHTML = data.forecast.forecastday[2].day.maxtemp_c + '°C'
    third_day_condition.innerHTML = data.forecast.forecastday[2].day.condition.text
    third_day_note.innerHTML = data.forecast.forecastday[2].day.avgtemp_c + '°C'
    // third_day_icon.setAttribute("src" , data.forecast.forecastday[2].day.condition.icon)

}

async function allDisplays(city = 'cairo'){
    let weatherdata = await getAllWeather(city)
    if(!weatherdata.error){
        displayToday(weatherdata)
        displayNextDay(weatherdata)
    }

}

allDisplays()


searchInput.addEventListener('input', (e) => {
    allDisplays(searchInput.value)
})
