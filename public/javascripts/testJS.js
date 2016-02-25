$('#insert-module').click(function() {
            // conn.send("034872398120923");
            insertConversationModule();

            // console.log("Insert instruction sent");
        });

function insertConversationModule() {
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

    //render data
    //var html = new EJS({ url: '/modules/conversation'});

// Append the rendered HTML
//    $('#lesson').append(html);

}