let temperature = prompt("Enter temperature ");
let c = (temperature - 32) * 5 / 9;
let fahrenheit = (temperature * 9/5) + 32;
console.log(c + "°C , " + fahrenheit + "°F");
document.getElementById("result").textContent = temperature +"is: \n"+ c + "°C  \nor " + fahrenheit + "°F";