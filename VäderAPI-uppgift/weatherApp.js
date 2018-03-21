//GEOLOCATION
//Hitta nuvarande position
window.onload = function getLocation(){
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
     }
 }
 function showPosition(position) {
     var latitude = position.coords.latitude;
     var longitude = position.coords.longitude;
     var lon = longitude.toFixed(5);
     var lat = latitude.toFixed(5);

     //async fetch function
       async function fetchData(url){
         let promise = await fetch(url);
         let data = await promise.json();
         return data;
       }
//Hämta stad/plats(text är positionen)
	getCity();
       async function getCity(){
         let googleResponse = await fetchData('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyBHBg65O-28WX-kG58P7fRQ4n-GoJEE2FY');
         let text = googleResponse.results[6].formatted_address;
				 console.log(text);
				 let textTag = document.createElement("h2");
				 let textNode = document.createTextNode(text);
				 textTag.appendChild(textNode);
				 document.body.appendChild(textTag);
				 getData();
       }
		 }


//Funktion för att hämta data från väderAPI
async function getData(){

	let response = await fetchData("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.063240/lat/59.334591/data.json")
	let date;
	let now;

	//filtrera ut
	let validDates = response.timeSeries.filter(date =>{
		const dateObj = new Date(date.validTime);
		return dateObj.getHours() === 13;
	});
	//console.log(validDates);

	//SHIFT!
	//var today = validDates.shift();
	//console.log(today)

	var section = document.createElement("div");
	section.className = "sectionDiv";

	var article = document.createElement("div");
	article.className = "articleDiv";

//skapa dagens datum
let nu = new Date();
let rightNow = nu.toLocaleString();

var timeNowP = document.createElement("p");
var timeNowText = document.createTextNode(rightNow);
timeNowP.appendChild(timeNowText);
article.appendChild(timeNowP);
document.body.appendChild(article);

for (var tempNow of response.timeSeries)
  {
    for (var ja of tempNow.parameters)
    {
      if(ja.name == "t")
      {
        var temperatureP = document.createElement("p");
        var temperatureText = document.createTextNode("Temp just nu: "+Math.round(ja.values)+ "°c");
        temperatureP.appendChild(temperatureText);
				article.appendChild(temperatureP);
				document.body.appendChild(article);
      }
			//Ta fram vädersymbolernas siffror = wsymb2, sedan får man koppla bild till de
      if (ja.name == "Wsymb2")
      {
        let symbolTextTag = document.createElement("p");
//        let symbolTextNode = document.createTextNode(test.values);
        let icon = document.createElement("div");
        icon.className = 'weather-icon ' + weatherClasses[ja.values];
        symbolTextTag.appendChild(icon);
				article.appendChild(symbolTextTag);
				document.body.appendChild(article);
      }
    }
    break;
  }

	//loop för att gå igenom arrayen validDates
	for (var parameter of validDates){

		var container = document.createElement("div");
		container.className = "containerDiv";

		//ta bort del av datum
		date = parameter.validTime.slice(0, 10);
		now = parameter.validTime.slice(11, 16);
		//ta fram datum varje dag kl 12 ur validDates
		let textTag = document.createElement("p");
		let textNod = document.createTextNode(date + " " + now);
		textTag.appendChild(textNod);
		container.appendChild(textTag);
		section.appendChild(container);
		document.body.appendChild(section);


		//ta fram textnod för "timeSeries"
		let textNode = document.createTextNode(parameter);

		//ta fram "parametrar" (och undernoder) ur "timeSeries"
		for (var time of parameter.parameters){

			//Ta fram temperaturen
			if (time.name == "t"){
				var newTextTag = document.createElement("p");
				var newTextNode = document.createTextNode("Temperaturen är "+ Math.round(time.values)+ "°c");
				newTextTag.appendChild(newTextNode);
				container.appendChild(newTextTag);
				section.appendChild(container);
				//document.body.appendChild(newTextTag);
			}
			//Ta fram Vädersymbolerna
			if (time.name == "Wsymb2"){
				let anotherTextTag = document.createElement("p");
				let icon = document.createElement("div");
				icon.className = 'weather-icon ' + weatherClasses[time.values];
				anotherTextTag.appendChild(icon);
				container.appendChild(anotherTextTag);
				section.appendChild(container);
				//document.body.appendChild(anotherTextTag);
			}
			document.body.appendChild(section);
			/*let divTag = document.createElement("div");
			let divNode = document.createTextNode();
			divTag.className = 'imADiv';
			divTag.appendChild(newTextNode);
			document.body.appendChild(divTag);*/

		}
	}
}

async function fetchData(url){

	let promise = await fetch(url);
	let data = await promise.json();
	return data;
}
//What is this tho..
const weatherClasses = {
	1: "sun",
	2: "sun",
	3: "sunCloud",
	4: "sunCloud",
	5: "cloud",
	6: "cloud",
	7: "cloud",
	8: "sunRain",
	9: "cloudRain",
	10: "cloudRain",
	11: "flashes",
	12: "sleet",
	13: "sleet",
	14: "sleet",
	15: "cloudSnow",
	16: "cloudSnow",
	17: "cloudSnow",
	18: "sunRain",
	19: "sunRain",
	20: "cloudRain",
	21: "flashes",
	22: "sleet",
	23: "sleet",
	24: "sleet",
	25: "cloudSnow",
	26: "cloudSnow",
	27: "cloudSnow"
}
