/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: Main angular application and classroom controller
 * loads the templates, loads the content from json, inserts content blocks into
 * the lesson, handles remote block insert calls
 */

'use strict';

var classroomApp = angular.module('classroomApp', ['ngRoute', 'readBlockApp', 'convoBlockApp', 'vocabBlockApp', 'videoBlockApp']);


// the classroomController takes care of the insertion of content blocks in the lesson
// first, the templates are loaded, then the content is loaded and finally functions are used to add blocks to the DOM
classroomApp.controller('classroomController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  // $locationProvider.html5Mode(true);  // Nasty hack to get around locationProvider issue
  $scope.currentPath = $location.absUrl().split('/');
  $scope.currentPath = $scope.currentPath[$scope.currentPath.length - 1];
  $scope.intro = true; // student will see welcome message when no blocks are present
  $scope.maxDynVocab = false; // limit number of dynamic vocab blocks
  $scope.maxImage = false;
  
  $scope.templates = // load block template html files 
    [ { id: 1, name: 'Reading Block', url: '../views/partials/lesson blocks/readingBlock.html'},
      { id: 2, name: 'Conversation Block', url: '../views/partials/lesson blocks/conversationBlock.html'},
      { id: 3, name: 'Vocabulary Block', url: '../views/partials/lesson blocks/vocabularyBlock.html'},
      { id: 4, name: 'Video Block', url: '../views/partials/lesson blocks/videoBlock.html'},
      { id: 5, name: 'Image Block', url: '../views/partials/lesson blocks/imageBlock.html'}];
  $scope.template = $scope.templates[0];
  
  $scope.content = null; // initialize variable to hold content data
  $http.get('../content/trialLessonData.json') // load content from json file. TODO serve from server
      .success(function(data) {
          $scope.content=data;
      })
      .error(function(data,status,error,config){
          // $scope.content = [{heading:"Error",description:"Could not load json data"}];
          console.log("Failed to load content data\n" + data + "\n" + status + "\n" + error + "\n" + config);
      });
  
  $scope.dynamicContent = null; // dynamic content json is unnecessary simply gives titles
  $http.get('../content/dynamicLessonData.json')
      .success(function(data) {
          $scope.dynamicContent=data;
      })
      .error(function(data,status,error,config){
          // $scope.content = [{heading:"Error",description:"Could not load json data"}];
          console.log("Failed to load dynamic content data\n" + data + "\n" + status + "\n" + error + "\n" + config);
      });
  
  //keep track of inserted blocks
  $scope.blocks = [];
  // $scope.blocks = $scope.blocks.concat($scope.templates[0]); // testing, add block directly from id
  // $scope.blocks[0].contentId = {id: $scope.content[1].id, type: 'static'};
  $scope.insert = function(index, type) { // function to insert block, first insert locally then send message to peer to insert remotely
    $scope.localInsert(index, type);
    var msg = {index: index, type: type}
    sendMessage('blockInsert', msg);
  }
  $scope.remoteInsert = function(index, type) { // called when blockInsert message recieved, calls localInsert and then $apply to update scope
    $scope.intro = false;
    $scope.localInsert(index, type);
    $scope.$apply();
    console.log("Remote insert function called " + index);
  }
  $scope.localInsert = function(index, type) { // TODO convert to switch - more readable 
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
      else if( $scope.content[index].content_type == "video" ) {
        $scope.blocks = $scope.blocks.concat($scope.templates[3]);
      }
      $scope.blocks[$scope.blocks.length - 1].contentId = {id: $scope.content[index].id, type: 'static'};
      console.log("Local insert function called " + index);
    }
    else if(type == 'dynamic') {
      if( $scope.dynamicContent[index].content_type == "vocabulary" && $scope.maxDynVocab == false) {
        $scope.blocks = $scope.blocks.concat($scope.templates[2]);
        $scope.maxDynVocab = true;
      }
      else if( $scope.dynamicContent[index].content_type == "image" && $scope.maxImage == false) {
        $scope.blocks = $scope.blocks.concat($scope.templates[4]);
        $scope.maxImage = true;
      }
      $scope.blocks[$scope.blocks.length - 1].contentId = {id: $scope.dynamicContent[index].id, type: 'dynamic'};
      console.log("Local insert function called " + index);
    }
  }
  
  // $scope.insertWord = function(word) {
  //   var newWord = {word: word, pos: 'TODO', sentence: 'TODO'};
  //   $scope.dynamicContent[0].data.push(newWord);
  //   $scope.$apply();
  // }
}]);

classroomApp.directive('videocomms', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.myVideoDivHeight = element.height();
      console.log(scope.myVideoDivHeight);
      console.log(element[0].querySelector('#caller').offsetHeight);
    }
  }
});