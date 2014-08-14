jQuery(function($) {
  var MediaManagerDirectoryURL = "http://localhost:3000/play/"; 
  $("#url").val(MediaManagerDirectoryURL);
  $('#btnUrl').click(function(e) {
    e.preventDefault();    
    var sections = $("#url").val().split('/');
    location.href = 'play?code='+ sections[sections.length -1];    
    return false;
  });  
});
