
serverApi = "https://www.7timer.info/bin/civillight.php";//"?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0";
loggingOn = true;

if (loggingOn) console.log("Logging is ON");

function outputCardHtml(html,Loading=false){
    load = Loading?`<div class="spinner"></div>`:'';
    $('#forecastOutput').html(`<div class="text-center"><div class="col-md-12">${load}<h4 class>${html}</h4></div></div>`);
}

function getWeatherData(lon,lat){
    outputCardHtml('Loading...',true);
    $.ajax({
        url : serverApi,
        type : 'GET',
        data : {
            output : "json",
            lon : lon,
            lat : lat,
            ac : 0,
            unit : "metric"
        },
        success : function(data) {
            data = JSON.parse(data)["dataseries"];
            if (loggingOn) console.log(data);
            populateData(data);
        },
        error: function(){
            outputCardHtml('Failed.');
        }
    })
}

function getDateString(dateString, dayonly = false, dateonly = false) {
    dateString = String(dateString);
    const date = new Date(`
        ${dateString.substring(0, 4)}-
        ${dateString.substring(4, 6)}-
        ${dateString.substring(6, 8)}`);
    if(dayonly) return date.toLocaleDateString('en-US', { weekday: 'long'});
    if(dateonly) return  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}


// jQuery function to handle form submission
$('#locationForm').on('submit', function(event) {
    event.preventDefault();
    const selectedOption = $('#locationSelect option:selected');
    const lat = selectedOption.data('lat');
    const lon = selectedOption.data('lon');
    // console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    getWeatherData(lon,lat);
});

populateData = function(data){
    $('#forecastOutput').html('');
    
    data.forEach(element => {
        date = element["date"];
        tempMax = element["temp2m"]["max"];
        tempMin = element["temp2m"]["min"];
        weather = element["weather"];

        day = getDateString(date,true);
        date = getDateString(date,false,true)
       htmlTemplete =  
      `<div class="col-md-4 col-sm-6 col-lg-3">
        <div class="forecast-card text-center">
          <h5>${day}</h5>
          <h6 class="text-grey">${date}</h6>
          <img src="images/${weather}.png" alt="Weather icon" class="img-fluid">
          <p class="text-grey">${weather}</p>
          <p class="pb-0 mb-0">Min : ${tempMin}°C</p>
          <p>Max : ${tempMax}°C</p>
        </div>
      </div>`
      $('#forecastOutput').append(htmlTemplete);

    });
}