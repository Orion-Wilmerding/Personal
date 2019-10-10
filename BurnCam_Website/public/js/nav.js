// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {

  $("#navBrand").addClass('small');

  if ($(document).scrollTop() > 50) {
    $('nav').addClass('shrink');
    $('#navBrand').addClass('small')
  } 
  
  else {
    $('nav').removeClass('shrink');
    $('#navBrand').removeClass('small')
  } 
}
