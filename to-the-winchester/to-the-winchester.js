      let end = {
        lat: 51.4783714,
        lng: -0.04747361111111111
      };
      let start = {
        lat: 0,
        lng: 0
      };
      getLocation();
      let transport = 'DRIVING';
      let detailsVisible = false;
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            start.lat = position.coords.latitude;
            start.lng = position.coords.longitude;
            console.log(start);
            document.getElementById('get-directions').disabled = false;
            let message = document.getElementById('geo-message');
            message.innerHTML = 'How\'s that for a slice of fried gold?';
            message.className = 'message';
          });
        } else {
          window.alert('Your geolocation can\'t be found... Please check that your browser has access to it, and that you aren\'t already a zombie');
        }
      }

      function initMap() {
        getLocation();
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: end
        });
        let content = '<p><b>The Winchester</b><br/>39 Monson Rd,<br/>London SE14 5EQ</p><img src="https://www.maria-kang.com/photos/winchester.jpg" alt="The Winchester" height="85" >';
        let infowindow = new google.maps.InfoWindow({
          content: content
        });
        let marker = new google.maps.Marker({
          position: end,
          map: map,
          title: 'The Winchester'
        });
        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        }); 
        document.getElementById('map').style.height = '76%';
        hideElement('intro');
        document.getElementById('intro').style.lineHeight = '0px';
        hideElement('view-on-map');
        hideElement('show-hide-details');
        document.getElementById('show-hide-details').innerHTML = 'Show details';
        hideElement('right-panel');
        detailsVisible = false;
        hideElement('exit-directions');
        hideElement('mode');
        showElement('get-directions');
        showElement('geo-message');
        document.getElementById('geo-message').style.lineHeight = '30px';
        document.getElementById('container').style.background = 'URL(https://www.maria-kang.com/photos/shaun_of_the_dead_zombies.jpg)';

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));
        
        let onChangeHandler = function() {
          hideElement('get-directions');
          hideElement('geo-message');
          document.getElementById('geo-message').style.lineHeight = '0px';
          document.getElementById('map').style.height = '85%';
          showElement('mode');
          transport = document.getElementById('mode').value;
          showElement('show-hide-details');
          showElement('exit-directions');
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        
        document.getElementById('get-directions').addEventListener('click', onChangeHandler);
        document.getElementById('mode').addEventListener('change', onChangeHandler);
        
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
          directionsService.route({
            origin: start,
            destination: end,
            travelMode: transport
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
              directionsDisplay.getPanel();
            //  directionsDisplay.setOptions({suppressInfoWindows: true});
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
      }
 
      function hideElement(idStr) {
        document.getElementById(idStr).style.visibility = 'hidden';
      }
      function showElement(idStr) {
        document.getElementById(idStr).style.visibility = 'visible';
      }
      function toggleDetails() {
        if(detailsVisible) {
          hideElement('right-panel');
          document.getElementById('show-hide-details').innerHTML = 'Show details';
        } else {
          showElement('right-panel');
          document.getElementById('show-hide-details').innerHTML = 'Hide details';
        }
        detailsVisible = !detailsVisible;
      }
