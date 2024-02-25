mapboxgl.accessToken = mapToken; 
let coordinateArr = coordinates.split(",");

let floatCoordinatesArr = coordinateArr.map((e)=> parseFloat(e));
console.log(floatCoordinatesArr);

const map = new mapboxgl.Map({
   container: 'map', // container ID
   center: floatCoordinatesArr, // starting position [lng, lat]
   zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color : "#FF385C"})
    //listing.geometry.coordinates- converting into arr bcz it is passed in string form  from listing.ejs
    .setLngLat(floatCoordinatesArr)
    .setPopup(new mapboxgl.Popup({ offset : 25 }).setHTML(`<b>exact location provided after booking</b>`))
    .addTo(map);

