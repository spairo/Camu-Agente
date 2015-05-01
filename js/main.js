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

  $(".date").text("");
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

							//cookies everywhere
							var id = Cookies.set('id', response[0].usuariosId);
							var name = Cookies.set('name', response[0].usuario);
							var profile = Cookies.set('profile', response[0].perfil);
							var data = response[0].menu;

							main(id, name, profile);
							seach(id);
							Menu(data);

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
  var url = ws+"rg_ListClientes";

  var Data = { nombre1: name, nombre2: "", apellido1: pat, apellido2: mat, valorClave: phone, usuarioId: myid };

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
  DataEvals(data);
}

function OnError(data){
  alert("error", data);
}

function DataEvals(data){

	var search_evals = data;

	if(search_evals != ""){


		$('.result').empty().append('<table class="search_evals table table-striped"><caption>Resultado de la busqueda.</caption><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>Servicio</th><th>Build it</th></tr></thead><tbody></tbody></table>');

		for(var i = 0; i < search_evals.length; i++){

				var id = search_evals[i].clientesId;
				var name = search_evals[i].nombre1;
				var second_name = search_evals[i].nombre2;
				var pat_name = search_evals[i].apellido1;
				var mat_name = search_evals[i].apellido2;
				var service = search_evals[i].servicio;
				var clave = search_evals[i].valorClave;
				var lada = search_evals[i].lada;
				var extension = search_evals[i].extension;

				var content = '<tr><th>'+id+'</th><th>'+name+' '+second_name+'</th><th>'+pat_name+'</th><th>'+mat_name+'</th><th>'+clave+'</th><th>'+lada+'</th><th>'+extension+'</th><th>'+service+'</th><th><button class="btn btn-search build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
				$('.result table.search_evals').append(content);
		}

	}else{
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

//Build  Menu

function Menu(data){

	var data = data;

	var builddata = function(){
	    var source = [];
	    var items = [];
	    for (i = 0; i < data.length; i++) {
	        var item = data[i];
	        var label = item["menu"];
	        var parentid = item["menusSupId"];
	        var id = item["menusId"];
	        var url = item["forma"];

	        if (items[parentid]) {
	            var item = { parentid: parentid, label: label, url: url, item: item };
	            if (!items[parentid].items) {
	                items[parentid].items = [];
	            }
	            items[parentid].items[items[parentid].items.length] = item;
	            items[id] = item;
	        }
	        else {
	            items[id] = { parentid: parentid, label: label, url: url, item: item };
	            source[id] = items[id];
	        }
	    }
	    return source;
	}

	var buildUL = function(parent, items){
	    $.each(items, function(){
	        if (this.label) {
	            var li = $("<li class='js-menu'>" + "<a href='"+ this.url +"'>" + this.label + "</a></li>");
	            li.appendTo(parent);
	            if (this.items && this.items.length > 0) {
	                var ul = $("<ul class='dropdown-menu js-menu'></ul>");
	                ul.appendTo(li);
	                buildUL(ul, this.items);
	            }
	        }
	    });
	}

	var source = builddata();

	var ul = $(".json-menu");

	ul.appendTo(".json-menu");

	buildUL(ul, source);

	//add bootstrap classes

	if ($(".json-menu>li:has(ul.js-menu)")){
	  $(".json-menu>li.js-menu").addClass('dropdown-submenu');
	}
	if ($(".json-menu>li>ul.js-menu>li:has(> ul.js-menu)")){
		$(".json-menu>li>ul.js-menu li ").addClass('dropdown-submenu');
	}

	$("ul.js-menu").find("li:not(:has(> ul.js-menu))").removeClass("dropdown-submenu");

	/*******
	var data = data;

	var builddata = function(){
	    var source = [];
	    var items = [];
	    // build hierarchical source.
	    for (i = 0; i < data.length; i++) {
	        var item = data[i];
	        var label = item["menu"];
	        var parentid = item["menusSupId"];
	        var id = item["menusId"];

	        if (items[parentid]) {
	            var item = { parentid: parentid, label: label, item: item };
	            if (!items[parentid].items) {
	                items[parentid].items = [];
	            }
	            items[parentid].items[items[parentid].items.length] = item;
	            items[id] = item;
	        }
	        else {
	            items[id] = { parentid: parentid, label: label, item: item };
	            source[id] = items[id];
	        }
	    }
	    return source;
	}

	var source = builddata();

	var buildUL = function(parent, items){
	    $.each(items, function () {
	        if (this.label) {
	            // create LI element and append it to the parent element.
	            var li = $("<li>" + this.label + "</li>");
	            li.appendTo(parent);
	            // if there are sub items, call the buildUL function.
	            if (this.items && this.items.length > 0) {
	                var ul = $("<ul></ul>");
	                ul.appendTo(li);
	                buildUL(ul, this.items);
	            }
	        }
	    });
	}

	var ul = $("<ul></ul>");

	ul.appendTo("#jqxMenu");

	buildUL(ul, source);
	**********/


}

/*Login*/

$(document).on('click', '#login', function(){

  $("#login").prop( "disabled", true );

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
  $("#box-phone").attr('maxlength','20');

  //only numbers

	/*
	$("#box-phone").keypress(function (e){
     if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
        //display error message
        $(".numbers").html("Solo Numeros").show().fadeOut("slow");
        return false;
     }
  });
	*/

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

  $('.result').empty();
	$(".form-group").removeClass('has-error');
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
