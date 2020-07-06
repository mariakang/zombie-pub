      // To The Winchester!

      // create objects for start and end points:
      // set coordinates of end point to be those of The Winchester
      let end = {
        lat: 51.4783714,
        lng: -0.04747361111111111
      };
      // initialise start point coordinates at zero
      let start = {
        lat: 0,
        lng: 0
      };
      // attempt to set the cooordinates of the start point to match the user's location
      getLocation();

      // set initial (default) mode of transport to driving
      let transport = 'DRIVING';

      // set initial directions view to hide details
      let detailsVisible = false;

      function getLocation() {
        // check the browser can access the user's geolocation
        if (navigator.geolocation) {
          // if so...
          navigator.geolocation.getCurrentPosition(function(position) {
            // set the coordinates of the start point
            start.lat = position.coords.latitude;
            start.lng = position.coords.longitude;
            // enable the 'get directions' button
            document.getElementById('get-directions').disabled = false;
            // update the default 'geolocation not found' message to the 'geolocation found' message
            let message = document.getElementById('geo-message');
            message.innerHTML = 'How\'s that for a slice of fried gold?';
            message.className = 'message';
          });
          // otherwise, open a window with a message [NOT WORKING]
        } else {
          window.alert('Your geolocation can\'t be found... Please check that your browser has access to it, and that you aren\'t already a zombie');
        }
      }

      // function to create map view
      function initMap() {
        // attempt to get the user's geolocation
        getLocation();

        // define variables required to obtain and display directions
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        // define map variable to be displayed inside div element with id 'map' and centred on The Winchester
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: end
        });

        // define info window to appear when user hovers over Winchester marker (or clicks on it if mobile user)
        let content = '<p><b>The Winchester</b><br/>39 Monson Rd,<br/>London SE14 5EQ</p><img src="https://www.maria-kang.com/photos/winchester.jpg" alt="The Winchester" height="85" >';
        let infowindow = new google.maps.InfoWindow({
          content: content
        });
        // define marker to show location of The Winchester
        let marker = new google.maps.Marker({
          position: end,
          map: map,
          title: 'The Winchester'
        });
        // add event listeners to marker to enable info window display
        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        });

        // change HTML view from intro page to map page

        // set height of 'map' div to make the map visible
        document.getElementById('map').style.height = '76%';
        // hide original intro message
        hideElement('intro');
        document.getElementById('intro').style.lineHeight = '0px';
        // hide 'view on map' button
        hideElement('view-on-map');
        // ensure that direction details and buttons only relevant to directions view are hidden
        hideElement('show-hide-details');
        document.getElementById('show-hide-details').innerHTML = 'Show details';
        hideElement('right-panel');
        detailsVisible = false;
        hideElement('exit-directions');
        hideElement('mode');
        // show the 'get directions' button and non-intro message
        showElement('get-directions');
        showElement('geo-message');
        document.getElementById('geo-message').style.lineHeight = '30px';
        // change the background image
        document.getElementById('container').style.background = 'URL(https://www.maria-kang.com/photos/shaun_of_the_dead_zombies.jpg)';

        // tell the directions renderer where to display the directions and details
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));
        
        // define function to change view from map page to directions page
        let onChangeHandler = function() {
          // hide 'get directions' button and message
          hideElement('get-directions');
          hideElement('geo-message');
          document.getElementById('geo-message').style.lineHeight = '0px';
          // increase height of map slightly, show directions options and set transport mode to selected value
          document.getElementById('map').style.height = '85%';
          showElement('mode');
          transport = document.getElementById('mode').value;
          showElement('show-hide-details');
          showElement('exit-directions');
          // calculate and display directions
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        // add event listeners to bring up the directions view when 'get directions' is clicked or mode is changed
        document.getElementById('get-directions').addEventListener('click', onChangeHandler);
        document.getElementById('mode').addEventListener('change', onChangeHandler);
        
        // define function to display route using the 'start', 'end' and 'transport' global variables
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
          directionsService.route({
            origin: start,
            destination: end,
            travelMode: transport
          }, function(response, status) {
            // if route calculated...
            if (status === 'OK') {
              // set the directions for the directions renderer to be the calculated route
              directionsDisplay.setDirections(response);
              // tell the directions renderer to display the details panel
              directionsDisplay.getPanel();
              // other options may be specified, e.g. markers and info windows, but it's not obvious how to access
              // the start and end markers, so this has been parked
            //  directionsDisplay.setOptions({suppressInfoWindows: true});
            } else {
              // if error, display message window
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
      }
 
      // define utility functions to make it easier to change element visibility
      function hideElement(idStr) {
        document.getElementById(idStr).style.visibility = 'hidden';
      }
      function showElement(idStr) {
        document.getElementById(idStr).style.visibility = 'visible';
      }
      
      // define function to toggle between showing and hiding the directions details panel
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
