'use strict';

var classroomApp = angular.module('classroomApp', ['ngRoute', 'readBlockApp', 'convoBlockApp', 'vocabBlockApp']);

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
classroomApp.controller('classroomController', ['$scope', '$http', function($scope, $http) {
  $scope.templates =
    [ { id: 1, name: 'Reading Block', url: '../views/testReadBlock.html'},
      { id: 2, name: 'Conversation Block', url: '../views/testConversationBlock.html'},
      { id: 3, name: 'Vocabulary Block', url: '../views/testVocabBlock.html'}];
  $scope.template = $scope.templates[0];
  
  $scope.content = null;
  $http.get('../content/trialLessonData.json')
      .success(function(data) {
          $scope.content=data;
      })
      .error(function(data,status,error,config){
          // $scope.content = [{heading:"Error",description:"Could not load json data"}];
          console.log("Failed to load content data\n" + data + "\n" + status + "\n" + error + "\n" + config);
      });
  
  //completed blocks
  $scope.blocks = [];
  $scope.insert = function(index) {
    if( $scope.content[index].content_type == "reading" ) {
      $scope.blocks = $scope.blocks.concat($scope.templates[0]);
    }
    else if( $scope.content[index].content_type == "conversation" ) {
      $scope.blocks = $scope.blocks.concat($scope.templates[1]);
    }
    else if( $scope.content[index].content_type == "vocabulary" ) {
      $scope.blocks = $scope.blocks.concat($scope.templates[2]);
    }
    $scope.blocks[$scope.blocks.length - 1].contentId = $scope.content[index].id;
    console.log("Local insert function called " + index);
  }
  $scope.remoteInsert = function(index) {
    $scope.insert(index);
    $scope.$apply();
    console.log("Remote insert function called " + index);
  }
  
}]);

// classroomApp.directive('classroom', function() {
//   return {
//     restrict: 'A',
//     link: function(scope, element, attrs) {
//       scope.insert = function(index) {
//         // $scope.blocks = $scope.blocks.concat({ block: 'vocabulary', url: '../views/testVocabBlock.html' });
//         scope.blocks = scope.blocks.concat(scope.templates[index]);
//         $scope.$apply();
//         console.log("Insert function called " + index);
//         // sendMessage('blockInsert', index);
//       }
//     }
//   }
// });


// //TODO remove highlight if re-selected / send word to database / tool-tip dictionary definition
// classroomApp.directive('highlight', function() {
//   function escapeRegExp(str) { //Use regExp to find all matching words
//     return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
//   }
//   return {
//     restrict: 'E',
//     link: function(scope, element, attrs) {
//       element.css({ cursor: 'pointer' });
//       element.on('dblclick', function(e) {
//         var range = window.getSelection() || document.getSelection() || document.selection.createRange();
//         var word = range.toString().trim();
//         if(word !== '') {
//           console.log(word);
//         }
//         var html = element.html().replace(new RegExp(escapeRegExp(word), 'g'), '<span class="highlight">'+word+'</span>'); //grap the element html and replace matched words with highlight class surrounding
// 			  element.html(html);
//         e.stopPropagation();
//       });      
//     }
//   }
// });