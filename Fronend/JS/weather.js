let weatherApiKey = "ab6c8347959b40618ed32803232709"
let searchInput = document.getElementById("search-input")




//_____________________ Dark Mode ____________________//

document.getElementById("darkMode-button").addEventListener("change",() => {
    document.body.classList.toggle("dark-theme");
})


//_____________________ Search button  ____________________//

document.getElementById("btn-search").addEventListener("click", () => {
  console.log("clicked")
     // current weather api
    fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${searchInput.value}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("tempValue").innerHTML =`${Math.floor(data.current.temp_c)}<span style="font-size: 2rem;">°C</span>`;
        document.getElementById("weatherStatus").innerHTML = data.current.condition.text; 
        document.getElementById("location").innerHTML = data.location.name; 
        document.getElementById("wind-speed").innerHTML = `${Math.floor(data.current.wind_kph)} kmh`;
        document.getElementById("wind-direction").innerHTML = `${Math.floor(data.current.wind_kph)}° `
        document.getElementById("humidity").innerHTML = `${Math.floor(data.current.humidity)} %`
        document.getElementById("visibility").innerHTML =`${Math.floor(data.current.vis_km)} km`
        document.getElementById("pressure").innerHTML = `${Math.floor(data.current.pressure_mb)} hpa`
        document.getElementById("uv").innerHTML=`${data.current.uv}`
        document.getElementById("feelslike").innerHTML =`${data.current.feelslike_c} °C`
        document.getElementById("gust").innerHTML = `${data.current.gust_kph} kmh`
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

     // post weather api
    fetch(`https://api.weatherapi.com/v1/history.json?q=${searchInput.value}&dt=2023%2F09%2F26&key=${weatherApiKey}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        document.getElementById("yesterday-avgTemp").innerHTML = `${Math.floor(data.forecast.forecastday[0].day.avgtemp_c)}°C`
        document.getElementById("yesterday-status").innerHTML = `${data.forecast.forecastday[0].day.condition.text}`
    })
})



// const menu = document.getElementById("menu");
// menu.addEventListener("click", () => {
//     menu.classList.toggle("active");
// });




// for chart
const xValues = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']; 
const yValues = [15.23, 16.12, 15.85, 16.05, 15.78, 16.32, 16.45, 15.92, 15.65, 15.77, 15.98];


new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{ticks: {min: -10, max:35}}],
    }
  }
});


//===================== Mobile View =======================//

document.getElementById("darkMode-button").addEventListener("change",() => {
  document.body.classList.toggle("mb-dark-theme");
})
