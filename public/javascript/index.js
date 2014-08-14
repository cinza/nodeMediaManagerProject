jQuery(function($) {
	var popupStatus = 0;
  var monitorId = 0; 
  var playlistId= 0;
  var isOn = false;
  
  // Form validaton with html5
  $('.formValidation input[type=text]').on('change invalid', function() {
    var textfield = $(this).get(0);
    textfield.setCustomValidity('');
    
    if (!textfield.validity.valid) {
      textfield.setCustomValidity('Campo obligatorio, por favor completar');  
    }
  });

  //datepicker jquery ui
  $(".datepicker" ).datepicker({ dateFormat: "dd-mm-yy" });
	
  //tooltip jquery ui
  $(document).tooltip();
  
  $('#infoNav').tooltip({
    items:"[title]",
    content: "Para buscar más efectivamente, siga las siguientes instrucciones: <br/> <br/>Buscar Monitor: Simplemente escriba texto y por defecto se buscará entre la lista de monitores, puede agregar la palabra  ´monitor` opcionalmente. <br/><br/> Buscar Playlists: Ingrese la palabra ´playlist` seguido del texto que desea buscar. <br/><br/> Buscar Estados: Puede especificar los siguientes estados:<br/></br> -Encendido, Activo, On <br/> -Apagado, Inactivo, Off <br/>  -Actualizado, Updated <br/>  -Actualizando, Updating  <br/><br/> Puede unir instrucciones utilizando la´.` <br/> Ejemplo: -´Monitor Taco Bell, playlist menú`. -´Monitor Taco Bell, playlist combo,off`.                   - ´Playlist menú,updating`."
  });
  
  // menu options manager
  $('.box p.monitor').click(function() {
    var $this = $(this); 
    console.log(isOn);
    if(isOn === true){
      if(($this.hasClass('selected')) && ($this.hasClass('done'))){
        console.log('entro');
        $this.removeClass('selected');
        $this.removeClass('done');
        isOn = false;
      }else{
          $('.box p.monitor.selected.done').removeClass('selected');
          $('.box p.monitor.done').removeClass('done');
          $this.addClass('selected');
          $this.addClass('done');
          console.log('quita');
          isOn = true;
      };
    }else{
        $this.addClass('selected');
        $this.addClass('done');
        isOn = true;
    };
    monitorId = $this.children('a').attr('id');     
    $('#selectedMonitor').val(monitorId);
    $('#selectedMoId').val(monitorId);
  });

  $('.col ul.playlist li').click(function() {
    var $this = $(this); 
    console.log(isOn);
    if(isOn === true){
      if(($this.hasClass('selected')) && ($this.hasClass('done'))){
        console.log('entro');
        $this.removeClass('selected');
        $this.removeClass('done');
        isOn = false;
      }else{
          $('.col ul.playlist li.selected.done').removeClass('selected');
          $('.col ul.playlist li.done').removeClass('done');
          $this.addClass('selected');
          $this.addClass('done');
          console.log('quita');
          isOn = true;
      };
    }else{
        $this.addClass('selected');
        $this.addClass('done');
        isOn = true;
    };
    playlistId = $this.children('a').attr('id');
    $('#selectedPlaylist').val(playlistId);
  });
  // EDIT section
  $('section.editScreen a.less').click(function() {
    $.ajax({ 
        url: '/monitor/' + monitorId + '/disable',
        type: "POST", 
        contentType: "application/json",
        success: function (status) {    
          console.log(status + ": estado monitor");
          if(status=='a'){
            $(this).removeClass('disable');
            $('.box p.monitor.selected a').removeClass('inactive');
            $('.box p.monitor.selected').removeClass('selected');
            
          }else {
            $(this).addClass('disable');
            if($('.box p.monitor').hasClass('selected')){
              $('.box p.monitor.selected a').addClass('inactive');
              $('.box p.monitor.selected').removeClass('selected');
            } else {
              alert('Seleccione Monitor a desactivar');
            }; 
          };
        },
        error: function (xhr, ajaxOptions, thrownError){   
          console.log(xhr.status +' '+ thrownError);
          console.log(xhr.responseText);
        }        
      });
    
    return false;    
  });

  $('section.editPlaylist a.less').click(function() {
    $.ajax({ 
        url: '/playlist/' + playlistId + '/disable',
        type: "POST", 
        contentType: "application/json",
        success: function (statusPlay) {    
          console.log(statusPlay + ": estado playlist");
          if(statusPlay=='a'){
            $(this).removeClass('disable');
            $('.col ul.playlist li.selected a').removeClass('inactive');
            $('.col ul.playlist li').removeClass('selected');
          }else {
            $(this).addClass('disable');
            if($('.col ul.playlist li').hasClass('selected')){
              $('.col ul.playlist li.selected a').addClass('inactive');
              $('.col ul.playlist li').removeClass('selected');
            } else {
              alert('Seleccione Playlist a desactivar');
            }; 
          };
        },
        error: function (xhr, ajaxOptions, thrownError){   
          console.log(xhr.status +' '+ thrownError);
          console.log(xhr.responseText);
        }        
      });
    return false;    
  });  
	
  // add monitor and playlist
  $('a.add').click(function() {
		if ($(this).hasClass('monitor')){
			$('section.popUp .monitor').removeClass('hideThis');
			$('section.popUp .playlist').addClass('hideThis');
      $('#monitorStatus').val('add');
          setTimeout(function(){ // then show popup, deley in .5 second
              loadPopup(); // function show popup
          }, 500); // .5 seconds
		}
		else {
			$('section.popUp .monitor').addClass('hideThis');
        if($('.box p.monitor').hasClass('selected')){
          $('section.popUp .playlist').removeClass('hideThis');
          $('#playlistStatus').val('add');
          setTimeout(function(){ // then show popup, deley in .5 second
              loadPopup(); // function show popup
          }, 500); // .5 seconds
          
        }
        else {
          alert('Seleccione el monitor al que desea agregar un playlist');
        };
		};

		return false;
	 });	 
  
  //edit monitor and playlist
  $('a.edit').click(function() {
    if ($(this).hasClass('monitor')){
      $.ajax({ 
        url: '/monitor/' + monitorId,
        type: "GET", 
        contentType: "application/json",
        success: function (monitor) {    
          console.log(monitor);
          $('input[name="monitor[id]"]').val(monitor.id);
          $('input[name="monitor[name]"]').val(monitor.name);
          $('textarea[name="monitor[description]"]').val(monitor.description);
          $('select[name="monitor[idmodel]"]').val(monitor.idmodel);
          $( 'h6' ).text('Editar Monitor');
          $('section.popUp .monitor').removeClass('hideThis');
          $('section.popUp .playlist').addClass('hideThis');
          $('#monitorStatus').val('edit');
          setTimeout(function(){ // then show popup, deley in .5 second
              loadPopup(); // function show popup
          }, 500); // .5 seconds
        },
        error: function (xhr, ajaxOptions, thrownError){   
          console.log(xhr.status +' '+ thrownError);
          console.log(xhr.responseText);
        }        
      });
    }
    else {
      $.ajax({ 
        url: '/playlist/' + playlistId,
        type: "GET", 
        contentType: "application/json",
        success: function (data) {    
          var playlist = data.playlist;
          var FTPURL = data.FTPURL;
          $('input[name="playlist[id]"]').val(playlist.id);
          $('input[name="playlist[name]"]').val(playlist.name);
          $('input[name="playlist[idmonitor]"]').val(playlist.idmonitor);
          $('input[name="playlist[iddirectory]"]').val(playlist.iddirectory);
          $('textarea[name="playlist[description]"]').val(playlist.description);
          $('input[name="directory[url]"]').val(FTPURL + playlist.directory.url); 
          $('input[name="playlist[url]"]').val(data.FTPServerURL); 
          $('input[name="playlist[startdate]"]').val(playlist.startdate); 
          $('input[name="playlist[finishdate]"]').val(playlist.finishdate); //+ playlist.directory.url);
          $('section.popUp .monitor').addClass('hideThis');
          $( 'h6' ).text('Editar Playlist');     
          $('section.popUp .playlist').removeClass('hideThis');
          $('#playlistStatus').val('edit');
          setTimeout(function(){ // then show popup, deley in .5 second
              loadPopup(); // function show popup
          }, 500); // .5 seconds
        },
        error: function (xhr, ajaxOptions, thrownError){   
          console.log(xhr.status +' '+ thrownError);
          console.log(xhr.responseText);
        }        
      });
    };
    return false;

  });
  
  $('a.delete').click(function(){
    $this = $('.box .col ul.playlist li.selected');
    console.log(playlistId +' Id a eliminar');
    $.ajax({ 
        url: '/playlist/' + playlistId,
        type: "DELETE", 
        contentType: "application/json",
        success: function (deleted) {   
          $this.remove();
          console.log('eliminar');
        },
        error: function (xhr, ajaxOptions, thrownError){   
          console.log(xhr.status +' '+ thrownError);
          console.log(xhr.responseText);
        }        
      });
    return false;
  });
  
  //Functionalitu pop Up
  //close pop up
  $(this).keyup(function(event) {
      if (event.which == 27) { // Esc to close pop up
          disablePopup();  // function close pop up
      }
  });

  $("div.shade").click(function() {
      disablePopup();  // function close pop up
  });	 

  function loadPopup() {
      if(popupStatus == 0) { // if value is 0, show popup
        $(".popUp").fadeIn(0500); // fadein popup div
        $(".shade").css("opacity", "0.7"); // css opacity
        $(".shade").fadeIn(0001);
          popupStatus = 1; // and set value to 1
      }
  }

  function disablePopup() {
      if(popupStatus == 1) { // if value is 1, close popup
          $(".popUp").fadeOut("normal");
          $(".shade").fadeOut("normal");
          popupStatus = 0;  // and set value to 0
          document.getElementById("monitorForm").reset();
          document.getElementById("playlistForm").reset();
      }
    }
});
