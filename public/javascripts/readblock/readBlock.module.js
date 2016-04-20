/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: angular controllers and directives for the reading block
 * listens for clicks on the article, finds the word and highlights, directive
 * for the dictionary looks up translations and POS tags from dictionary API
 * service and adds the word to the vocabulary for the lesson
 */

'use strict';

var readBlockApp = angular.module('readBlockApp', ['ngRoute']);

//TODO remove highlight if re-selected
// Highlight directive can be added to any element using the <highlight></highlight> element tags
// listens for a double click, searches element for matching words and surrounds with highlight class
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
        var exclude = ['', ' ', ',', '.', '(', ')', '!', '?'];
        if(!((exclude.indexOf(word) > -1))) {
          // console.log(word);
          sendMessage('wordSelect', word);
          // popover(word);
          scope.$parent.$apply();
          var html = element.html().replace(new RegExp(escapeRegExp(word), 'g'), '<span class="highlight">'+word+'</span>'); //grab the element html and replace matched words with highlight class surrounding
			    element.html(html);
          e.stopPropagation();
        }
      });
    }
  }
});

// dictionary directive takes care of getting pos and translations from Yandex API and updating the scope as required
readBlockApp.directive('dictionary', ['DictionaryFactory', function(DictionaryFactory) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      //List of available language translations from English
      scope.langOptions = [{ name: "Spanish", code: "es" }, { name: "Hungarian", code: "hu" }, { name: "Czech", code: "cs" }, { name: "Danish", code: "da" }, { name: "German", code: "de" }, { name: "Greek", code: "el" }, { name: "Estonian", code: "et" }, { name: "Finish", code: "fi" }, { name: "French", code: "fr" }, { name: "Italian", code: "it" }, { name: "Lithuanian", code: "lt" }, { name: "Latvian", code: "lv" }, { name: "Dutch", code: "nl" }, { name: "Norwegian", code: "no" }, { name: "Portuguese", code: "pt" }, { name: "Russian", code: "ru" }, { name: "Slovakian", code: "sk" }, { name: "Swedish", code: "sv" }, { name: "Turkish", code: "tr" }, { name: "Ukranian", code: "uk" }];
      scope.destLang = scope.langOptions[0]; // set default to Spanish
      
      // watch the 'word' set by the highlight directive for changes 
      scope.$parent.$watch('word', function (newWord) {
        console.log("The directive is being called again with " + newWord);
        var destLang = scope.destLang.code;
        var wordType = "";
        scope.translations = []; // store list of translations
        console.log("Getting definintion");
        
        scope.wordType = "searching...";
        
        // var dictionaryTranslation = new Dicstyle.heighttionaryTranslation(newWord, destLang);
        // console.log("The POS is " + dictionaryTranslation);
        var data = {};
        
        if(destLang != "hu") {
          DictionaryFactory.loadDictionaryTranslations(newWord, destLang).then(function(response) {
            // console.log(response.data);
            data = response.data;
          
            if(data.def.length > 0) {
              // console.log(data);
              wordType = data.def[0].pos;
              addWord();
              scope.translations = scope.translations.concat(data.def[0].tr[0].text);
              // console.log(data.def[0].tr[0].text);
              if(data.def[0].tr[0].syn && data.def[0].tr[0].syn.length > 0) {
                for (var i = 0; i < data.def[0].tr[0].syn.length; i++) {
                  scope.translations = scope.translations.concat(data.def[0].tr[0].syn[i].text);
                  // console.log(data.def[0].tr[0].syn[i].text);
                }
              }
            }
            else scope.wordType = "";
          });
        }
        else {
          DictionaryFactory.loadDictionaryEn(newWord).then(function(response) {
            console.log(response.data);
            data = response.data;
            if(data.def.length > 0) {
              wordType = data.def[0].pos;
              addWord();
            }
          });
          
          DictionaryFactory.loadTranslations(newWord, destLang).then(function(response) {
            console.log(response.data);
            data = response.data;
            if(data.text.length > 0) {
              for (var i in data.text) {
                scope.translations = scope.translations.concat(data.text[i]);
              }
            }
          });
        }
        
        function addWord() {
          scope.wordType = wordType;
          var addWord = {word: newWord, pos: wordType, sentence: 'This is just a bad example of a sentence using the word ' + newWord};
          scope.$parent.dynamicContent[0].data.push(addWord);
        }
      }); //watch
    }
  }
}]);

readBlockApp.factory("DictionaryFactory", function($http) {
  var factory = {};
    
  factory.loadDictionaryTranslations = function(word, destLang) {
    console.log("Getting dictionary translations for " + word + ' ' + destLang);
    var url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20160414T182102Z.74d50fe4fb0fb84f.cd90aa001917f7c3f8ee38ff0c7655da1b8034f0&lang=en-' + destLang + '&text=' + word + '&flags=4';
    return $http.get(url);
  };
  
  factory.loadTranslations = function(word, destLang) {
    console.log("Getting translation for " + word + ' ' + destLang);
    var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160414T180419Z.9b224c97041d124a.59f09d3010d84d79c50cd804c57b0bc0e7e5ed8e&text=' + word + '&lang=en-' + destLang;
    return $http.get(url);
  };
  
  factory.loadDictionaryEn = function(word) {
    console.log("Getting English dictionary for " + word);
    var url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20160414T182102Z.74d50fe4fb0fb84f.cd90aa001917f7c3f8ee38ff0c7655da1b8034f0&lang=en-en&text=' + word + '&flags=4';
    return $http.get(url);
  };
  
  return factory;
});