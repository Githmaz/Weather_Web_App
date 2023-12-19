let weatherApiKey = "549abeb81dba48bb91f54349231310"


window.onload = function () {
    // default data
    if (window.innerWidth < 769) {
      setAllDataByLocationMobile("colombo");
    } else {
      setAllDataByLocation("colombo");
    }
  

  let  getLocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  let  showPosition = function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
     
      setAllDataByCoordinate(latitude,longitude);
      
  };

  // Call the getLocation function to initiate the geolocation process
  getLocation();

};

//_____________________ Dark Mode ____________________//

document.getElementById("darkMode-button").addEventListener("change",() => {
    document.body.classList.toggle("light-theme");
})


//_____________________ Search button  ____________________//

document.getElementById("btn-search").addEventListener("click", () => {
  setAllDataByLocation(document.getElementById("search-input").value);
});

//_____________________ Set AlL Data by Location   ____________________//

let setAllDataByLocation = async (location) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setAllData(data);
  } catch (error) {
    console.log(error);
  }
}

//_____________________ Set AlL Data by Coordinate   ____________________//

let setAllDataByCoordinate= async (latitude,longitude) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setAllData(data);
    if (window.innerWidth < 769) {
      setAllDataMobile(data);
    } else {
      setAllData(data);
    }
  } catch (error) {
    console.log(error);
  }
}

//_____________________ inject All data to WebPage   ____________________//
  let setAllData = (data) => {
    document.getElementById("weather-card-background-image").src = getBackgroundPic(data.current.condition.text.toLowerCase());
    document.getElementById("location").innerHTML = data.location.name; 
    document.getElementById("weatherStatus").innerHTML = data.current.condition.text; 
    document.getElementById("tempValue").innerHTML = `${Math.floor(data.current.temp_c)}<span style="font-size: 2rem;">°C</span>`;
    document.getElementById("wind-speed").innerHTML = `${Math.floor(data.current.wind_kph)} kmh`;
    document.getElementById("wind-direction").innerHTML = `${Math.floor(data.current.wind_kph)}° `;
    document.getElementById("humidity").innerHTML = `${Math.floor(data.current.humidity)} %`
    document.getElementById("visibility").innerHTML = `${Math.floor(data.current.vis_km)} km`
    document.getElementById("pressure").innerHTML = `${Math.floor(data.current.pressure_mb)} hpa`
    document.getElementById("uv").innerHTML = `${data.current.uv}`;
    document.getElementById("sunrise").innerHTML = `${to24HourFormat(data.forecast.forecastday[0].astro.sunrise)}`;
    document.getElementById("sunset").innerHTML = `${to24HourFormat(data.forecast.forecastday[0].astro.sunset)}`;

    document.getElementById("fh-card-container").innerHTML = fhCardGenerator(data.forecast.forecastday, 3);
    injectToChart(data.forecast.forecastday[0].hour, 8);

  }
//_____________________ get date  ____________________// 
let getdate = (date,days) =>{ // limit cant be  over 28days
  let tempDate = date.split('-');
  tempDate.forEach((element, index, array) => {
    array[index] = parseInt(element);
  });
  let days_in_month = [31, (tempDate[0]%4==0 && (tempDate[0]%100 != 0 || tempDate[0]%400 == 0 ) )? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  tempDate[2] += days;

  if(tempDate[2]<=0){
    tempDate[1] -= 1;
    if(tempDate[1]<=0){
      tempDate[0] -= 1;
      tempDate[1] = 12
    }
      tempDate[2] += days_in_month[tempDate[1]-1];
    
  } 
  if(tempDate[2]>days_in_month[tempDate[1]-1]){
    tempDate[1] += 1;
    if(tempDate[1]>12){
      tempDate[0] += 1;
      tempDate[1] = 1;
    }
    tempDate[2] = tempDate[2]-days_in_month[tempDate[1]-2];
  } 
  return(tempDate[0]+"-"+tempDate[1]+"-"+tempDate[2]);
}




//_____________________ to 24 Hour Format  ____________________//
let to24HourFormat = (time) =>{
  const timeArray = time.split(/[ :]/);
  return (timeArray[timeArray.length - 1] == "AM" )? (timeArray[0]+":"+timeArray[1]): ((parseInt(timeArray[0])+12)+":"+timeArray[1]) ;
}



//_____________________ F H Card Generator  ____________________//
let fhCardGenerator = (days,howmany) =>{
  let fhcards = '';
  while(howmany-->0){
    shortFromDate(days[howmany].date)
    fhcards=`<div class="f-h-card">
    <img src="${getBackgroundPic(days[howmany].day.condition.text)}" alt="">
    <h2>${Math.floor(days[howmany].day.avgtemp_c)}<span style="font-size: 2rem;">°C</span></h2>
    <h6>${shortFromStatus(days[howmany].day.condition.text)}</h6>
    <p >${shortFromDate(days[howmany].date)}</p>
</div>`+fhcards;
  }

  return fhcards
}
//_____________________ short from for weather text  ____________________//
let shortFromStatus = (status)=>{
  if(status.includes('rain')||status.includes('rainy')){
    return"Rainy";
  }else if(status.includes('cloudy')){
    return "Cloudy";
  }else if(status.includes('mist')){
    return"Mist";
  }else{
    return status;
  }
}
//_____________________ short from for Date   ____________________//

let shortFromDate = (date)=>{
  let dateArray= date.split('-');
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return (parseInt(dateArray[2])+" - "+months[dateArray[1]-1]);
   
}

//_____________________ Set Background pic  ____________________//

let getBackgroundPic = (status) =>{
  if(status.includes('rain')||status.includes('rainy')){
    return"assets/Weather card Background image/Rainy.jpg";
  }else if(status.includes('cloudy')||status.includes('overcast')){
    return "assets/Weather card Background image/Cloudy.jpg";
  }else if(status.includes('mist')){
    return"assets/Weather card Background image/mist.jpg";
  }else{
    return "assets/Weather card Background image/Sunny.jpg";
  }
}

//_____________________  inject data to the chart  ____________________//

let injectToChart = (TempByHours,HowmanyXvalues) => { // xvalues need to be 1/2/3/4/8/12
  let xValues = [];
  let yValues = [];
  let period = 24/HowmanyXvalues;
  for(let i = 0 ; i < HowmanyXvalues ; i++){
    xValues.push(TempByHours[period*i].time.split(' ')[1]);
    yValues.push(TempByHours[period*i].temp_c);
  }

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
}


// for chart
const xValues = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', ]; 
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

//_____________________ Dark Mode ____________________//
document.getElementById("mb-darkMode-button").addEventListener("change",() => {
  document.body.classList.toggle("mb-light-mode");

  if(document.body.classList.contains("mb-light-mode")){
    document.getElementById("mb-background-img").src = 'assets/Mobile-app/Background/after_noon.png';
  }else{
    document.getElementById("mb-background-img").src = 'assets/Mobile-app/Background/night.png';
  }

})

//_________________ Seach button _____________________//
document.getElementById("mb-searchBtn").addEventListener("click",() => {
  setAllDataByLocationMobile(document.getElementById("mb-searchInput").value);

})
//_____________________ Set AlL Data by Location   ____________________//

let setAllDataByLocationMobile = async (location) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setAllDataMobile(data);
  } catch (error) {
    console.error(error);
  }
}

//_____________________ inject All data to WebPage   ____________________//

let setAllDataMobile = (data) => {
  document.getElementById("mb-location").innerHTML = data.location.name; 
  document.getElementById("mb-weatherStatus").innerHTML = data.current.condition.text; 
  document.getElementById("mb-tempValue").innerHTML = `${Math.floor(data.current.temp_c)}<span style="font-size: 2rem;">°C</span>`;
  
  document.getElementById("mb-weather-status-img").src = getBackgroundPicMobile(data.current.condition.text.toLowerCase());
  document.getElementById("mb-wind-speed").innerHTML = `${Math.floor(data.current.wind_kph)} kmh`;
  document.getElementById("mb-humidity").innerHTML = `${Math.floor(data.current.humidity)} %`
  document.getElementById("mb-uv").innerHTML = `${data.current.uv}`;
  document.getElementById("mb-sunrise").innerHTML = `${to24HourFormat(data.forecast.forecastday[0].astro.sunrise)}`;
  document.getElementById("mb-sunset").innerHTML = `${to24HourFormat(data.forecast.forecastday[0].astro.sunset)}`;
}

//_____________________ Set Background pic  ____________________//
let getBackgroundPicMobile= (status) =>{
  if(status.includes('rain')||status.includes('rainy')){
    return"assets/logo/rainy-day.png";
  }else if(status.includes('cloudy')||status.includes('overcast')){
    return "assets/logo/clouds.png";
  }else if(status.includes('mist')){
    return"assets/logo/foggy.png";
  }else if(status.includes('clear')){
    return "assets/logo/moon-and-stars.png";
  }else{
    return"assets/logo/sun.png";
  }
}






