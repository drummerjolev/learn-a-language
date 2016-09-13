// Utils functions for use in all scripts

// based on this great article:
// https://bost.ocks.org/mike/shuffle/
function shuffleArray(array) {
  var currentIndex = array.length;
  var j;
  var k;

  while (currentIndex > 0) {
    j = Math.floor(Math.random() * currentIndex--);
    k = array[currentIndex];
    array[currentIndex] = array[j];
    array[j] = k;
  }
  return array;
}

function arrayContains(array,obj) {
  var i = array.length - 1;
  while (i >= 0) {
    if (array[i] === obj) {
      return true;
    }
    i--;
  }
  return false;
}

function flashHtmlElement(backgroundElement) {
    var flasher = $(backgroundElement);
    flasher.fadeIn(50, function() {
        flasher.fadeOut(300, function() {
        });
    });
}

function extractUrlParameter(url,parameter) {
  var parameterString = url.split('?');

  if (parameterString.length == 2) {
    parameterString = parameterString[1];
    var parameterListFromString = parameterString.split('&');

    if (parameterListFromString.length) {
      for (var i = 0; i < parameterListFromString.length; i++) {
        var currentParameter = parameterListFromString[i].split('=');
        
        if (currentParameter.length == 2) {
          if (currentParameter[0].toLowerCase() === parameter.toLowerCase()) {
            return currentParameter[1];
          }
        }
      }
    }
  }
  return null;
}

function removeUrlParameters(url) {
  var parameterString = url.split('?');
  if (parameterString.length == 2) {
    return parameterString[0];
  } 
  return null;
}