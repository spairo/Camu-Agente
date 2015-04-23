/* Main Camu.Agente */


//Setting Global

jQuery.support.cors = true;
window.ws = "http://172.18.149.21/Servicios/REST.svc/";


//$(document).ready(function(){
$(window).load(function() {

  //$(".date").text("Abril, 2015");

  //if($('#view-container').length){
    //$('#view-container').load('views/login.html');
  //}

  /*
  $("#page1").click(function(){
    $('#view-container').load('views/main.html');
    alert("Thanks for visiting!");
  });
  */

});

//login

function login(user, password){

  var url = ws+"rp_seguridadLogin";

  var oData = { User: user, Password: password };

  $.ajax({
    type: "POST",
    url: url,
    crossDomain: true,
    data: JSON.stringify(oData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: OnSuccessCall_WS,
    error: OnErrorCall_WS
  });

  function OnSuccessCall_WS(response) {
     alert(response);
     $("#logdIn").fadeOut().hide();//.css("display","none");
     $("#main").fadeIn().show();
  }
  function OnErrorCall_WS(response) {
    alert("Error: " + response.status + " " + response.statusText);
  }

}


$(document).ready(function(){

    $("#user").attr('maxlength','20');
    $("#password").attr('maxlength','20');

    $("#login").click(function(){

      $("#login").prop( "disabled", true );

      var user = $('#user').val();
      var password = $('#password').val();

      if($("#user").val() == '' || $("#password").val() == ''){
        alert("Los campos son obligatorios");
      }else{

        login(user, password);
        document.getElementById("user").reset();
        document.getElementById("password").reset();


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
