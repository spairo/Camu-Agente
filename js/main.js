/*+++++++++++++++++++++++++++++++
		Fusion Project Agente
			  Atento Mexico
	 Developed By Ninja Developers
 ++++++++++++++++++++++++++++++++*/


window.ws = "http://172.18.149.21/Servicios/REST.svc/";
window.ctiurl = "http://172.18.149.21/WEB_Fusion/IGNACIO/HTMLPage.htm";
window.match = location.hash.match(/^#?(.*)$/)[1];
var path = window.location.pathname;

//Higher scope

var str;
var scope_url;

$(window).load(function(){
	$(".loader").fadeOut("slow");
});

//window.onbeforeunload = function(){
	//$.foo();
	//return "Vas a salir de la aplicacion";
	//return $.foo();
//};

$.foo = function(){
	//alert("only once")
	console.log("logout application");
};

//login

$.login = function(user, password, extension){

  var url = ws+"rg_seguridadLogin";

  var Data = { User: user, Password: password, extension: extension };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(response){

			if(response != ""){

				var logResp = response[0].Informacion;

				if(typeof logResp === 'undefined'){

					$("#user").val('');
					$("#password").val('');

					$("#logdIn").slideUp(1000, function(){
						$(".loader").fadeIn("slow", function(){
							$(".loader").fadeOut("slow", function(){

									//cookies everywhere
									var id = Cookies.set('id', response[0].usuariosId);
									var name = Cookies.set('name', response[0].usuario);
									var profile = Cookies.set('profile', response[0].perfil);
									var dataM = response[0].menu;
									var dataS = response[0].configuracion;

									Cookies.set('UserLogin', user);
									Cookies.set('hermetic', password);
									Cookies.set('extension', extension);

									$.main(id, name, profile);
									$.Menu(dataM);
									$.skills(dataS);
									$.services(dataS);

									str = dataS;

									$('.logout').html('<a href="#" id="logout"><span class="glyphicon glyphicon-log-out"></span> Log out</a>');
									$(".form-group").removeClass('has-error');
									$(".navbar-top").slideDown().show();
									$("#main").slideDown().show();

							});
						});
					});

				}else{

					if(logResp.indexOf("Error") > -1 == true){
						alert(response[0].Informacion);
						$("#logdIn #login").prop('disabled', false);
						return false;
					}

				}

			}else{
				alert("Usuario no Valido");
				$("#logdIn #login").prop('disabled', false);
				return false;
			}

		},error: function(response){
			alert("Error44: " + response.status + " " + response.statusText);
		}

  });

};

//main

$.main = function(id,	name, profile){

	var myid = Cookies.get('id');
	var name = Cookies.get('name');
	var profile = Cookies.get('profile');

	$(".name").empty().text(name);
	$(".profile").empty().text(profile);

};

//Search Get params

$.UrlDecode = function(){
	var vars = {};
       
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
			vars[key] = value;			 
	});
	return vars;
};

//Services

$.services = function(data){

	$("#services").slideDown().show();

	var services_evals = data;

	$('.box-services').append('<select class="form-control input-lg servicechoice"></select><button class="service-choice btn-block"><span class="glyphicon glyphicon-ok"></span></button>');

	for(var i = 0; i < services_evals.length; i++){

		var serviciosId = services_evals[i].serviciosId;
		var servicio = services_evals[i].servicio;

		var content = '<option class="serviceoption" name="'+serviciosId+'" value="'+serviciosId+'">'+servicio+'</option>';
		$('.box-services select.servicechoice').append(content);

	}

};

//Skills

$.skills = function(data){

	//var skills_evals = Object.keys(data).length; //IE8 sucks
	var skills_evals = data;

	$.serviceid = function(servis){

		$('.box-skills').append('<select class="form-control input-lg skillchoice"></select><button class="choice-skill btn-block btn"><span class="glyphicon glyphicon-ok"></span></button>');

		for(var i = 0; i < skills_evals.length; i++){

			if(servis == skills_evals[i].serviciosId){

				var skills = skills_evals[i].skills;

				for(var i = 0; i < skills.length; i++){

					var skillsId = skills[i].skillsId;
					var skill = skills[i].skill;

					var content = '<option class="skilloption" value="'+skillsId+'">'+skill+'</option>';
					$('#skills .box-skills select.skillchoice').append(content);

				}

			}

		}

	};

};

//Search Url Params

$.searchGet = function(){

	$("#search-result-get").slideDown();

	var CtiClientesId = $.UrlDecode()["clientesId"];
	var CtiVclave = $.UrlDecode()["vclave"];

	var myid = Cookies.get('id');
	var skillid = Cookies.get('SkillId');
	var servicioid = Cookies.get('serviciosId');


	var url = ws+"rg_MuestraCliente";

	var Data = {
		serviciosId: servicioid,
		skillId: skillid,
		clientesId: CtiClientesId,
		usuarioId: myid,
		valorClave: CtiVclave
	};

	console.log(Data);

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			console.log("resultado de search get", data);

			if(data != ""){

				console.log(data);

				if(data.length > 1){

					console.log("despliega la busqueda completa tengo mas de 1");

					$('#search-result-get .result').empty().fadeIn("slow").append('<h1>Clientes</h1><table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');


					for(var i = 0; i < data.length; i++){

							var id = data[i].clientesId;
							var clientesClaveId = data[i].clientesClaveId;
							var name = data[i].nombre1;
							var second_name = data[i].nombre2;
							var pat_name = data[i].apellido1;
							var mat_name = data[i].apellido2;
							var clave = data[i].valorClave;
							var lada = data[i].lada;
							var extension = data[i].extension;

							var content = '<tr><th class="nr">'+id+'</th><th class="Clientnames">'+name+' '+second_name+'</th><th class="Clientpat">'+pat_name+'</th><th class="Clientmat">'+mat_name+'</th><th class="Clientclave">'+clave+'</th><th class="ClientLada">'+lada+'</th><th class="Clientext">'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
							$('.result table.search_evals').append(content);

					}

				}else{

					$('#search-result-get .result').empty().slideDown("slow").append('<h1>Cliente</h1><table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');

					for(var i = 0; i < data.length; i++){

							var id = data[i].clientesId;
							var clientesClaveId = data[i].clientesClaveId;
							var name = data[i].nombre1;
							var second_name = data[i].nombre2;
							var pat_name = data[i].apellido1;
							var mat_name = data[i].apellido2;
							var clave = data[i].valorClave;
							var lada = data[i].lada;
							var extension = data[i].extension;

							var content = '<tr><th class="nr">'+id+'</th><th class="Clientnames">'+name+' '+second_name+'</th><th class="Clientpat">'+pat_name+'</th><th class="Clientmat">'+mat_name+'</th><th class="Clientclave">'+clave+'</th><th class="ClientLada">'+lada+'</th><th class="Clientext">'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
							$('.result table.search_evals').append(content);
					}
				}

			}else{
				console.log("vasio, voy a agregar boton de crear");
				$('#search-result-get').empty().slideDown("slow").append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>');
				$(".result").empty().slideDown("slow").append('<span class="not-found">No hay resultados</span>');
			}

		},error: function(data){
			//console.log("algo salio mal en search get");
		}

	});

};

//Search

$.search = function(name, pat, mat, phone){

	var url = ws+"rg_ListClientes";
	var myid = Cookies.get('id');
	var skillID = Cookies.get('SkillId');
	var serviciosID = Cookies.get('serviciosId');

  var Data = {
		nombre1: name,
		nombre2: "",
		apellido1: pat,
		apellido2: mat,
		valorClave: phone,
		usuarioId: myid,
		skillid: skillID,
		serviciosId: serviciosID
	};

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: SearchOnSuccess,
    error: SearchOnError
  });

};

function SearchOnSuccess(data){

	var search_clients = data;

	if(search_clients != ""){

			$('.result').empty().append('<table class="search_clients table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');

			for(var i = 0; i < search_clients.length; i++){

					var id = search_clients[i].clientesId;
					var clientesClaveId = search_clients[i].clientesClaveId;
					var name = search_clients[i].nombre1;
					var second_name = search_clients[i].nombre2;
					var pat_name = search_clients[i].apellido1;
					var mat_name = search_clients[i].apellido2;
					var clave = search_clients[i].valorClave;
					var lada = search_clients[i].lada;
					var extension = search_clients[i].extension;

					var content = '<tr><th class="nr">'+id+'</th><th>'+name+' '+second_name+'</th><th>'+pat_name+'</th><th>'+mat_name+'</th><th>'+clave+'</th><th>'+lada+'</th><th>'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
					$('.result table.search_clients').append(content);
			}

	}else{
		$('#search-result').empty().append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search search-back">Nueva Busqueda <span class="glyphicon glyphicon-search"></button></div><div class="btn-group btn-group-lg pull-right" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>');
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

function SearchOnError(data){
	alert("Error44: " + data.status + " " + data.statusText);
}

$.updateSession = function(skillID){

	var url = ws+"rg_ActualizaSesion";

	var myid = Cookies.get('id');
  var serviciosID = Cookies.get('serviciosId')

	var Data = {
		serviciosId: serviciosID,
		skillsId: skillID,
		usuariosId: myid,
		disponible: "0"
	}

	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			//console.info("U P D A T E session: success", data);
		},error: function(data){
			alert("Error44: " + data.status + " " + data.statusText);
		}

	});

};

$.addclient = function(name, name2, pat, mat, phone){

	var url = ws+"rg_GuardaCliente";

	var myid = Cookies.get('id');
	var skillID = Cookies.get('SkillId');
	var serviciosID = Cookies.get('serviciosId');

	var Data = {
		skillsId: skillID,
		serviciosId: serviciosID,
		nombre1: name,
		nombre2: name2,
		apellido1: pat,
		apellido2: mat,
	  valorClave: phone,
		usuariosId: myid
	}

  $.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(data){

			$("#add-client .add-result").empty().append('<h3>Cliente Creado con exito <span class="glyphicon glyphicon-ok"></span></h3>').fadeIn('slow').delay(10000);

			$('.result').empty();
			$(".form-group").removeClass('has-error');
		  $("#add-name").val("");
			$("#add-2name").val("");
		  $("#add-pat").val("");
		  $("#add-mat").val("");
		  $("#add-phone").val("");

			$("#add-client").slideUp("slow", function(){
				$("#search").slideDown("slow");
			});

		},error: function(data){

		}

  });

};

//Build  Menu

$.Menu = function(data){

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
	                var ul = $("<ul class='dropdown-submenu'></ul>");
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

	//bootstrap classes

	if ($(".json-menu>li:has(ul.js-menu)")){
	  $(".json-menu>li.js-menu").addClass('dropdown-submenu');
	}
	if ($(".json-menu>li>ul.js-menu>li:has(> ul.js-menu)")){
		$(".json-menu>li>ul.js-menu li ").addClass('dropdown-submenu');
	}

	//.removeClass
	$("ul.js-menu").find("li:not(:has(> ul.js-menu))").removeClass("dropdown-submenu");

};

/*Login*/

$(document).on('click', '#login', function(){

	$(".form-group").removeClass('has-error');
	$("#logdIn #login").prop('disabled', true);

	var user = $('#user').val();
	var password = $('#password').val();
	var extension = $("#extens").val();

	if($("#user").val() == '' || $("#password").val() == '' || $("#extens").val() == ''){

		alert("Los campos son obligatorios");
		$(".form-group").addClass('has-error');
		$("#logdIn #login").prop('disabled', false);
		return false;

	}else{
		$.login(user, password, extension);
	}

});

/*Logout*/

$(document).on('click', '#logout', function(){

	var url = ws+"rg_RegistraLogout";

	var myid = Cookies.get('id');

	var Data = { usuariosId: myid };

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			Cookies.remove('id');
			Cookies.remove('name');
			Cookies.remove('profile');
			Cookies.remove('UserLogin');
			Cookies.remove('hermetic');
			Cookies.remove('SkillId');
			Cookies.remove('serviciosId');
			Cookies.remove('clientesId');
			Cookies.remove('clientesClaveId');
			Cookies.remove('extension');
			Cookies.remove('services');
			Cookies.remove('serviceId');

			location.reload();

		},error: function(data){
			//console.log("algo salio mal");
		}

	});

});

/*Services Box*/

$(document).on('click', '#services .service-choice', function(){

	var serviciosID = $(".servicechoice").val();
	Cookies.set('serviciosId', serviciosID);

	$.serviceid(serviciosID);

	$("#services").slideUp("slow", function(){
		$("#skills").slideDown().show();
	});

});

/*Skills Box*/

$(document).on('click', '.choice-skill', function(){

	var skillID = $(".skillchoice").val();
	Cookies.set('SkillId', skillID);

	var serviciosid = Cookies.get('serviciosId');
	var iduser = Cookies.get('id');
	var extension = Cookies.get('extension');
	console.log(iduser);
	$.updateSession(skillID);

	//CtiRedirect

	for(var i = 0; i < str.length; i++){

		if(serviciosid == str[i].serviciosId){

			var skills = str[i].skills;

			for(var i = 0; i < skills.length; i++){

				if(skillID == skills[i].skillsId){

					var interfaces = skills[i].interfaces;

					if(interfaces == ""){

						$("#skills").slideUp("slow", function(){
							$("#search").slideDown().show();
						});

					}else{

						for(var i = 0; i < interfaces.length; i++){

							var url = interfaces[i].url;

							if(url == ""){

								$("#skills").slideUp("slow", function(){
									$("#search").slideDown().show();
								});

							}
							else{
								$("#skills .choice-skill").prop('disabled', true);
								$("#skills .skillchoice").prop('disabled', true);

								var CtiClientesId = $.UrlDecode()["clientesId"];
								var CtiVclave = $.UrlDecode()["vclave"];

								//window.location.href='engine.html?clientesId='+iduser+'&ext='+extension+'';
								window.location.href='engine.html?clientesId=&ext='+extension+'';
							//	window.open(''+url+'?usuariosId='+iduser+'&ext='+extension+'','_blank');
							}

						}

					}

				}

			}

		}

	}

});


/*Search*/

$(document).on('click', '.search-case', function(){

	if($("#box-name").val() == '' &&  $("#box-pat").val() == '' &&  $("#box-mat").val() == '' && $("#box-phone").val() == ''){

			alert("Debe tener un campo a buscar minimo");
			$(".box-group").addClass('has-error');
			return;

	}else if($("#box-name").val().length < 3 && $("#box-pat").val().length < 3 && $("#box-mat").val().length < 3 && $("#box-phone").val().length < 3){

		alert("Debe ser mayor a 3 caracteres");
		return;

	}else{

		var name = $("#box-name").val();
		var pat = $("#box-pat").val();
		var mat = $("#box-mat").val();
		var phone = $("#box-phone").val();

		$("#search").hide("slow").fadeOut("slow");
		$("#search-result").show().fadeIn("slow");
		$.search(name, pat, mat, phone);

	}

});

$(document).on('click', '#search-result .search-back', function(){

  $('#search-result .result').empty();
	$(".form-group").removeClass('has-error');
  $(".box-search #box-name").val("");
  $(".box-search #box-pat").val("");
  $(".box-search #box-mat").val("");
  $(".box-search #box-phone").val("");

	$("#search-result").slideUp("slow", function(){
		$("#search").slideDown("slow");
	});

});

$(document).on('click', '.add-client', function(){

	$("#add-client .add-result").empty();

	$("#search-result, #search-result-get").slideUp("slow", function(){
		$("#add-client").slideDown("slow");
	});

});

$(document).on('click', '.box-add .btn-add', function(){

	if($("#add-name").val() == '' &&  $("#box-pat").val() == '' &&   $("#box-mat").val() == '' &&  $("#box-phone").val() == ''){

			alert("Los campos son obligatorios");
			$(".add-group").addClass('has-error');
			return;

	}
	else if($("#add-name").val().length < 3 && $("#add-pat").val().length < 3 && $("#add-mat").val().length < 3 && $("#add-phone").val().length < 3){

		alert("Debe ser mayor a 3 caracteres");
		return;

	}else{

		var name = $(".box-add #add-name").val();
		var name2 = $(".box-add #add-2name").val();
		var pat = $(".box-add #add-pat").val();
		var mat = $(".box-add #add-mat").val();
		var phone = $(".box-add #add-phone").val();

		$.addclient(name, name2, pat, mat, phone);

	}

});

$(document).on('click', '.box-add .search-back', function(){

  $('#search-result .result').empty();
	$(".box-add .form-group").removeClass('has-error');
  $(".box-add #add-name").val("");
	$(".box-add #add-2name").val("");
  $(".box-add #add-pat").val("");
  $(".box-add #add-mat").val("");
  $(".box-add #add-phone").val("");

	$("#add-client").slideUp("slow", function(){
		$("#search").slideDown("slow");
	});

});

/*+++++++++++++++++++++++++++++++
		Window/Document Object Model
 ++++++++++++++++++++++++++++++++*/


$(window).load(function(){
	if(path == "/engine.html"){
		flogin();
	}
});

$(document).ready(function(){

	var name = Cookies.get('name');
	var passw = Cookies.get('hermetic');

	//var name = "master";
	//var passw = "master";

	if(path == "/" || path == "/index.html"){

		$.UrlDecode = function(){
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
					vars[key] = value;			 
			});
			return vars;
		};

		if((name == null || name == undefined) && (passw == null || passw == undefined)){


		}else{

			if($('#logdIn').is(':visible')){

				var CtiClientesId = $.UrlDecode()["clientesId"];
				var CtiVclave = $.UrlDecode()["vclave"];

				if(CtiVclave == undefined || CtiVclave == null || CtiClientesId == undefined || CtiClientesId == null){

				}else{
					$(".navbar-top").slideUp("slow");
					$("#main").slideUp("slow");
					$("#logdIn").slideUp("slow");
					$.searchGet();
				}

			}

		}

		//Extension validate
		$("#extens").keypress(function(e){
			if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
					//display error message
					$(".numbers").html("Solo Numeros").show().fadeOut("slow");
					return false;
			}
		});

	}
	if(path == "/engine.html"){

		$.UrlDecode = function(){
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
					vars[key] = value;			 
			});
			return vars;
		};


		if((name == null || name == undefined) && (passw == null || passw == undefined)){

			var CtiClientesId = $.UrlDecode()["clientesId"];
			var CtiVclave = $.UrlDecode()["vclave"];

			window.location.href='index.html?clientesId='+CtiClientesId+'&vclave='+CtiVclave+'';

		}else{

			if($('#logdIn').is(':visible')){

				var CtiClientesId = $.UrlDecode()["clientesId"];
				var CtiVclave = $.UrlDecode()["vclave"];

				if(CtiVclave == undefined || CtiVclave == null || CtiClientesId == undefined || CtiClientesId == null){

				}else{
					$(".navbar-top").slideUp("slow");
					$("#main").slideUp("slow");
					$("#logdIn").slideUp("slow");
					$.searchGet();
				}

			}

			//$.onsetEngine(name, passw);

		}

		var example = Cookies.get("extension");
		$('#BarraInterfaces #txtStation').val(example).prop('disabled', true);

	}
	if(path == "/dataset.html"){

		var CtiClientesId = $.UrlDecode()["clientesId"];
		var CtiVclave = $.UrlDecode()["vclave"];

		alert(CtiClientesId + CtiVclave);


		if((CtiClientesId != null || CtiClientesId != undefined) || (CtiVclave == null || CtiVclave == undefined)){

			window.location.href='index.html?clientesId='+CtiClientesId+'&vclave='+CtiVclave+'';

		}

	}

	if(path == "/setting.html"){

		if((name == null || name == undefined) && (passw == null || passw == undefined)){
			window.location.href='/';
		}else{
			$.onsetEngine(name, passw);
		}

	}

});

/*+++++++++++++++++++++++++++++++
		Template Builder Engine
 ++++++++++++++++++++++++++++++++*/


$(document).on('click', '.build', function(){

	var $row = $(this).closest("tr");    // Find the row

	var $text = $row.find(".nr").text();
	var $textcid = $row.find(".cd").text();

	Cookies.set('clientesId', $text);
	Cookies.set('clientesClaveId', $textcid);

	// Let's build it out

	//window.open('setting.html', '_blank');
	window.location.href ='setting.html';
	/*
	$.ajax({
		url: "index.html",
		type: "POST",
		async: false,
		success: function(){
			window.open('engine.html', '_blank');
		}
	});
	*/

});

$(document).on('click', '#logout-builder', function(){

	Cookies.remove('id');
	Cookies.remove('name');
	Cookies.remove('profile');
	Cookies.remove('hermetic');
	Cookies.remove('SkillId');
	Cookies.remove('serviciosId');
	Cookies.remove('clientesId');
	Cookies.remove('clientesClaveId');

	$(".loader").fadeIn("slow", function(){
		$('#Builder_Engine').empty();
		//location.reload();
	});

});

$(document).on('click', '#Builder_Engine .btn-engine-done', function(){

		//$(".btn-engine-done").prop( "disabled", true );

		// Get typing selected

		var treetagid = $('#Builder_Engine .trees .tags .tag').attr('id');
		var treetagtext = $('#Builder_Engine .trees .tags .tag').val();
		var treecomment = "comentario";
		//$.onsaveTyping(treetagid, treecomment);


		console.log(treetagtext);
		$.skillsTyping(treetagid);

		// Get product selected

		var producttagid = $("#Builder_Engine .product .tags .tag").attr('id');
		//alert(producttagid);

		//$.onsaveProducts(producttagid);


		//Get Inputs data Fields

		var inputarry = new Array();
		var labelarry = new Array();

		$("#box-phone").keypress(function(e){

			if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
					//display error message
					//$(".numbers").html("Solo Numeros").show().fadeOut("slow");
					return false;
			}

		});

		$('.form-dinamic .input-dinamic').each(function(){

			inputarry.push($(this).val());
			labelarry.push($(this).attr("name"));

		});

		//$.onSaveData(labelarry, inputarry);

		$.onTransfer();

});

// Render Engine

$.onsetEngine = function(user, passw){

  var url = ws+"rg_seguridadLogin";

  var Data = { User: user, Password: passw };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: onsetEngineSuccess,
    error: onsetEngineError
  });

};

function onsetEngineSuccess(data){

	var factory = data[0].configuracion;

	//console.log("300", factory);

	$(".loader").slideDown("slow", function(){

		$.cssEngine(factory);
		$.customerInfo();
		$.baselayoutEngine(factory);
		$.captureRenderEngine(factory);
		$.typificationsEngine(factory);
		$.productsEngine(factory);
		$.typiHistoryEngine(factory);
		$.vdn(factory);

		$(".loader").slideUp("slow", function(){

			$('.navbar-top .logoutEngine').html('<a href="#" id="logout-builder"><span class="glyphicon glyphicon-log-out"></span> LogOut</a>');
			//$('#foo .logoutEngine').html('<h5>Foo</h5>');

			$("#Builder_Engine .engine-config").html('<div class="col-md-4 col-md-offset-4 well-sm"><button class="btn btn-block btn-engine-done">Guardar Configuracion <span class="glyphicon glyphicon-cog"></span></button></div>');

		});

	});

}
function onsetEngineError(data){
	alert("Error44: " + data.status + " " + data.statusText);
	$(".loader").slideDown("slow");
}

// Render Engine Ends

$.cssEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";

	var skillidx = Cookies.get('SkillId');
	var serviciosidx = Cookies.get('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var cssDinamic = skills[i].cssAgente;

						$("head").append("<!-- Dinamic Css --><style>" + cssDinamic + "</style><!-- //Dinamic Css -->");

					}

				}
		}
	}

};

$.baselayoutEngine = function(data){

	//var skillidx = "1";
	//var serviciosidx = "1";

	var skillidx = Cookies.get('SkillId');
	var serviciosidx = Cookies.get('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var camposBase = skills[i].camposBase;

						if(camposBase != ""){

							$('.base_layout').append('<h3 class="text-center"><span class="glyphicon glyphicon-eye-open"></span> Datos Layout Base</h3><div class="fields"></div>');

							for(var i = 0; i < camposBase.length; i++){

								var nombreBase = camposBase[i].nombreBase;
								var title = camposBase[i].titulo;
								var name = camposBase[i].nombre;
								var typeD = camposBase[i].tipoDato;
								var form = camposBase[i].tipoCampo;
								var long = camposBase[i].longitud;
								var required = camposBase[i].requerido;
								var order = camposBase[i].orden;

								//HTML elements

								if(form == "input" || form == "Input"){

									var content = '<div class="form-group form-build"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-read" id="'+name+'" maxlength="'+long+'" placeholder=""></div>';
									$('.base_layout .fields').append(content);

									if(required == "1"){
										$(".fields .input-dinamic").addClass('required');
									}
									$(".base_layout .fields .input-read").prop('disabled', true);

								}

							}

						}else{
							$('.base_layout').append('<h3 class="text-center"><span class="glyphicon glyphicon-eye-open"></span> Datos Layout Base</h3>');
						}
					}

				}

		}

	}

};

$.captureRenderEngine = function(data){

	var skillidx = "1";
	var serviciosidx = "1";

	//var skillidx = Cookies.get('SkillId');
	//var serviciosidx = Cookies.get('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var fieldsIn = skills[i].camposCaptura;

							if(fieldsIn != ""){

								$('.advisory_capture').append('<h3 class="text-center"><span class="glyphicon glyphicon-edit"></span> Datos Captura</h3><div class="fields"></div>');

								for(var i = 0; i < fieldsIn.length; i++){

									var title = fieldsIn[i].titulo;
									var name = fieldsIn[i].nombre;
									var typeD = fieldsIn[i].tipoDato;
									var form = fieldsIn[i].tipoCampo;
									var long = fieldsIn[i].longitud;
									var defaultvalue = fieldsIn[i].valorDefault;
									var required = fieldsIn[i].requerido;
									var typ = fieldsIn[i].tipo;
									var order = fieldsIn[i].orden;

									//HTML elements

									if(form == "input" || form == "Input"){

										var content = '<div class="form-group form-dinamic"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-dinamic" id="'+name+'" name="'+title+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
										$('.advisory_capture .fields').append(content);

										if(required == "1"){
											$(".fields .input-dinamic").addClass('required');
										}

									}
									if(form == "combo" || form == "Combo"){

											var arrayselect = defaultvalue.split(',');

											var content = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label><select id="fill-select" class="form-control input-sm"></select></div>';

											$('.advisory_capture .fields').append(content);

											var options = arrayselect;

											var select = document.getElementById('fill-select');

											for(option in options){
												select.add(new Option(options[option]));
											};

									}
									if(form == "checkbox" || form == "Checkbox"){

											var arrycheckbox = defaultvalue.split(',');

											for(arry in arrycheckbox){
												var content = '<div class="checkbox"><label><input type="checkbox" value="">'+arrycheckbox[arry]+'</label></div>';
												$('.advisory_capture .fields').append(content);
											};

									}
									if(form == "radio" || form == "Radio"){

										var arryrdio = defaultvalue.split(',');

										for(arry in arryrdio){
											var content = '<div class="radio"><label><input type="radio" value="">'+arryrdio[arry]+'</label></div>';
											$('.advisory_capture .fields').append(content);
										};
										//if(required == "1"){
											//$(".fields .input-dinamic").addClass('required');
										//}
									}
									if(form == "date" || form == "Date"){
											var content = '<div class="form-group"><label for="Colonia">Fecha</label><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control input-sm" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div>';
											$('.advisory_capture .fields').append(content);
									}
									if(form == "label" || form == "Label"){
											var content = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label></div>';
											$('.advisory_capture .fields').append(content);
									}

								}

							}else{
								$('.advisory_capture').append('<h3 class="text-center"><span class="glyphicon glyphicon-edit"></span> Datos Captura</h3>');
							}

					}

				}

		 }

	}

};

$.typificationsEngine = function(data){

	var skillidx = "1";
	var serviciosidx = "1";

	//var skillidx = Cookies.get('SkillId');
	//var serviciosidx = Cookies.get('serviciosId');

	$('#Builder_Engine .tree').append('<h3 class="text-center"><span class="glyphicon glyphicon-tags"></span> Tipificaciones</h3>');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

						var data = skills[i].tipologias;

						$('#Builder_Engine .tree').jstree({ 'core':{
							"data": data
							}
						});

						$('#Builder_Engine .tree').on('changed.jstree', function(e, data){

								var i, j, r = [], id = [];
								for(i = 0, j = data.selected.length; i < j; i++){
									id.push(data.instance.get_node(data.selected[i]).id);
									r.push(data.instance.get_node(data.selected[i]).text);
								}
								$('.trees .tags').empty().append('<span class="tag" id="'+id.join(', ')+'">'+r.join(', ')+'</span>');

						}).jstree();

					}
				}

		}

	}

};

$.productsEngine = function(data){

	var skillidx = "1";
	var serviciosidx = "1";

	//var skillidx = Cookies.get('SkillId');
	//var serviciosidx = Cookies.get('serviciosId');


	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

							var data = skills[i].productos;
							$('#Builder_Engine .products').append('<h3 class="text-center"><span class="glyphicon glyphicon-tag"></span> Productos</h3>');
							$('#Builder_Engine .products').jstree({ 'core' : {
								"data": data
							}});

							$('#Builder_Engine .products').on('changed.jstree', function(e, data){
							    var i, j, r = [], id = [];
							    for(i = 0, j = data.selected.length; i < j; i++) {
										id.push(data.instance.get_node(data.selected[i]).id);
										r.push(data.instance.get_node(data.selected[i]).text);
										//console.log(data.instance.get_node(data.selected[i]).id);
										//get_node(data.selected[i]).text);
							    }
									$('.product .tags').empty().append('<span class="tag" id="'+id.join(', ')+'">'+r.join(', ')+'</span>');
							    //$('.tags').html('Selected: ' + r.join(', '));
  						}).jstree();


					}

				}

		}

	}


};


$(window).load(function(){

	$.customerInfo = function(){

		var url = ws+"rg_MuestraCliente";

		var myid = Cookies.get('id');
		var skillsId = Cookies.get('SkillId');
		var serviciosId = Cookies.get('serviciosId');
		var clientesId = Cookies.get('clientesId');
		var CtiClientesId = $.UrlDecode()["clientesId"];

		if(CtiClientesId == null || CtiClientesId == undefined){

			var Data = {
				serviciosId: serviciosId,
				skillId: skillsId,
				clientesId: clientesId,
				usuarioId: myid
			}

		}else{

			var Data = {
				serviciosId: serviciosId,
				skillId: skillsId,
				clientesId: CtiClientesId,
				usuarioId: myid
			}
		}

		$.support.cors = true;
		$.ajax({
			type: "GET",
			url: url,
			crossDomain: true,
			data: Data,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){

				var names = data[0].nombre1 + ' ' + data[0].nombre2;
				var pat = data[0].apellido1;
				var mat = data[0].apellido2;
				var Vclave = data[0].valorClave;
				var lada = data[0].lada;
				var ext = data[0].extension;


				var content = '<h3 class="text-center"><span class="glyphicon glyphicon-user"></span> Datos Generales</h3><div class="form-group"><label for="valorclave">Nomnbre</label><input type="text" class="form-control input-sm" id="names" val="'+names+'" placeholder=""></div><div class="form-group"><label for="valorclave">Apellido Paterno</label><input type="text" class="form-control input-sm" id="pat" val="'+pat+'" ></div><div class="form-group"><label for="valorclave">Apellido Materno</label><input type="text" class="form-control input-sm" id="mat" val="'+mat+'" placeholder="Apellido Materno"></div><div class="form-group"><label for="valorclave">Valor Clave</label><input type="text" class="form-control input-sm" id="vclave" val="'+Vclave+'"></div><div class="row"><div class="col-md-6"><div class="form-group"><label for="Lada">Lada</label><input type="text" class="form-control input-sm" id="lada" val="'+lada+'"></div></div><div class="col-md-6"><div class="form-group"><label for="valorclave">Extension</label><input type="text" class="form-control input-sm" id="ext" val="'+ext+'"></div></div></div>';
				$('#Builder_Engine .container-fluid .customerInfo').append(content);


				$('.customerInfo #names').val(names).prop('disabled', true);
				$('.customerInfo #pat').val(pat).prop('disabled', true);
				$('.customerInfo #mat').val(mat).prop('disabled', true);
				$('.customerInfo #vclave').val(Vclave).prop('disabled', true);
				$('.customerInfo #lada').val(lada).prop('disabled', true);
				$('.customerInfo #ext').val(ext).prop('disabled', true);


			},error: function(data){
				alert("ErrorWS: " + data.status + " " + data.statusText);
			}

		});

	};

});

$.typiHistoryEngine = function(data){

	var url = ws+"rg_ListClienteHistorico";

	var myid = Cookies.get('id');
	var skillsId = Cookies.get('SkillId');
	var serviciosId = Cookies.get('serviciosId');
	var clientesId = Cookies.get('clientesId');
	var clientesClavesId = Cookies.get('clientesClaveId');

	var oData = {
		clientesId: clientesId,
		serviciosid: serviciosId,
		usuariosId: myid,
		skillsId: skillsId
	}

	$.support.cors = true;

  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: oData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(data){

			$('.historical').empty().append('<h3 class="text-center"><span class="glyphicon glyphicon-time"></span> Historico Tipificaciones</h3><ul class="list-group"></ul>');

			for(var i = 0; i < data.length; i++){

				var clientesHistoricoId = data[i].clientesHistoricoId;
				var fechaCreacion = data[i].fechaCreacion;
				var valorClave = data[i].valorClave;
				var tipologia = data[i].tipologia;
				var comentario = data[i].comentario;
				var skill = data[i].skill;

				var content = '<li class="list-group-item">#'+clientesHistoricoId+' '+tipologia+'  ValorClave: '+valorClave+'  Comentarios: '+comentario+'</li>';

				$('.historical ul.list-group').append(content);
			}

		},error: function(data){
			alert("ErrorWS: " + data.status + " " + data.statusText);
		}

  });

};


$.vdn = function(data){

	var skillidx = Cookies.get('SkillId');
	var serviciosidx = Cookies.get('serviciosId');

	for(var i = 0; i < data.length; i++){

		if(serviciosidx == data[i].serviciosId){

			var skills = data[i].skills;

				for(var i = 0; i < skills.length; i++){

					if(skillidx == skills[i].skillsId){

							var vdntransfiere = skills[i].vdnTransfiere;
							Cookies.set('vdnTransfiere', vdntransfiere);
					}
				}
		}
	}

};

$.skillsTyping = function(node){

		var url = ws+"rg_ListSkillsTipologiasCampos";

		var myid = Cookies.get('id');

		var Data = {
			skill: "",
			tipologia: "",
			usuarioId: myid,
			skillsId: "",
			skillTipologiasId: node
		}

		$.support.cors = true;

		$.ajax({
			type: "GET",
			url: url,
			crossDomain: true,
			data: Data,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				alert("foo");
				console.log("--********--");

			},error: function(data){

				console.log("Error --********--");

			}

		});

};

/***********************
				Saving
************************/

$.onsaveCita = function(){

	//rg_CargaClientesCitas
	alert("listo para enviar");

};

$.onsaveTyping = function(id, comment){

	var url = ws+"rg_GuardaTipificacion";

	var myid = Cookies.get('id');
	var skillsId = Cookies.get('SkillId');
	var serviciosId = Cookies.get('serviciosId');
	var clientesId = Cookies.get('clientesId');
	var clientesClavesId = Cookies.get('clientesClaveId');
	var skillsTipologiasid = id;
	var comentario = comment;
	var vdnTransfirio = Cookies.get('vdnTransfiere');
	var extension = Cookies.get('extension');

	var Data = {
		 skillsId: skillsId,
		 serviciosId: serviciosId,
		 clientesId: clientesId,
		 clientesClavesId: clientesClavesId,
		 skillsTipologiasId: skillsTipologiasid,
		 comentario: comentario,
		 usuariosId: myid,
		 vdnTransfirio: vdnTransfirio,
		 extension: extension
	};

	$.support.cors = true;
	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			$.typiHistoryEngine();

		},error: function(data){
			//console.log("algo salio mal");
		}

	});

};

$.onsaveProducts = function(spid){

	var url = ws+"rg_GuardaProductos";

	var myid = Cookies.get('id');
	var skillsId = Cookies.get('SkillId');
	var serviciosId = Cookies.get('serviciosId');
	var clientesId = Cookies.get('clientesId');
	var clientesClavesId = Cookies.get('clientesClaveId');
	var skillsProductosid = spid;


	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesId: clientesId,
		clientesClavesId: clientesClavesId,
		skillsProductosId: skillsProductosid,
		usuariosId: myid
	};

	$.support.cors = true;

	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			console.log("grabaste producto", data);

		},error: function(data){
			//console.log("algo salio mal");
		}

	});


};


$.onSaveData = function(labels, inputs){

	alert("guardare datos");

	var url = ws+"rg_GuardaDatos";

	var myid = Cookies.get('id');
	var skillsId = Cookies.get('SkillId');
	var serviciosId = Cookies.get('serviciosId');
	var clientesId = Cookies.get('clientesId');
	var clientesClavesId = Cookies.get('clientesClaveId');
	var label = labels.toString();
	var input = inputs.toString();

	var Data = {
		skillsId: skillsId,
		serviciosId: serviciosId,
		clientesClaveId: clientesClavesId,
		campos: label,
		valores: input,
		usuariosId: myid
	};

	$.support.cors = true;

	$.ajax({
		type: "GET",
		url: url,
		crossDomain: true,
		data: Data,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){

			console.log("guardaste datos", data);

		},error: function(data){

			console.log("algo salio mal", data);

		}

	});

};


$.onTransfer = function(){

	var vdnTransfirio = Cookies.get('vdnTransfiere');

	setTimeout(function(){

		alert("test");
		fTransferCall(vdnTransfirio);

	}, 3000);

};
