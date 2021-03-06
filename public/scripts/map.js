var mapApp = {

	messages: [],
	infoWindow: null,
	markers: [],

	getCordinates: function (m) {
		return {
			lat: m.latitude,
			lng: m.longitude
		};
	},

	showFilterButtons: function() {
		$(":checkbox").change(function() {
			if ($("#filterMessages input:checkbox:checked").length > 0) {
				if ($(".filterButton").hasClass("hidden")) {
					$(".filterButton").toggleClass("hidden");
				}
			} else {
				$(".filterButton").toggleClass("hidden");
			}
		})
	},

	traverseMessages: function () {
		var location, exactlcation, description, latitude, longitude;

		$(".message").each(function () {
			var message = {};
			message.id = this.id;
			message.location = $(this).find(".location").html().trim();
			message.exactlocation = $(this).find(".exact-location").html().trim();
			message.description = $(this).find(".description").html().trim();
			message.latitude = parseFloat($(this).find(".latitude").html().trim());
			message.longitude = parseFloat($(this).find(".longitude").html().trim());
			
			mapApp.messages.push(message);
		});
	},

	createMarker: function (message) {
		var marker = new google.maps.Marker({
			map: map,
			position: this.getCordinates(message),
			title: message.location
		});

		marker.clickId = message.id;
		mapApp.markers.push(marker);
		marker.addListener('click', function () {

			//center map to clicked marker
			map.panTo(marker.getPosition());

			mapApp.showInfoWindow(message, marker);

		});

	},

	showInfoWindow: function (message, marker) {
		var infoWindow = mapApp.getInfoWindowContentString(message);

		if (mapApp.infoWindow === null) {
			mapApp.infoWindow = new google.maps.InfoWindow({
				content: infoWindow
			});
			mapApp.infoWindow.open(map, marker);
		} else {
			mapApp.infoWindow.close();
			mapApp.infoWindow.setContent(infoWindow);
			mapApp.infoWindow.open(map, marker);
		}		
	},

	getInfoWindowContentString: function (message) {
		var location = message.location;
		var exactLocation = message.exactlocation;
		var description = message.description;
		var lat = message.latitude;
		var lng = message.longitude;
		var contentString = "<div class='infoWindow'>" +
							"<div class='infoWindow location'>" + location + "</div>" +
							"<div class='infoWindow exactLocation'>" + exactLocation + "</div><br />" +
							"<div class='infoWindow description'>" + description + "</div><br />" +
							"<div class='infoWindow coordinates'>Lat: " + lat + "<br />Lon: " + lng + "</div>" +
							"</div>";
		return contentString;
	},

	initMap: function () {
		var i;
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 63, lng: 15},
			zoom: 5
		});

		for (i = 0; i <= mapApp.messages.length -1; i++) {
			mapApp.createMarker(mapApp.messages[i]);
		}

	},

	messageClick: function () {
		$(".message-button").click(function () {
			var messageId = $(this).closest('.message').attr('id');
			var selectMarker;

			for (var i = 0; i <= mapApp.markers.length -1; i++) {
				if (mapApp.markers[i].clickId === messageId) {

					map.panTo(mapApp.markers[i].getPosition());

					mapApp.showInfoWindow(mapApp.messages[i], mapApp.markers[i]);
				}
			}
		});
	},

	expandClick: function () {
		$(".expand").click(function () {
			$(this).closest('.message').children().not(":first").not(":last").each(function () {
				$(this).toggleClass("hidden");
			})
		})
	}

};
mapApp.expandClick();
mapApp.messageClick();
mapApp.traverseMessages();
mapApp.showFilterButtons();
mapApp.initMap();
