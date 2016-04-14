'use strict';

var readBlockApp = angular.module('readBlockApp', ['ngRoute', 'ngResource']);

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
        scope.word = word;
        if(word !== '') {
          // console.log(word);
          sendMessage('wordSelect', word);
          // popover(word);
          // console.log(scope.$parent.dynamicContent[0].data[0]);
          var newWord = {word: word, pos: 'TODO', sentence: 'TODO'};
          scope.$parent.dynamicContent[0].data.push(newWord);
          scope.$parent.$apply();
          // getTranslation(word);
        }
        var html = element.html().replace(new RegExp(escapeRegExp(word), 'g'), '<span class="highlight">'+word+'</span>'); //grap the element html and replace matched words with highlight class surrounding
			  element.html(html);
        e.stopPropagation();
        // scope.control.remoteHighlight = function() {
        //   console.log("Directive method called from controller");
        // }
        
        // function popover(word) {
        //   console.log("putting the word " + word + " in the popover");
        //   scope.$apply(function () { // This wraps the changes.
        //     $(element).popover({
        //       trigger: 'hover',
        //       html: true,
        //       content: $compile('<p>'+word+'<p>')(scope)
        //     });
        //   });
        // }
      });
    }
  }
});

readBlockApp.directive('dictionary', ['$http', function($http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // scope.word = "Hello";
      // scope.wordType = "word type";
      // scope.get = function(){
      // element.on('dblclick', function(e) {
      scope.langOptions = [{ name: "Spanish", code: "es" }, { name: "Hungarian", code: "hu" }, { name: "Czech", code: "cs" }, { name: "Danish", code: "da" }, { name: "German", code: "de" }, { name: "Greek", code: "el" }, { name: "Estonian", code: "et" }, { name: "Finish", code: "fi" }, { name: "French", code: "fr" }, { name: "Italian", code: "it" }, { name: "Lithuanian", code: "lt" }, { name: "Latvian", code: "lv" }, { name: "Dutch", code: "nl" }, { name: "Norwegian", code: "no" }, { name: "Portuguese", code: "pt" }, { name: "Russian", code: "ru" }, { name: "Slovakian", code: "sk" }, { name: "Swedish", code: "sv" }, { name: "Turkish", code: "tr" }, { name: "Ukranian", code: "uk" }];
      scope.destLang = scope.langOptions[0];
      
      scope.$parent.$watch('word', function (newWord) {
                    //do something with the new Time
        console.log("The directive is being called again with " + newWord);
        var destLang = scope.destLang.code;
        var word = scope.$parent.word;
          // $http.get("https://hablaa.com/hs/translation/" + word + "/eng-spa/").then(function(response) {
          //           scope.type = response.data;
          //           // scope.translations = [];
          // });
          // $http({ method: 'GET', url: 'https://hablaa.com/hs/translation/" + word + "/eng-spa/' }).
          //   success(function (data, status, headers, config) {
          //     scope.type = data;
          //     // ...
          //   }).
          //   error(function (data, status, headers, config) {
          //     // ...
          // });
        // };
        scope.translations = [];
        console.log("Getting definintion");
        // var Definition = $resource("https://hablaa.com/hs/translation/" + word + "/eng-spa/");
        // var Definition = $resource("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20160414T182102Z.74d50fe4fb0fb84f.cd90aa001917f7c3f8ee38ff0c7655da1b8034f0&lang=en-es&text=" + word);
        // scope.wordType = Definition.;
        // var def = Definition.get(function() {
        //   // user.abc = true;
        //   // user.$save();
        //   scope.wordType = def;
        // });
        if(destLang != "hu") {
          $http({ method: 'GET', url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20160414T182102Z.74d50fe4fb0fb84f.cd90aa001917f7c3f8ee38ff0c7655da1b8034f0&lang=en-' + destLang + '&text=' + word + "&flags=4" }).
              success(function (data, status, headers, config) {
                
                if(data.def.length > 0) {
                  console.log(data);
                  scope.wordType = data.def[0].pos;
                  scope.translations = scope.translations.concat(data.def[0].tr[0].text);
                  // console.log(data.def[0].tr[0].text);
                  if(data.def[0].tr[0].syn.length > 0) {
                    for (var i = 0; i < data.def[0].tr[0].syn.length; i++) {
                      scope.translations = scope.translations.concat(data.def[0].tr[0].syn[i].text);
                      console.log(data.def[0].tr[0].syn[i].text);
                    }
                  }
                }
                else scope.wordType = "";
                // ...
              }).
              error(function (data, status, headers, config) {
                // ...
          });
        }
        else { // get pos from english dictionary and translations from translator
          $http({ method: 'GET', url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20160414T182102Z.74d50fe4fb0fb84f.cd90aa001917f7c3f8ee38ff0c7655da1b8034f0&lang=en-en&text=' + word + "&flags=4" }).
                  success(function (data, status, headers, config) {
                    if(data.def.length > 0) {
                      // console.log(data);
                      scope.wordType = data.def[0].pos;
                    }
                  }).
                  error(function(data, status, headers, config) {
                     scope.wordType = "Not Available";
                  });
          $http({ method: 'GET', url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160414T180419Z.9b224c97041d124a.59f09d3010d84d79c50cd804c57b0bc0e7e5ed8e&text=' + word + '&lang=en-hu' }).
                  success(function (data, status, headers, config) {
                    // if(data.def.length > 0) {
                      // console.log(data);
                      // scope.wordType = data.def[0].pos;
                      scope.translations = scope.translations.concat(data.text[0]);
                    // }
                  }).
                  error(function(data, status, headers, config) {
                     scope.translations = scope.translations.concat("Not Available");
                  });
        }
      }); //watch
    }
  }
}]);

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