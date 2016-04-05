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
classroomApp.controller('classroomController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  // $locationProvider.html5Mode(true);  // Nasty hack to get around locationProvider issue
  $scope.currentPath = $location.absUrl().split('/');
  $scope.currentPath = $scope.currentPath[$scope.currentPath.length - 1];
  $scope.intro = true;
  
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
  
  $scope.dynamicContent = null;
  $http.get('../content/dynamicLessonData.json')
      .success(function(data) {
          $scope.dynamicContent=data;
      })
      .error(function(data,status,error,config){
          // $scope.content = [{heading:"Error",description:"Could not load json data"}];
          console.log("Failed to load dynamic content data\n" + data + "\n" + status + "\n" + error + "\n" + config);
      });
  
  //inserted blocks
  $scope.blocks = [];
  $scope.insert = function(index, type) {
    $scope.localInsert(index, type);
    var msg = {index: index, type: type}
    sendMessage('blockInsert', msg);
  }
  $scope.remoteInsert = function(index, type) {
    $scope.intro = false;
    $scope.localInsert(index, type);
    $scope.$apply();
    console.log("Remote insert function called " + index);
  }
  $scope.localInsert = function(index, type) {
    if(type == 'static') {
      if( $scope.content[index].content_type == "reading" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[0]);
      }
      else if( $scope.content[index].content_type == "conversation" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[1]);
      }
      else if( $scope.content[index].content_type == "vocabulary" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[2]);
      }
      $scope.blocks[$scope.blocks.length - 1].contentId = {id: $scope.content[index].id, type: 'static'};
      console.log("Local insert function called " + index);
    }
    else if(type == 'dynamic') {
      if( $scope.dynamicContent[index].content_type == "reading" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[0]);
      }
      else if( $scope.dynamicContent[index].content_type == "conversation" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[1]);
      }
      else if( $scope.dynamicContent[index].content_type == "vocabulary" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[2]);
      }
      $scope.blocks[$scope.blocks.length - 1].contentId = {id: $scope.dynamicContent[index].id, type: 'dynamic'};
      console.log("Local insert function called " + index);
    }
  }
  
  $scope.insertWord = function(word) {
    var newWord = {word: word, pos: 'TODO', sentence: 'TODO'};
    $scope.dynamicContent[0].data.push(newWord);
    $scope.$apply();
  }
  
  // console.log($location.path());
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