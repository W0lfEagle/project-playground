'use strict';

var convoBlockApp = angular.module('convoBlockApp', ['ngRoute']);

convoBlockApp.controller('convoBlockController', ['$scope', function($scope) {
  $scope.convoContent = $scope.$parent.content[1];
}])