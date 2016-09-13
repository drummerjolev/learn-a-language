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