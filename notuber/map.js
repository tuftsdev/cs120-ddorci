let map;
let userCoords;

const iconBase =
  "";
const icons = {
  car: {
    icon: iconBase + "car.png",
  },
};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {

  userCoords = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

  map.setCenter(userCoords);

  let yourMarker = new google.maps.Marker({
    position: userCoords,
    label: {text:"You", className: "marker"},
    map: map});

  var http = new XMLHttpRequest();
  var url = 'https://jordan-marsh.herokuapp.com/rides';
  var params = 'username=xXoDw780&lat=' + userCoords.lat() + '&lng=' + userCoords.lng();
  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {

          let minDist = Infinity;
          let closestCar;
          let closestCarName;
          let jsonData = JSON.parse(http.responseText);

            // Create markers.
            for (let i = 0; i < jsonData.length; i++) {

              let latLng = new google.maps.LatLng(jsonData[i].lat, jsonData[i].lng);

              let dist = google.maps.geometry.spherical.computeDistanceBetween(userCoords, latLng)*0.000621371;

              if(minDist >= dist){
                minDist = dist;
                closestCar = latLng;
                closestCarName = jsonData[i].username;
              }

              let marker = new google.maps.Marker({
                position: latLng,
                icon: icons.car.icon,
                label: {text:jsonData[i].username, className: "marker"},
                map: map,
              });

              let contentString =
                '<div id="content">' +
                '<h1 id="firstHeading" class="firstHeading"> Car: ' + jsonData[i].username + '\'s Distance</h1>' +
                '<div id="bodyContent">' +
                "<p>The car: " + jsonData[i].username + " is approximately " + dist.toFixed(2) + " miles from your location.</p>" +
                "</div>" +
                "</div>";
              let infowindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: jsonData[i].username + " Location",
                pixelOffset: google.maps.Size(0, 0)
              });

              marker.addListener("click", () => {
                infowindow.open({
                  anchor: marker,
                  map,
                });
              });

            }

          const closestPath = new google.maps.Polyline({
            path: [userCoords, closestCar],
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          closestPath.setMap(map);

          let contentString =
            '<div id="content">' +
            '<h1 id="firstHeading" class="firstHeading">Your Location</h1>' +
            '<div id="bodyContent">' +
            "<p>The car: " + closestCarName + " is the closest vehicle to your location. It is approximately " + minDist.toFixed(2) + " miles away.</p>" +
            "</div>" +
            "</div>";
          let infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: "Your Location",
            pixelOffset: google.maps.Size(0, 0)
          });

          yourMarker.addListener("click", () => {
            infowindow.open({
              anchor: yourMarker,
              map,
            });
          });
      }
  }
  http.send(params);

}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.352271, lng: -71.05524200000001 },
    zoom: 14,
  });

/*  const features = [
    {
      position: new google.maps.LatLng(42.3453, -71.0464),
      type: "car",
      label: "mXfkjrFw"
    },
    {
      position: new google.maps.LatLng(42.3662, -71.0621),
      type: "car",
      label: "nZXB8ZHz"
    },
    {
      position: new google.maps.LatLng(42.3603, -71.0547),
      type: "car",
      label: "Tkwu74WC"
    },
    {
      position: new google.maps.LatLng(42.3472, -71.0802),
      type: "car",
      label: "5KWpnAJN"
    },
    {
      position: new google.maps.LatLng(42.3663, -71.0544),
      type: "car",
      label: "uf5ZrXYw"
    },
    {
      position: new google.maps.LatLng(42.3542, -71.0704),
      type: "car",
      label: "VMerzMH8"
    },
  ];

  // Create markers.
  for (let i = 0; i < features.length; i++) {
    const marker = new google.maps.Marker({
      position: features[i].position,
      icon: icons[features[i].type].icon,
      label: {text:features[i].label, className: "marker"},
      anchorPoint: new google.maps.Point(515, 12),
      map: map,
    });
  }*/

}

window.initMap = initMap;
navigator.geolocation.getCurrentPosition(success, error, options);
