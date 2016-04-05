'use strict';

var readBlockApp = angular.module('readBlockApp', ['ngRoute']);

//TODO remove highlight if re-selected / send word to database / tool-tip dictionary definition
readBlockApp.directive('highlight', function($compile) {
  function escapeRegExp(str) { //Use regExp to find all matching words
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  // var word;
  return {
    // scope: {
    //   control: '='
    // },
    restrict: 'E',
    link: function(scope, element, attrs) {
      element.css({ cursor: 'pointer' });
      element.on('dblclick', function(e) {
        var range = window.getSelection() || document.getSelection() || document.selection.createRange();
        var word = range.toString().trim();
        if(word !== '') {
          // console.log(word);
          sendMessage('wordSelect', word);
          popover(word);
          console.log(scope.$parent.dynamicContent[0].data[0]);
          var newWord = {word: word, pos: 'TODO', sentence: 'TODO'};
          scope.$parent.dynamicContent[0].data.push(newWord);
          scope.$parent.$apply();
        }
        var html = element.html().replace(new RegExp(escapeRegExp(word), 'g'), '<span class="highlight">'+word+'</span>'); //grap the element html and replace matched words with highlight class surrounding
			  element.html(html);
        e.stopPropagation();
        // scope.control.remoteHighlight = function() {
        //   console.log("Directive method called from controller");
        // }
        
        function popover(word) {
          // console.log("popover");
          $(element).popover({
              trigger: 'hover',
              html: true,
              content: $compile('<p>'+word+'<p>')(scope)
          });           
        }
      });
    }
  }
});

readBlockApp.controller('readBlockController', ['$scope', function($scope) {
  $scope.readContent = $scope.$parent.content[0];
}])

// readBlockApp.directive('popover', function($compile){
//     return {
//         link: function(scope, element, attrs) {
//             // define popover for this element
//             $(element).popover({
//                 html: true,
//                 placement: "top",
//                 // grab popover content from the next element
//                 content: $compile( $(element).siblings(".pop-content").contents() )(scope)
//             });
//         }
//     }
// });


// readBlockApp.directive('remotehighlight', function(word) {
//   function escapeRegExp(str) { //Use regExp to find all matching words
//         return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
//       }
//     var html = element.html().replace(new RegExp(escapeRegExp(data), 'g'), '<span class="highlight">'+word+'</span>'); //grap the element html and replace matched words with highlight class surrounding
// 	  element.html(html);
//   }  
// });

// readBlockApp.controller('readBlockController', ['$scope', function($scope) {
//   $scope.testfunction = function (data) {
//         alert("---" + data);
//     };
//   $scope.wordselectfunction = function (data) {
    
//   }
      
// }]);

// readBlockApp.directive('customPopover', function () {
//     return {
//         restrict: 'A',
//         // template: '<span>{{label}}</span>',
//         link: function (scope, el, attrs) {
//             // scope.label = attrs.popoverLabel;
//             $(el).popover({
//                 trigger: 'click',
//                 html: true,
//                 content: "ahoy there!",
//                 placement: attrs.popoverPlacement
//             });
//         }
//     };
// });