/*============================
      Main Fusion Agente
=============================*/

//Settings

window.ws = "http://172.18.149.21/Servicios/REST.svc/";
var path = window.location.pathname;

//Higher scope

var str_;

$(window).load(function(){
	$(".loader").fadeOut("slow");
})

/*
$(window).bind('beforeunload', function(){
	return 'Salir de la aplicacion.';
	Cookies.remove('name');
	Cookies.remove('profile');
});
*/

//login

$.login = function(user, password){

  var url = ws+"rg_seguridadLogin";

  var oData = { User: user, Password: password };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    data: oData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: LoginOnSuccess,
    error: LoginOnError
  });

};

function LoginOnSuccess(response){

	if(response != ""){

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
						var dataServices = response[0].configuracion;

						Cookies.set('parole', password);

						$.main(id, name, profile);
						$.Menu(dataM);
						$.skills(dataS);
						$.services(dataS);

						$('.logout').html('<a href="#" id="logout"><span class="glyphicon glyphicon-log-out"></span> Log out</a>');
						$(".form-group").removeClass('has-error');
						$("#main").slideDown().show();

				});
			});
		});

	}else{

			alert("Usuario no Valido");
			return false;

	}
}
function LoginOnError(response){
	alert("Error44: " + response.status + " " + response.statusText);
}

//main

$.main = function(id,	name, profile){

	var myid = Cookies.get('id');
	var name = Cookies.get('name');
	var profile = Cookies.get('profile');

	$(".name").empty().text(name);
	$(".profile").empty().text(profile);

};

//Search URL params

$.UrlDecode = function(){
	var vars = {};
       
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
			vars[key] = value;			 
	});
	return vars;
};

//Service

$.services = function(data){

	var services_evals = data;

	if(services_evals.length > 1){

		//$("#services").slideDown().show();

	}else{
		//$("#services").hide();
		//$("#skills").slideDown().show();
	}

};

//Skills

$.skills = function(data){


	var CtiVclave = $.UrlDecode()["vclave"];
	var CtiClientesId = $.UrlDecode()["clientesId"];

	console.log(CtiVclave);

	var skills_evals = data;
	//var skills_evals = Object.keys(data).length; //IE8 sucks

	if(skills_evals.length > 1){

		$("#skills").slideDown().show();
		$('.box-skills').append('<select class="form-control input-lg skillchoice"></select><button class="choice-skill btn-block"><span class="glyphicon glyphicon-ok"></span></button>');

		for(var i = 0; i < skills_evals.length; i++){
			var skill = skills_evals[i].skill;
			var skillsId = skills_evals[i].skillsId;
			var serviciosId = skills_evals[i].serviciosId;

			var content = '<option class="skilloption" value="'+skillsId+'" alt="'+serviciosId+'" name="'+skill+'">'+skill+'</option>';
			$('.box-skills select.skillchoice').append(content);
		}

	}else{

		$("#skills").hide();
		$("#search").slideDown().show();

	}

};

//Search

$.search = function(name, pat, mat, phone){

	var CtiClientesId = $.UrlDecode()["clientesId"];

	var url = ws+"rg_ListClientes";
	var myid = Cookies.get('id');
	var skillID = Cookies.get('SkillId');
	var serviciosID = Cookies.get('serviciosId');

	if(CtiClientesId)

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

	var search_evals = data;

	if(search_evals != ""){

			$('.result').empty().append('<table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>ClaveId</th><th></th></tr></thead><tbody></tbody></table>');

			for(var i = 0; i < search_evals.length; i++){

					var id = search_evals[i].clientesId;
					var clientesClaveId = search_evals[i].clientesClaveId;
					var name = search_evals[i].nombre1;
					var second_name = search_evals[i].nombre2;
					var pat_name = search_evals[i].apellido1;
					var mat_name = search_evals[i].apellido2;
					var clave = search_evals[i].valorClave;
					var lada = search_evals[i].lada;
					var extension = search_evals[i].extension;

					var content = '<tr><th class="nr">'+id+'</th><th class="Clientnames">'+name+' '+second_name+'</th><th class="Clientpat">'+pat_name+'</th><th class="Clientmat">'+mat_name+'</th><th class="Clientclave">'+clave+'</th><th class="ClientLada">'+lada+'</th><th class="Clientext">'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
					$('.result table.search_evals').append(content);

			}

	}else{

		$('#search-result').empty().append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search search-back">Nueva Busqueda <span class="glyphicon glyphicon-search"></button></div><div class="btn-group btn-group-lg pull-right" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>')
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

function SearchOnError(data){
  //alert("Perro", data);
}

$.updateSession = function(serviciosID, skillID){

	var url = ws+"rg_ActualizaSesion";

	var myid = Cookies.get('id');

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

			console.info("U P D A T E session: success", data);

		},error: function(data){
			console.log("U P D A T E session: unsuccess");
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
    success: addOnSuccess,
    error: addOnError
  });

};

function addOnSuccess(data){

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

	//$("p").hide("slow", function(){
		//	alert("The paragraph is now hidden");
	//});

	//$("#add-client").hide("slow").fadeOut("slow");
	//$("#search").show().fadeIn("slow");
}

function addOnError(data){

}

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

	//business logic...

  var user = $('#user').val();
  var password = $('#password').val();

  if($("#user").val() == '' || $("#password").val() == ''){

			alert("Los campos son obligatorios");
      $(".form-group").addClass('has-error');
			//$("#login").prop( "disabled", false );

      return false;

  }else{
		$.login(user, password);
  }

});

/*Logout*/

$(document).on('click', '#logout', function(){

	Cookies.remove('id');
	Cookies.remove('name');
	Cookies.remove('profile');
	Cookies.remove('parole');
	Cookies.remove('SkillId');
	Cookies.remove('serviciosId');
	Cookies.remove('clientesId');
	Cookies.remove('clientesClaveId');

	location.reload();

});

/*Services Box*/

$(document).on('click', '.choice-service', function(){

	//var skillID = $(".skillchoice").val();
	//var skillstd = $(".skillchoice option:selected").attr('name');

	//Cookies.set('SkillId', skillID);

	//$("#skills").slideUp("slow", function(){
		//$("#search").slideDown("slow").show();
	//});

});

/*Skills Box*/

$(document).on('click', '.choice-skill', function(){

	var skillID = $(".skillchoice").val();

	Cookies.set('SkillId', skillID);

	var serviciosID = $(".skilloption").attr("alt");

	Cookies.set('serviciosId', serviciosID);

	$.updateSession(serviciosID, skillID);

	$("#skills").slideUp("slow", function(){
		$("#search").slideDown("slow").show();
	});

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

	/*

	//only numbers input

	$("#box-phone").keypress(function (e){
     if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
        //display error message
        $(".numbers").html("Solo Numeros").show().fadeOut("slow");
        return false;
     }
  });
	*/

$(document).on('click', '.add-client', function(){

	$("#add-client .add-result").empty();

	$("#search-result").slideUp("slow", function(){
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
		Template Builder Engine
 ++++++++++++++++++++++++++++++++*/


$(document).on('click', '.build', function(){

	var $row = $(this).closest("tr");    // Find the row

	var $text = $row.find(".nr").text();
	var $textnames = $row.find(".Clientnames").text();
	var $textpat = $row.find(".Clientpat").text();
	var $textmat = $row.find(".Clientmat").text();
	var $textclave = $row.find(".Clientclave").text();
	var $textlada = $row.find(".ClientLada").text();
	var $textext = $row.find(".Clientext").text();
	var $textcid = $row.find(".cd").text();

	Cookies.set('clientesId', $text);
	Cookies.set('clientesNames', $textnames);
	Cookies.set('clientesPat', $textpat);
	Cookies.set('clientesMat', $textmat);
	Cookies.set('clientesClave', $textclave);
	Cookies.set('clientesLada', $textlada);
	Cookies.set('clientesExt', $textext);
	Cookies.set('clientesClaveId', $textcid);

	// Let's build it out

	$.ajax({
		url: "index.html",
		type: "POST",
		async: false,
		success: function(){
			window.open('engine.html', '_blank');
		}
	});

});

$(document).ready(function(){

	if(path == "/engine.html"){

		//Catch all params url

		$.UrlDecode = function(){
			var vars = {};
		       
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value){
					vars[key] = value;			 
			});
			return vars;
		};

		//var name = Cookies.get('name');
	  //var passw = Cookies.get('parole');
		var name = "master";
		var passw = "master";

		console.log("cookie name", name);
		console.log("cooke passw", passw);

		if((name == "" || name == undefined) && (passw == "" || passw == undefined)){

			var CtiClientesId = $.UrlDecode()["clientesId"];
			window.location.href='index.html?clientesId='+CtiClientesId+'';

			console.log("URL F L O W");

		}else{

			console.log("C O O K I E F L O W");
			$.onsetEngine(name, passw);

		}

	}

});

$(document).on('click', '#logout-builder', function(){

	Cookies.remove('id');
	Cookies.remove('name');
	Cookies.remove('profile');
	Cookies.remove('parole');
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

		/*
		var treetagid = $('.tree .tag').attr('title');
		var treecomment = $('.tree .comment').val();

		$.onsaveTyping(treetagid, treecomment);
		*/

		// Get product selected

		/*
		var producttag = $('.products .tag').text();
		var producttagid = $('.products .tag').attr('title');

		$.onsaveProducts(producttagid);
		*/

		//Get Inputs data Fields
		/*
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

		$.onSaveData(labelarry, inputarry);
		*/
});

$(document).on('click', '.list-product .list-group-item', function(){

	var skillsProductosId = this.id;
	var product = $(this).attr('title');

	var content = '<a href="#" title="'+skillsProductosId+'" class="tag">'+product+'</a>';
	$('.products .tags').empty().append(content);

});

$(document).on('click', '.list-group .list-typing', function(){

	var typingId = this.id;
	var tipologia = $(this).text();

	var content = '<a href="#" title="'+typingId+'" class="tag">'+tipologia+'</a>';
	$('.tree .tags').empty().append(content);

});

$(document).on('click', '.schedule_appointments .choice-meeting', function(){

		var select = $(".Ctc option:selected").val();

		console.log(select);

});

$.onsetEngine = function(user, passw){

  var url = ws+"rg_seguridadLogin";

  var Data = { User: user, Password: passw };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    //cache: false,
    crossDomain: true,
    data: Data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: onsetEngineSuccess,
    error: onsetEngineError
  });

};

function onsetEngineSuccess(data){

	console.log("eraclito", data);

	var factory = data[0].configuracion;

	//$('.navbar-top').addClass('navbar-top-fixed'); //position fixed header

	$(".loader").slideDown("slow", function(){

		$.cssEngine(factory);
		$.baselayoutEngine(factory);
		$.captureRenderEngine(factory);
		$.typificationsEngine(factory);
		$.productsEngine(factory);
		$.typiHistoryEngine(factory);
		$.loadCustomersDefault(factory);
		$.loadCustomersQuotes(factory);

		$(".loader").slideUp("slow", function(){

			$('#Builder_Engine .logout').html('<a href="#" id="logout-builder"><span class="glyphicon glyphicon-log-out"></span> LogOut</a>');

			$('#Builder_Engine .schedule_appointments').html('<div class="form-group"><label for="">Seleccione Tipo de Cita</label><select class="form-control input-sm Ctc"><option value="1">Cita Llamada</option><option value="2">Cita Presencial</option></select><br /><button class="btn choice-meeting">Seleccionar</button></div>');

			$("#Builder_Engine .engine-config").html('<div class="col-md-4 col-md-offset-4 well-sm"><button class="btn btn-block btn-engine-done">Guardar Configuracion <span class="glyphicon glyphicon-cog"></span></button></div>');

		});

	});

}

function onsetEngineError(data){
	alert("Error44: " + data.status + " " + data.statusText);
	$(".loader").slideDown("slow");
}

$.cssEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var cssDinamic = data[i].cssAgente;
			$("head").append("<!-- Dinamic Css --><style>" + cssDinamic + "</style><!-- //Dinamic Css -->");

		}

	}

};

$.baselayoutEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var Fields = data[i].camposBase;

				if(Fields != ""){

					$('.base_layout').append('<h3 class="text-center"><span class="glyphicon glyphicon-eye-open"></span> Campos Layout Base</h3><div class="fields"></div>');

					for(var i = 0; i < Fields.length; i++){

						var nombreBase = Fields[i].nombreBase;
						var title = Fields[i].titulo;
						var name = Fields[i].nombre;
						var typeD = Fields[i].tipoDato;
						var form = Fields[i].tipoCampo;
						var long = Fields[i].longitud;
						var required = Fields[i].requerido;
						var order = Fields[i].orden;

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
					//$('.base_layout').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Layout Base.</div>');
				}
		}

	}

};

$.captureRenderEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	$('.advisory_capture').append('<h3 class="text-center"><span class="glyphicon glyphicon-edit"></span> Campos Captura Asesor</h3><div class="fields"></div>');

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var fieldsIn = data[i].camposCaptura;

				if(fieldsIn != ""){

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

						if(form == "combo" || form == "Combo"){

								var array = defaultvalue.split(',');

								var content = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label><select id="fill-select" class="form-control input-sm"></select></div>';

								$('.advisory_capture .fields').append(content);

								var options = array;

								var select = document.getElementById('fill-select');

								for(option in options){
									select.add(new Option(options[option]));
								};

						}
						if(form == "checkbox" || form == "Checkbox"){

								console.log(defaultvalue);

								var array = defaultvalue.split(',');

								console.log("array checkbox", array);


						}
						if(form == "input" || form == "Input"){

							var content = '<div class="form-group form-dinamic"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-sm input-dinamic" id="'+name+'" name="'+title+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
							$('.advisory_capture .fields').append(content);

							if(required == "1"){
								$(".fields .input-dinamic").addClass('required');
							}

						}
						if(form == "radio" || form == "Radio"){

							var content = '<div class="form-group form-dinamic"><label class="control-label">'+title+'</label><div class="radio"><label><input type="'+form+'" class="input-dinamic" name="'+name+'" id="" value="" checked>'+title+'</label></div></div>';

							$('.advisory_capture .fields').append(content);

							if(required == "1"){
								$(".fields .input-dinamic").addClass('required');
							}

						}
						if(form == "label" || form == "Label"){

								var content = '<div class="form-group form-dinamic"><label class="control-label">'+name+'</label></div>';

								$('.advisory_capture .fields').append(content);

						}


					}

				}else{
					//$('.advisory_capture').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Captura Asesor.</div>');
				}

		}

	}

};

$.typificationsEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	$('#Builder_Engine .tree').append('<h3 class="text-center"><span class="glyphicon glyphicon-tags"></span> Tipificaciones</h3>');

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var data = data[i].tipologias;

			$('#Builder_Engine .tree').jstree({ 'core' : {
				data
			}});

		}

	}

};

$.productsEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var data = data[i].productos;
			$('#Builder_Engine .products').append('<h3 class="text-center"><span class="glyphicon glyphicon-tag"></span> Productos</h3>');
			$('#Builder_Engine .products').jstree({ 'core' : {
				data
			}});

		}

	}

};

$(window).load(function(){

	$.loadCustomersDefault = function(data){

		var url = ws+"rg_MuestraCliente";

		var myid = Cookies.get('id');
		var skillsId = Cookies.get('SkillId');
		var serviciosId = Cookies.get('serviciosId');
		var clientesId = Cookies.get('clientesId');

		var Data = {
			serviciosId: serviciosId,
			skillId: skillsId,
			clientesId: clientesId,
			usuarioId: myid
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

				var content = '<h3 class="text-center"><span class="glyphicon glyphicon-book"></span> Clientes Citas</h3><div class="form-group"><label for="valorclave">Nomnbre</label><input type="text" class="form-control input-sm" id="names" val="'+names+'" placeholder=""></div><div class="form-group"><label for="valorclave">Apellido Paterno</label><input type="text" class="form-control input-sm" id="pat" val="'+pat+'" ></div><div class="form-group"><label for="valorclave">Apellido Materno</label><input type="text" class="form-control input-sm" id="mat" val="'+mat+'" placeholder="Apellido Materno"></div><div class="form-group"><label for="valorclave">Valor Clave</label><input type="text" class="form-control input-sm" id="vclave" val="'+Vclave+'"></div><div class="row"><div class="col-md-6"><div class="form-group"><label for="Lada">Lada</label><input type="text" class="form-control input-sm" id="lada" val="'+lada+'"></div></div><div class="col-md-6"><div class="form-group"><label for="valorclave">Extension</label><input type="text" class="form-control input-sm" id="ext" val="'+ext+'"></div></div></div>';

				$('#Builder_Engine .customer_default').empty().append(content);


				$('.customer_default #names').val(names).prop('disabled', true);
				$('.customer_default #pat').val(pat).prop('disabled', true);
				$('.customer_default #mat').val(mat).prop('disabled', true);
				$('.customer_default #vclave').val(Vclave).prop('disabled', true);
				$('.customer_default #lada').val(lada).prop('disabled', true);
				$('.customer_default #ext').val(ext).prop('disabled', true);


			},error: function(data){
					console.log("no cargo default name");
			}

		});

	};

	$.loadCustomersQuotes = function(data){

		//rg_CargaClientesCitas
		//var skillidx = Cookies.get('SkillId');

		/*
		Cookies.get('clientesId');
		Cookies.get('clientesNames');
		Cookies.get('clientesPat');
		Cookies.get('clientesMat');
		Cookies.get('clientesClave');
		Cookies.get('clientesLada');
		Cookies.get('clientesExt');
		Cookies.get('clientesClaveId');
		*/

		/*
		direccion:,
		codigoPostal:,
		colonia:,
		usuarioVisita:,
		fechaVisita:,
		usuariosId:,
		tipoCitaId:
		*/

		//$('.customers_quotes').empty().append('<div class=""><div class="form-group"><label for="Nombre">Direccion</label><input type="text" class="form-control input-sm" id="" placeholder=""></div><div class="form-group"><label for="Colonia">Colonia</label><input type="text" class="form-control input-sm" id="" placeholder=""></div><div class="row"><div class="col-md-6"><div class="form-group"><label for="Colonia">Codigo Postal</label><input type="text" class="form-control input-sm" id="" placeholder=""></div></div><div class="col-md-6"><div class="form-group"><label for="Colonia">Usuario Visita</label><input type="text" class="form-control input-sm" id="" placeholder=""></div></div><div class="col-md-6"><div class="form-group"><label for="Colonia">Tipo de Cita</label><select class="form-control input-sm"><option value="1">Cita Llamada</option><option value="2">Cita Presencial</option></select></div></div><div class="col-md-6"><div class="form-group"><label for="Colonia">Fecha</label><div class="input-group date" id="datetimepicker1"><input type="text" class="form-control input-sm" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div></div></div>');
		//$('.customers_quotes').empty().append('<div class="input-group date" id="datetimepicker1"><input type="text" class="form-control" /><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>');

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
			//console.log("algo salio mal");
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

	var Data = {
		 skillsId: skillsId,
		 serviciosId: serviciosId,
		 clientesId: clientesId,
		 clientesClavesId: clientesClavesId,
		 skillsTipologiasId: skillsTipologiasid,
		 comentario: comentario,
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

		//console.log("grabaste typing", data);

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

	console.log("guardare datos");

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
