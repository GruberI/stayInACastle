function startMap() {
  const sophiesinput = document.getElementById('sophiesinput')
  const issasinput = document.getElementById('issasinput')
  console.log(parseInt(sophiesinput.value))
  const castle = {
  	lat: parseInt(sophiesinput.value),
    lng: parseInt(issasinput.value)};

  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 8,
      center: castle
    }
  );
  const castleMarker = new google.maps.Marker({
    position: {
      lat: castle.lat,
      lng: castle.lng
    },
    map: map,
    title: "Castle Location"
  });
 
 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
 
      // Center map with user location
      map.setCenter(user_location);
 
      // Add a marker for your user location
      const castleMarker = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng
        },
        map: map,
        title: "You are here."
      });
 
    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

}

