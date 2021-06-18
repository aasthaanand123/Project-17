//get all elements
let ip_add = document.querySelector(".ip");
let locator = document.querySelector(".location");
let timezone = document.querySelector(".timezone");
let isp = document.querySelector(".isp");
let button = document.querySelector("button");
let input = document.querySelector("input");

//ip and domain regex
const ValidIpAddressRegex = new RegExp(
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
);
const ValidHostnameRegex = new RegExp(
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/
);
//initialize map
let map = L.map("mapid", {
  center: [51.505, -0.09],
  zoom: 15,
});
//initialize marker
let myIcon = L.icon({
  iconUrl: "/images/icon-location.svg",
  iconSize: [30, 34],
});
let theMarker = L.marker([51.505, -0.09], {
  icon: myIcon,
}).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
//on getting position, set the values as required
navigator.geolocation.getCurrentPosition((position) => {
  map.panTo([position.coords.latitude, position.coords.longitude]);
  theMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
});
let info_json = null;
let i = 1;
//current ip address details
async function request(address) {
  try {
    if (
      (ValidIpAddressRegex.test(address) && Number(address[0])) ||
      (ValidHostnameRegex.test(address) &&
        !Number(address[0]) &&
        address.includes(".")) ||
      address == ""
    ) {
      let info_one = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_AIUkTP7XNxfNxJ4Bhk6kdAsGBmWQL${
          address && Number(address[0]) ? "&ipAddress=" + address : ""
        } ${address && !Number(address[0]) ? "&domain=" + address : ""}`
      );
      info_json = await info_one.json();
      ip_add.innerText = info_json.ip;
      locator.innerText = `${info_json.location.city}, ${info_json.location.country} ${info_json.location.postalCode}`;
      timezone.innerText = `UTC ${info_json.location.timezone}`;
      isp.innerText = info_json.isp;
      //update map position
      if (i > 1) {
        map.panTo([info_json.location.lat, info_json.location.lng]);
        theMarker.setLatLng([info_json.location.lat, info_json.location.lng]);
      }
      //update marker position
    } else {
      alert("Enter correct details!");
    }
  } catch (error) {
    console.log(error);
  }
  i++;
}
//add event listener
button.addEventListener("click", function (e) {
  e.preventDefault();
  let value = input.value;
  if (value) {
    request(value);
    input.value = "";
  } else {
    alert("Enter correct address");
  }
});
let body = document.querySelector("body");
window.addEventListener("DOMContentLoaded", function () {
  request("");
});
