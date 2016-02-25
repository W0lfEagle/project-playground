'use strict';

var classroomController = angular.module('classroomController', []);

classroomController.controller('classroomController', ['$scope', 'myService', function($scope, myService) {
    $scope.homeMessage = 'page 1';
    $scope.addMoreStuffToPage = function() {
        $scope.waitForIt = myService.getHTML();
	};
}]);