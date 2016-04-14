// function getJSONP(url, success) {

//     var ud = '_' + +new Date,
//         script = document.createElement('script'),
//         head = document.getElementsByTagName('head')[0] 
//               || document.documentElement;

//     window[ud] = function(data) {
//         head.removeChild(script);
//         success && success(data);
//     };

//     script.src = url.replace('callback=?', 'callback=' + ud);
//     head.appendChild(script);

// }

// function getTranslation(word) {
//     getJSONP('https://glosbe.com/gapi/translate?from=eng&dest=hun&format=json&phrase=' + word + '&pretty=true', function(data){
//         console.log(data);
//     }); 
// }



var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

function getTranslation(word) {
    getJSON('https://glosbe.com/gapi/translate?from=eng&dest=hun&format=json&phrase=' + word + '&pretty=true').then(function(data) {
        alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
    
        result.innerText = data.result; //display the result in an HTML element
    }, function(status) { //error detection....
      alert('Something went wrong.');
    });
}