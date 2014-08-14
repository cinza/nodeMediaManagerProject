jQuery(function($) {
  var popupStatus = 0;
  var MediaManagerDirectoryURL = "http://localhost:3000/play/";
  var MediaManagerFileURL = "http://localhost:3000/play/:code/file/:name";
  var code = location.search.split('code=')[1]
  // array images from server
  var gallery=[];
  var images = {};
  var total_in_gallery=0;
  //position array
  var gallery_nbr=0;
  //var time Setting btn
  var isOn = false;
  var timeout= null;
  var widthScreen = $(document).width();;

  $('#settingsURL').val(MediaManagerDirectoryURL + code);

  if (code) {
    $.ajax({ 
      url: MediaManagerDirectoryURL + code,
      type: "GET", 
      contentType: "application/json",
      success: function (data) {    
        images = data;
        startSlideShow();
      },
      error: function (xhr, ajaxOptions, thrownError){   
        console.log(xhr.status +' '+ thrownError);
        console.log(xhr.responseText);
      }        
    });
  };    

  function startSlideShow(){
    for (var i = images.length - 1; i >= 0; i--) {
      gallery.push(images[i].url);
    };
    total_in_gallery = images.length - 1;
    //Load the first image of the gallery
    $("#image").load(function() {
      $(this).hide();
      $(this).fadeIn();
    }).attr('src',gallery[gallery_nbr]);
    setInterval(function () {
        displayNext();
    }, 10000); 
  };
  
  //Defines what is happening when clicking on the previous button
  $("#previous").click(displayPrevious);
  
  //Defines what is happening when clicking on the next button        
  $("#next").click(displayNext);

  $('.btnRest').click(reset);

  $('.btnPlay').click(play);
  
  function reset(){
    $('#settingsURL').val(MediaManagerDirectoryURL + code);
  };

  function play(){
    var sections = $("#settingsURL").val().split('/');
    location.href = 'play?code='+ sections[sections.length -1]; 
  };

  function loadImage(image) {
    $("#image").fadeOut('fast', function(){
      $("#image").load(function() {
        $(this).fadeIn();
      }).attr('src',image);
    });
  };
  
  function previousImage() {
    gallery_nbr--;
    if(gallery_nbr < 0)
      gallery_nbr=total_in_gallery;
  };
  
  function nextImage() {
    gallery_nbr++;
    if(gallery_nbr > total_in_gallery)
      gallery_nbr=0;
  };
  
  function displayNext(){
    nextImage();
    loadImage(gallery[gallery_nbr]);
    return false;
  };
  
  function displayPrevious(){
    previousImage();
    loadImage(gallery[gallery_nbr]);
    return false;
  };

  //show setting button if the mouse is over top right
  $('body').click(function(){
    $('a.btnSettings').fadeIn( "slow" );
    $('.sliderBtn').fadeIn('slow');
    if(timeout){
      clearTimeout(timeout);
      timeout = null;
    };
    startTimeOut();
  });

  function startTimeOut(){
    timeout = setTimeout(function() {
      console.log('incia timeout');
      $('a.btnSettings').fadeOut( "slow" );
      $('.sliderBtn').fadeOut('slow');
      $()
    }, 5000);
  };

  $('a.btnSettings').click(function(e) {
    e.stopPropagation();
    console.log(isOn);
    console.log("entro en evento");
    setTimeout(function(){ // then show popup, deley in .5 second
        loadPopup(); // function show popup
    }, 500); // .5 seconds
    return false;
   });   

  $(this).keyup(function(event) {
      if (event.which == 27) { // Esc to close pop up
          disablePopup();  // function close pop up
      }
  });

  $("div.shade").click(function() {
      disablePopup();  // function close pop up
  });  

  function loadPopup() {
      console.log('entro');
      if(popupStatus == 0) { // if value is 0, show popup
        console.log('entra en popup');
        $("#urlSettings").fadeIn(500); // fadein popup div
        $(".shade").css("opacity", "0.7"); // css opacity
        $(".shade").fadeIn(100);
          popupStatus = 1; // and set value to 1
        if(timeout){
          clearTimeout(timeout);
          timeout = null;  
        };
        
        isOn = true;
      }
  };

  function disablePopup() {
      if(popupStatus == 1) { // if value is 1, close popup
        $("#urlSettings").fadeOut("normal");
        $(".shade").fadeOut("normal");
        popupStatus = 0;  // and set value to 0
        if(!timeout){
          startTimeOut();
        };
        isOn = false;
      };
  };

});