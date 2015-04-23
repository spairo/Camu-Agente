/* Main Camu.Agente */


//Setting Global

window.ws = "http://172.18.149.21/Servicios/REST.svc/";


$(document).ready(function(){

  $(".date").text("Abril, 2015");

  function formatAMPM(){

    var d = new Date(),

      minutes = d.getMinutes().toString().length == 1 ? '0'+ d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0'+ d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = ['Enero','Febrero','Marzo','April','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];

    return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
  }

  if($('#view-container').length){
    //$('#view-container').load('views/main.html');
  }

  $("#page1").click(function(){
    $('#view-container').load('views/main.html');
    alert("Thanks for visiting!");
  });

});

//login

$(document).ready(function(){

    $("#user").attr('maxlength','20');
    $("#password").attr('maxlength','20');

    $("#login").click(function(){

      var user = $('#user').val();
      var password = $('#password').val();

      if($("#user").val() == '' || $("#password").val() == ''){

        alert("Los campos son obligatorios");

      }else{

        var url = ws+"rp_seguridadLogin";

        var oData = {
          User: user,
          Password: password
        };

        $.ajax({
          type: "POST",
          url: url,
          crossDomain: true,
          data: JSON.stringify(oData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            alert(data);
          },
          error: function(data){
            console.info("Error");
          }

        });
      }

    });
});

//Search Box

$(document).ready(function(){

  $("#box-name").attr('maxlength','20');
  $("#box-pat").attr('maxlength','20');
  $("#box-mat").attr('maxlength','20');
  $("#box-phone").attr('maxlength','10');

  //phone
  $("#box-phone").keypress(function (e){
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#errmsg").html("Solo Numeros").show().fadeOut("slow");
        return false;
    }
  });

  $(".search-case").click(function(){

    if($("#box-name").val() == '' &&  $("#box-pat").val() == '' &&  $("#box-mat").val() == '' && $("#box-phone").val() == ''){
        alert("Debe tener un campo a buscar minimo");
        return false;
    }else{
        alert("do something");
    }

  });


});
