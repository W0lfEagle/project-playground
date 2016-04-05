var theirID;

function my_init() {
     easyrtc.setRoomOccupantListener( loggedInListener);
     easyrtc.easyApp("Lingua_Franca_English_Classroom", "self", ["caller"],
         function(myId) {
            console.log("My easyrtcid is " + myId);
         }
     );
    //  easyrtc.enableDataChannels(true);
     chatListener();
    $.material.init();
}


function loggedInListener(roomName, otherPeers) {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    for(var i in otherPeers) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            }
        }(i);
        
        theirID = i;
        label = document.createTextNode("Call ID: " + i);
        button.appendChild(label);
        otherClientDiv.appendChild(button);
        console.log("Someone connected");
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
//   sendMessage(easyrtcid, 'contactInfo', { firstName:'john', lastName:'smith' });
//   easyrtc.setDataChannelOpenListener(
//         function(easyrtcid) { console.log("channel is open");}
//     );
}

function hangUp() {
    easyrtc.hangupAll();
    //  easyrtc.disconnect(); // Disconnect from server
}

function sendMessage(messageType, messageData) {
    // easyrtc.sendDataWS( destination, messageType, messageData, ackHandler);
    console.log("sending message");
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
// conn.on('data', function(data) {
//     console.log('Received', data);
//     var div = document.createElement('div');
//     div.className = 'that-message pull-left';
//     div.innerHTML = '<p>' + data + '</p>';
//     var chatWindow = document.getElementById("chat-window");
//     chatWindow.appendChild(div);
//     chatWindow.scrollTop = chatWindow.scrollHeight;
// });

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
});

// function testThings() {
//     angular.element(document.getElementById('reading')).scope().testfunction('test');
// }

function disableCamera() {
    easyrtc.enableCamera(false);
//     var MediaStream = window.MediaStream;

// if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
//     MediaStream = webkitMediaStream;
// }

// /*global MediaStream:true */
// if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
//     MediaStream.prototype.stop = function() {
//         this.getAudioTracks().forEach(function(track) {
//             track.stop();
//         });

//         this.getVideoTracks().forEach(function(track) {
//             track.stop();
//         });
//     };
// }
    easyrtc.getLocalStream().getVideoTracks().forEach(function(track) {
        track.stop()
    });
    // easyrtc.getLocalStream().getAudioTracks().forEach(function(track) {
    //     track.stop()
    // });
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