var lessonId = 2349857;
var studentId = 12390846;
var studentVocab = {"word": "hello", "sentence": "Hello my pretty."};
var lessonVocab = {"word": "rabbit", "sentence": "Look at the pretty rabbit."};
var chat = {"tutor1": "Hi, my name is Peter, are you ready to start?", "student1": "Yes, I'm ready"};
var conversationQuestions = {"q1": "What do you do for a living?", "q2": "Do you like to run?"}; 
var articleIds = {"article1": 34871};

// var socket = io();

function addStudentVocab(vocab) {
    studentVocab.push(vocab);
}

function addLessonVocab(vocab) {
    lessonVocab.push(vocab);
}

function addChat(chat) {
    chat.push(chat);
}

function addConversationQuestions(question) {
    conversationQuestions.push(question);
}

function addArticleIds(articleId) {
    articleIds.push(articleId);
}

function sendLessonToDB() {
    var lessonData = {
                    lessonId: lessonId,
                    studentId: studentId,
                    studentVocab: studentVocab,
                    lessonVocab: lessonVocab,
                    chat: chat,
                    conversationQuestions: conversationQuestions,
                    articleIds: articleIds
                };

    console.log("Sending message to server");
    easyrtc.sendServerMessage("completedLessonData", lessonData, 
                function(msgType, msgData){
                    serverACKListener(msgType, msgData)
                }, 
                function(errorCode, errorText){
                    console.log("Error was " + errorText);
                });	
}