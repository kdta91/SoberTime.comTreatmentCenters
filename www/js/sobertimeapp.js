(function(){
  'use strict';
  var sobertimeapp = angular.module('sobertimeapp', ['onsen', 'simplePagination']);
  var map = angular.module('SvgMapApp', []);

  angular.module('CombinedModule', ['sobertimeapp', 'SvgMapApp']);

  sobertimeapp.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    $http.get('js/data/us-states.json').
      success(function(data){
        $scope.state_data = data;
      });

    $scope.stateCenters = function(state) {
      $scope.ons.navigator.pushPage('state-centers.html', { state : state });
    }

    $scope.searchCenter = function() {
      $scope.ons.navigator.pushPage('state-centers.html', { kword : $scope.center_keyword });
    }
  }]);

  sobertimeapp.controller('StateCentersController', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {
    var page = $scope.ons.navigator.getCurrentPage();
    $scope.header = '';
    $scope.kword = '';
    $scope.show = true;
    $scope.show_message = $scope.show_pagination = false;
    $scope.pagination = Pagination.getNew(100);

    if (page.options.kword == '' || page.options.kword == null) {
      $scope.header = page.options.state;

      $http.get('http://sobertime.com/sobertime_app/data_query.php?state='+page.options.state).
        success(function(data){
          console.log(data);
          $scope.centers = data;
          $scope.show = false;
          $scope.show_pagination = true;
          $scope.pagination.numPages = Math.ceil($scope.centers.length/$scope.pagination.perPage);
        });
    }
    else {
      $scope.header = 'Search Results';
      $scope.kword = page.options.kword;

      $http.get('http://sobertime.com/sobertime_app/data_query.php?kword='+$scope.kword).
        success(function(data){
          $scope.centers = data;
          $scope.show_message = true;
          $scope.show = false;
          $scope.show_pagination = true;
          $scope.pagination.numPages = Math.ceil($scope.centers.length/$scope.pagination.perPage);
        });
    }

    $scope.centerDetails = function(center, address, zip, phone1, phone2, participation, website, service1, service2, service3, service4, service5) {
        var phone = phone1;

        if (phone == '' || phone == null || phone == 'N/A') {
          phone = phone2;
        }

        $scope.ons.navigator.pushPage('center-details.html', { center_name : center, center_address : address, center_zip : zip, center_phone : phone, center_participation : participation, center_website : website, center_service1 : service1, center_service2 : service2, center_service3 : service3, center_service4 : service4, center_service5 : service5 });
      }
  }]);

  sobertimeapp.controller('CenterDetailsController', ['$scope', '$sce', function($scope, $sce) {
    var page = $scope.ons.navigator.getCurrentPage();
    $scope.center_name = page.options.center_name;
    $scope.center_address = page.options.center_address;
    $scope.center_zip = page.options.center_zip;
    $scope.center_phone = page.options.center_phone;
    $scope.center_participation = page.options.center_participation;
    $scope.center_website = page.options.center_website;
    $scope.center_service1 = page.options.center_service1;
    $scope.center_service2 = page.options.center_service2;
    $scope.center_service3 = page.options.center_service3;
    $scope.center_service4 = page.options.center_service4;
    $scope.center_service5 = page.options.center_service5;

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }
    $scope.map_url = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBDtxieKrQwBJ5HSwDH-M55qFw6sJmn_9s&q='+$scope.center_address;

    if (page.options.center_address == '' || page.options.center_address == null || page.options.center_address == "N/A") {
      $scope.center_address = 'No data available';
    }
    if (page.options.center_zip == '' || page.options.center_zip == null || page.options.center_zip == "N/A") {
      $scope.center_zip = 'No data available';
    }
    if (page.options.center_phone == '' || page.options.center_phone == null || page.options.center_phone == "N/A") {
      $scope.center_phone = 'No data available';
    }
    if ($scope.center_participation == '' || $scope.center_participation == null || $scope.center_participation == 'N/A') {
        $scope.center_participation ='No data available';
      }
    if (page.options.center_website == '' || page.options.center_website == null || page.options.center_website == "N/A") {
      $scope.center_website = 'No data available';
    }
    if (page.options.center_service1 == '' || page.options.center_service1 == null || page.options.center_service1 == "N/A") {
      $scope.center_service1 = ' ';
    }
    if (page.options.center_service2 == '' || page.options.center_service2 == null || page.options.center_service2 == "N/A") {
      $scope.center_service2 = ' ';
    }
    if (page.options.center_service3 == '' || page.options.center_service3 == null || page.options.center_service3 == "N/A") {
      $scope.center_service3 = ' ';
    }
    if (page.options.center_service4 == '' || page.options.center_service4 == null || page.options.center_service4 == "N/A") {
      $scope.center_service4 = ' ';
    }
    if (page.options.center_service5 == '' || page.options.center_service5 == null || page.options.center_service5 == "N/A") {
      $scope.center_service5 = ' ';
    }
  }]);
})();