'use strict';

var classroomApp = angular.module('classroomApp', ['ngRoute']);

// classroomApp.service('myService', function($http) {
//     return {
//         getHTML: function() {
// 			return $http({
// 				method: 'GET',
// 				url: '../views/testReadBlock.html'
// 			}).success(function(data){
// 				return data;
// 			});
//         }
//     };
// });

// // Stolen from: http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
// classroomApp.directive('dynamic', function ($compile) {
//   return {
//     replace: true,
//     link: function (scope, ele, attrs) {
//       scope.$watch(attrs.dynamic, function(html) {
// 		if (!html) {
// 			return;
// 		}
//         ele.html((typeof(html) === 'string') ? html : html.data);
//         $compile(ele.contents())(scope);
//       });
//     }
//   };
// });

// classroomApp.controller('classroomController', ['$scope', 'myService', function($scope, myService) {
//     $scope.homeMessage = 'page 1';
//     $scope.addMoreStuffToPage = function() {
//         $scope.waitForIt = myService.getHTML();
// 	};
// }]);
classroomApp.controller('classroomController', ['$scope', function($scope) {
  $scope.templates =
    [ { name: 'Reading Block', url: '../views/testReadBlock.html'},
      { name: 'Conversation Block', url: '../views/testConversationBlock.html'},
      { name: 'Vocabulary Block', url: '../views/testVocabBlock.html'}];
  $scope.template = $scope.templates[0];
  
  //completed blocks
  $scope.blocks = [
      { block: 'vocabulary', url: '../views/testConversationBlock.html' },
      { block: 'reading', url: './views/testReadBlock.html' },
      { block: 'vocabulary', url: '../views/testVocabBlock.html' }
    ];
}]);


//TODO remove highlight if re-selected / send word to database / tool-tip dictionary definition
classroomApp.directive('highlight', function() {
  function escapeRegExp(str) { //Use regExp to find all matching words
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      element.css({ cursor: 'pointer' });
      element.on('dblclick', function(e) {
        var range = window.getSelection() || document.getSelection() || document.selection.createRange();
        var word = range.toString().trim();
        if(word !== '') {
          console.log(word);
        }
        var html = element.html().replace(new RegExp(escapeRegExp(word), 'g'), '<span class="highlight">'+word+'</span>'); //grap the element html and replace matched words with highlight class surrounding
			  element.html(html);
        e.stopPropagation();
      });      
    }
  }
});