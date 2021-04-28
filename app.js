const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var query = '';
var temp = 0;
var weatherDescription = '';
var imageURL = '';

app.get("/", function(req, res){
  res.render('weather', {description: weatherDescription, name: query, temperature: temp, image: imageURL});
});

app.post("/", function(req, res){

  query = req.body.cityName;
  const apiKey = "9c99cf483bc25d4f28010bfee48ffca5";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);

      temp = weatherData.main.temp;
      weatherDescription = weatherData.weather[0].description;
      icon = weatherData.weather[0].icon;
      imageURL = "http://openweathermap.org/img/wn/" + icon + ".png";

      res.redirect("/");
    });
  }); 
});

app.listen(3003, function(){
  console.log("Server is running on port 3003");
});