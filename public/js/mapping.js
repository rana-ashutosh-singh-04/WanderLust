  window.initMap = function() {
    const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.6139, lng: 77.2090 }, // New Delhi
    zoom: 10,
   });
   new google.maps.Marker({
    position: { lat: 12.9716, lng: 77.5946 },
    map,
    title: "Here!",
  });

   }

   