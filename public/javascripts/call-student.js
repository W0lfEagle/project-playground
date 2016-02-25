navigator.getWebcam = (navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);

var conn;

// var peer = new Peer('Randomadfpovihq39',
//     { key: 'pju4scj78qepzaor',
//         debug: 3,
//         config: {'iceServers': [
//             { url: 'stun:stun.l.google.com:19302'},
//             { url: 'stun:stun1.l.google.com:19302'},
//             { url: 'turn:numb.viagenie.ca', username:"info@linguafrancaworld.com", credential:"4jTBNGy@p@mdEn"}
        // ]}});
var peer = new Peer('Randomadfpovihq39', {host: 'mypeerserver.herokuapp.com/', port: 9000});


// on open set peer id
peer.on('open', function() {
    $('#my-id').text(peer.id);
});

peer.on('call', function(call) {
    //Answer automatically
    call.answer(window.localStream);
    makeCall(call);
});

peer.on('connection', function(conn) {
    makeConn(conn);
});

//click handlers
$(function() {
    $('#make-call').click(function() {
        //initiate call
        var call = peer.call('Randomwefviuq3481', window.localStream);
        conn = peer.connect('Randomwefviuq3481');
        makeCall(call);
        makeConn(conn);
    });
    $('end-call').click(function() {
        window.existingCall.close();
        //step2();
    });
    ////listen for enter/ clear / send
    //$('#chat').keyup(function(e) {
    //    if(e.keyCode == 13) {
    //        console.log('I say : ' + $('#chat').val());
    //        conn.send('They say : ' + $('#chat').val());
    //        $('#chat').val('');
    //    }
    //});
    //retry if getUserMedia fails
    $('#step1-retry').click(function() {
        $('#step1-error').hide();
        setupLocalStream();
    });

    //get started
    setupLocalStream();
});

function setupLocalStream() {
    //Get audio/video stream
    navigator.getWebcam({audio: true, video: true}, function(stream){
        //Display video
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        //step2();
    }, function(){ $('#step1-error').show();});
}
//
//function step2() { // Adjust UI
//    $('#step1', '#makeCall').hide();
//    $('#step2').show();
//}

function makeCall(call) {
    // hang up existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }

    //wait for stream on the call then setup peer video
    call.on('stream', function(stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    //
    //$('#step1', '#step2').hide();
    //$('#makeCall').show();
}

function makeConn(conn) {
    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {

            if(data == "034872398120923") {
                var module = document.createElement('div');
                module.className = 'container-fluid conversation well';
                module.innerHTML =
                    '<div class="row">' +
                    '<div class="col-xs-4 section-heading">' +
                    '<h1>Conversation</h1>' +
                    '</div>' +
                    '<div class="col-xs-8 section-content">' +
                    '<p>What do you think life will be like in the 31st century?</p>' +
                    '<p>Do you think technology will harm us?</p>' +
                    '<p>Do you think the human race will still be here in 100,000 years?</p>' +
                    '<p>Would you want to live in the 31st century?</p>' +
                    '<p>Does the theory sound more like science fiction or science fact?</p>' +
                    '</div>' +
                    '</div>';
                var lesson = document.getElementById("lesson");
                lesson.appendChild(module);
                lesson.scrollTop = lesson.scrollHeight;
                console.log("Insert instruction recieved");
            }
            else {
                console.log('Received', data);
                var div = document.createElement('div');
                div.className = 'that-message pull-left';
                div.innerHTML = '<p>' + data + '</p>';
                var chatWindow = document.getElementById("chat-window");
                chatWindow.appendChild(div);
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        });

        // Send messages
        conn.send('Hello!');
        //listen for enter/ clear / send
        $('#chat').keyup(function(e) {
            if(e.keyCode == 13) {
                var div = document.createElement('div');
                div.className = 'this-message pull-right';
                div.innerHTML = '<p>' + $('#chat').val() + '</p>';
                var chatWindow = document.getElementById("chat-window");
                chatWindow.appendChild(div);
                chatWindow.scrollTop = chatWindow.scrollHeight;
                //console.log('I say : ' + $('#chat').val());
                //$('#chat-window').add('<div class="this-message pull-right"> <p>' + $('#chat').val() + '</p> </div>');
                conn.send($('#chat').val());
                $('#chat').val('');
            }
        });
    });
}