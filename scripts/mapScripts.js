var coords = [41.035971, -74.214078]
const map = L.map('map').setView(coords, 18.4);

const tiles = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

let circle1 = L.circle(coords, {
    color: 'lime',
    fillColor: 'lime',
    fillOpacity: 0.5,
    radius: 8
}).addTo(map);

circle1.bindPopup("<b>Pick-up Point</b>", {closeOnClick: false, autoClose: false}).openPopup();

function cycleColors(color) {
    setTimeout(function () {
            console.log(color);
            circle1.setStyle({color: color});
            circle1.setStyle({fillColor: color});
    }, 2000);
}

// let i = 0; 
// function changeColors() {
//     let colors = ["lime", "yellow", "red"]
//     let varNames = [circle1, circle2];

//     setTimeout(function() {
//         let j = i;
//         if (j >= 3){
//          j = j % 3;
//     }
//     console.log(j);
//     let color = colors[j];

//     let k = i;
//     if (k >= 2) {
//         k = k % 2;
//     }

//     varNames[k].setStyle({color: color});
//     varNames[k].setStyle({fillColor: color});
//     i++;
//     if (i < 10) {
//     changeColors();
//     }
//     }, 1000)
// }