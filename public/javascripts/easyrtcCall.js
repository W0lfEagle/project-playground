/**
 * Name: Wilford Engel
 * SRN: 130190747
 * Date: 19th April 2016
 * Description: javascript for setting up and handling easyRTC peer connections,
 * calls and messages. Uses randomly generated user ids but should be provided by
 * the user database
 */

var theirID;

function my_init() {
     easyrtc.setRoomOccupantListener( loggedInListener);
     easyrtc.easyApp("Lingua_Franca_English_Classroom", "self", ["caller"],
         function(myId) {
            console.log("My easyrtcid is " + myId);
         }
     );
     chatListener();
    $.material.init();
}


function loggedInListener(roomName, otherPeers) {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    for(var i in otherPeers) {
        theirID = i;
        // var button = document.createElement('button');
        if (document.getElementById('call-button')) {
            var button = document.getElementById('call-button');
            button.className += " btn-success";
            button.onclick = function(easyrtcid) {
                return function() {
                    performCall(easyrtcid);
                }
                
            }(i);
            console.log("Someone connected");
        }
    }
}


function performCall(easyrtcid) {
    easyrtc.call(
       easyrtcid,
       function(easyrtcid) { console.log("completed call to " + easyrtcid);},
       function(errorMessage) { console.log("err:" + errorMessage);},
       function(accepted, bywho) {
          console.log((accepted?"accepted":"rejected")+ " by " + bywho);
       }
   );
}

function hangUp() {
    easyrtc.hangupAll();
    //  easyrtc.disconnect(); // Disconnect from server
}

function sendMessage(messageType, messageData) {
    console.log("sending message");
    if(messageType == 'setImages') {
        console.log("setting image search query");
        messageData = $('.search-query').val();
    }
    easyrtc.sendDataWS( theirID, messageType, messageData, function(ackMesg) {
         if( ackMesg.msgType === 'error' ) {
             console.log(ackMesg.msgData.errorText);
         }
    });
}

function chatListener() {
    $('#chat').keyup(function(e) {
        if(e.keyCode == 13) {
            var div = document.createElement('div');
            div.className = 'this-message pull-right';
            div.innerHTML = '<p>' + $('#chat').val() + '</p>';
            var chatWindow = document.getElementById("chat-window");
            chatWindow.appendChild(div);
            chatWindow.scrollTop = chatWindow.scrollHeight;
            sendMessage('chatMessage', $('#chat').val());
            $('#chat').val('');
        }
    });
}

easyrtc.setPeerListener( function(sendersEasyrtcid, msgType, msgData, targeting) {
    if( msgType === 'contactInfo' ) {
        console.log( sendersEasyrtcid  + ' is named ' + msgData.firstName + ' ' + msgData.lastName);
    }
    else if ( msgType === 'chatMessage' ) {
        console.log(msgData);
        var div = document.createElement('div');
        div.className = 'that-message pull-left';
        div.innerHTML = '<p>' + msgData + '</p>';
        var chatWindow = document.getElementById("chat-window");
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    else if (msgType === 'blockInsert') {
        console.log("Message recieved - insert block " + msgData.index + ' ' + msgData.type);
        $('#classroom').scope().remoteInsert(msgData.index, msgData.type);
    }
    else if (msgType === 'wordSelect' ) {
        // alert("They just selected the word " + msgData);
        // angular.element(document.getElementById('reading')).scope().wordselectfunction(msgData);
        var span = document.createElement('span');
        span.className = 'label label-default';
        span.innerHTML = msgData;
        var wordlist = document.getElementById('wordlist');
        wordlist.appendChild(span);
        $('#classroom').scope().insertWord(msgData);
        // <span class="label label-default">Default</span>
    }
    else if (msgType === 'remoteControl') {
        switch (msgData) {
            case 'stopVideo':
                stopVideo();
                break;
            case 'playVideo':
                playVideo();
                break;
            case 'pauseVideo':
                pauseVideo();
                break;
            default:
                // break;
        }
    }
    else if (msgType === 'setImages') {
        console.log("image search term is: " + msgData);
        setImages(msgData);
    }
});

function disableCamera() {
    easyrtc.enableCamera(false);

    easyrtc.getLocalStream().getVideoTracks().forEach(function(track) {
        track.stop()
    });
}

function enableCamera() {
    // easyrtc.enableCamera(true);
    easyrtc.initMediaSource(
         function(mediastream){
             easyrtc.setVideoObjectSrc( document.getElementById("self"), mediastream);
         },
         function(errorCode, errorText){
              easyrtc.showError(errorCode, errorText);
         });
}