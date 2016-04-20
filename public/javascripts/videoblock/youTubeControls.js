/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: javascript for controlling the youtube video
 * sets up the video using the video id, starts the iframe api service,
 * provides functions for local/remote controlling playback
 */

var player;
var thisVideoId = "";

function setupVideo( youtubeVideoId ) {
    console.log("loading video with id " + youtubeVideoId);
    // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    
    
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    thisVideoId = youtubeVideoId;
}
    
    
    // This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    // var player;
function onYouTubeIframeAPIReady() {
    console.log("iframe ready. Attempting to load " + thisVideoId);
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: thisVideoId,
      events: {
        // 'onReady': onPlayerReady,
        // 'onStateChange': onPlayerStateChange
        }
    });
}

function stopVideo() {
    player.stopVideo();
}

function playVideo() {
    player.playVideo();
}

function pauseVideo() {
    player.pauseVideo();
}