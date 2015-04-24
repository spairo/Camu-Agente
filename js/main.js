/* Main Camu.Agente */


//Setting Global

window.ws = "http://172.18.149.21/Servicios/REST.svc/";


$(window).load(function() {
	$(".loader").fadeOut("slow");
})

//$(document).ready(function(){
$(window).load(function() {

  $(".date").text("Abril, 2015");

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

  var url = ws+"rg_seguridadLogin";

  var oData = { User: user, Password: password };

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: oData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: OnSuccessCall_WS,
    error: OnErrorCall_WS
  });

  function OnSuccessCall_WS(response){

     if(response != ""){

       $("#user").val('');
       $("#password").val('');

       $("#logdIn").hide("slow", function(){
         $(".loader").fadeIn("slow", function(){
           $(".loader").fadeOut("slow", function(){

             $("#main").show();
             $(".form-group").removeClass('has-error');

           });
         });
       });

     }else{
       alert("Usuario no Valido");
       return false;
     }
  }
  function OnErrorCall_WS(response){
    alert("Error: " + response.status + " " + response.statusText);
  }

}

//Search

function seach(name, pat, mat, phone){

  //alert(name + pat + mat + phone);

  //rg_ListClientes(String nombre1, String nombre2, String apellido1, String apellido2, String telefono)

  var url = ws+"rg_ListClientes";

  var Data = { nombre1: name, nombre2: "", apellido1: pat, apellido2: mat, telefono: phone }

  //var Data = { User: user, Password: password };

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: OnSuccessCall_WS,
    error: OnErrorCall_WS
  });

  function OnSuccessCall_WS(data){
    alert(data);
    console.log(data);
  }
  function OnErrorCall_WS(data){
    alert("error", data);
  }

}



$(document).on('click', '#login', function(){

  //$("#login").prop( "disabled", true );

  var user = $('#user').val();
  var password = $('#password').val();

  if($("#user").val() == '' || $("#password").val() == ''){
      alert("Los campos son obligatorios");
      $(".form-group").addClass('has-error');
      return false;
  }else{
      login(user, password);
  }

});


$(document).ready(function(){

  $("#box-name").attr('maxlength','20');
  $("#box-pat").attr('maxlength','20');
  $("#box-mat").attr('maxlength','20');
  $("#box-phone").attr('maxlength','10');

  //phone
  $("#box-phone").keypress(function (e){
     if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
        //display error message
        $(".numbers").html("Solo Numeros").show().fadeOut("slow");
        return false;
     }
  });

  $(".search-case").click(function(){

    if($("#box-name").val() == '' &&  $("#box-pat").val() == '' &&  $("#box-mat").val() == '' && $("#box-phone").val() == ''){
        alert("Debe tener un campo a buscar minimo");
        $(".box-group").addClass('has-error');
        return false;
    }else{

      var name = $("#box-name").val();
      var pat = $("#box-pat").val();
      var mat = $("#box-mat").val();
      var phone = $("#box-phone").val();

      seach(name, pat, mat, phone);

    }

  });


});
