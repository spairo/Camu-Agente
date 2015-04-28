/* Main Camu.Agente */


//Setting Global

window.ws = "http://172.18.149.21/Servicios/REST.svc/";


$(window).load(function() {
	$(".loader").fadeOut("slow");
})

/*
$(window).bind('beforeunload', function(){
	return 'Salir de la aplicacion.';
	Cookies.remove('name');
	Cookies.remove('profile');
});
*/


$(document).ready(function(){

  $(".date").text("Abril, 2015");
  //if($('#view-container').length){
    //$('#view-container').load('views/login.html');
  //}
});

//login

function login(user, password){

  var url = ws+"rg_seguridadLogin";

  var oData = { User: user, Password: password };

  //$.support.cors = true;
	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    //cache: false,
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

						  console.info(response);

							//cookies everywhere
							var id = Cookies.set('id', response[0].usuariosId);
							var name = Cookies.set('name', response[0].usuario);
							var profile = Cookies.set('profile', response[0].perfil);

							main(id, name, profile);
							seach(id);

							/*
	             for(var i = 0; i < social_feeds.length; i++){
	                var pic = social_feeds[i].img;
	                var name = social_feeds[i].txt;
	                var tipo = social_feeds[i].type;
	                var url = social_feeds[i].url;
	                var content = '<div class="messages"><div class="mini-cover"><img src="'+pic+'" style="width:35px; height=35px;"></div><div class="listened">'+name+'</div></div>';
	                $('.block_info').append(content);
	             }
							*/

	             $("#main, #search").show();
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

//main

function main(id,	name, profile){


	var myid = Cookies.get('id');
	var name = Cookies.get('name');
	var profile = Cookies.get('profile');

	$(".name").empty().text(name);
	$(".profile").empty().text(profile);
}

//Search

function seach(name, pat, mat, phone, id){

	var myid = Cookies.get('id');
	console.log(myid);

  var url = ws+"rg_ListClientes";

  var Data = { nombre1: name, nombre2: "", apellido1: pat, apellido2: mat, telefono: phone, usuarioId: myid };

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: OnSuccess,
    error: OnError
  });
}
function OnSuccess(data){

  console.log("listas", data);

	if(data != "[]"){

		DataEvals(data);

  }else{
    $(".result").text("No hay resultados");
  }
}

function OnError(data){
  alert("error", data);
}

function DataEvals(data){

	var DataT = data;

	$('#result').append(DataT);

	/*
	for(var i = 0; i < DataT.length; i++){

				var name = DataT[i].nombre1;
        var name2 = DataT[i].nombre2;
        var pat = DataT[i].apellido1;
				var mat = DataT[i].apellido2;
				var clave = DataT[i].valorClave;

        var content = ('<tr><td>'+name+'</td></tr>');

				$('#result table#list').append(content);
	}
	*/
}

/*Login*/

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

/*Logout*/

$(document).on('click', '#logout', function(){

	Cookies.remove('id');
	Cookies.remove('name');
	Cookies.remove('profile');
	location.reload();

});

/*Search*/

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

      $("#search").hide("slow", function(){
        $(".loader").fadeIn(1000, function(){
          $(".loader").fadeOut(1000, function(){

            $("#search-result").show();
            seach(name, pat, mat, phone);

          });
        });
      });
    }

  });

});

$(document).on('click', '.search-back', function(){

  $('.res').empty();
  $("#box-name").val("");
  $("#box-pat").val("");
  $("#box-mat").val("");
  $("#box-phone").val("");

  $("#search-result").hide("slow", function(){
    $(".loader").fadeIn(200, function(){
      $(".loader").fadeOut(200, function(){
        $("#search").show();
      });
    });
  });

});
