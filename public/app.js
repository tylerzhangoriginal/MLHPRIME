(function(){
	var app = angular.module('firefly',['ui.router', 'ngRoute', 'uiGmapgoogle-maps']);

	app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "landing.html",
        controller: "IndexCtrl"
      })
      .when("/app/:category/:radius", {
        templateUrl: "main.html",
        controller: "MainCtrl"
      });
    $locationProvider.html5Mode(true);
	});

  app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){
    console.log("index controller loaded");
  });

  app.controller('MainCtrl', function($rootScope, $scope, $routeParams, $http, uiGmapGoogleMapApi){
    console.log("main controller loaded");
    console.log($routeParams);
    var styles = [ { "featureType": "landscape", "stylers": [ { "hue": "#ffe500" }, { "saturation": -100 }, { "lightness": -45 } ] },
    { "featureType": "poi", "stylers": [ { "hue": "#0008ff" }, { "saturation": -87 }, { "lightness": -51 } ] },
    { "featureType": "road", "elementType": "labels.icon", "stylers": [ { "hue": "#1100ff" }, { "saturation": -65 }, 
    { "gamma": 1.05 }, { "visibility": "off" }, { "lightness": -25 } ] },{ "featureType": "road.highway", "stylers": [ { "lightness": 21 }, { "saturation": -48 }, { "hue": "#ffff00" } ] },
    { "featureType": "water", "stylers": [ { "saturation": -42 }, { "hue": "#0091ff" }, { "lightness": -73 } ] },{ "featureType": "poi" } ];
    $scope.keyword = $routeParams.category;
    $scope.radius = $routeParams.radius;
    $scope.circles = [];
    $scope.map = {
      center: {
        latitude: 40.364902,
        longitude: -74.1674117
      },
      options: {
        styles: styles
      },
      zoom: 12
    };

    $scope.markers = [];
    addMarker = function (data) {
      $scope.circles.push(
        {
            id: data.name,
            center: {
              latitude: data.lat,
              longitude: data.lon
            },
            radius: 50000,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            }
        }
      );
    };

    var options = {
      enableHighAccuracy: false
    };

    displayMarker = function() {
      $http({
        method: 'GET',
        url: '/api?lat=' + $scope.map.center.latitude + '\&lon=' + $scope.map.center.longitude + '\&radius=' + $scope.radius + '\&keyword='+ $scope.keyword
      }).then(function successCallback(response) {
          response.data.forEach(function(d){
            info = {
              'name': d.name,
              'lat': d.geometry.location.lat,
              'lon': d.geometry.location.lng
            };
            addMarker(info);
          });
          console.log($scope.markers);
          console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
    };
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        $scope.$apply(function(){
          $scope.map.center = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        });
        console.log(JSON.stringify($scope.map));
        displayMarker();
      },
      function(error) {
        alert('Unable to get location: ' + error.message);
        $scope.$apply(function(){
          $scope.map.center = {
            latitude: 40.364902,
            longitude: -74.1674117
          };
        });
        console.log(JSON.stringify($scope.map));
        displayMarker();
      },
      options
    );
  });
})();