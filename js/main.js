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

	//var skills_evals = Object.keys(data).length; //IE8 sucks
	var skills_evals = data;

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

	var url = ws+"rg_ListClientes";
	var myid = Cookies.get('id');
	var skillID = Cookies.get('SkillId');
	var serviciosID = Cookies.get('serviciosId');

  var Data = { nombre1: name, nombre2: "", apellido1: pat, apellido2: mat, valorClave: phone, usuarioId: myid, skillid: skillID, serviciosId: serviciosID };

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

					var content = '<tr><th class="nr">'+id+'</th><th>'+name+' '+second_name+'</th><th>'+pat_name+'</th><th>'+mat_name+'</th><th>'+clave+'</th><th>'+lada+'</th><th>'+extension+'</th><th class="cd">'+clientesClaveId+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
					$('.result table.search_evals').append(content);

			}

	}else{

		$('#search-result').empty().append('<div class="btn-group btn-group-lg pull-left" role="group" aria-label="config"><button class="btn btn-search search-back">Nueva Busqueda <span class="glyphicon glyphicon-search"></button></div><div class="btn-group btn-group-lg pull-right" role="group" aria-label="config"><button class="btn btn-search add-client">Crear Cliente <span class="glyphicon glyphicon-plus"></button></div><div class="result"></div>')
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

function SearchOnError(data){
  //alert("Perror", data);
}

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

	var $text = $row.find(".nr").text(); // Find the id
	var $textcid = $row.find(".cd").text(); // Find the clientesClaveId

	var clientesId = $text;
	var clientesClaveid = $textcid;

	Cookies.set('clientesId', clientesId);
	Cookies.set('clientesClaveId', clientesClaveid);

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

		//var name = Cookies.get('name');
		//var passw = Cookies.get('parole');
		var user = "master";
		var passw = "master";
		$.onsetEngine(user, passw);

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

$(document).on('click', '.btn-engine-done', function(){

		//$(".btn-engine-done").prop( "disabled", true );

		// Get typing selected
		var treetagid = $('.tree .tag').attr('title');
		var treecomment = $('.tree .comment').val();

		$.onsaveTyping(treetagid, treecomment);

		// Get product selected
		var producttag = $('.products .tag').text();
		var producttagid = $('.products .tag').attr('title');

		$.onsaveProducts(producttagid);

		//Get Inputs data Fields
		var inputarry = new Array();
		var labelarry = new Array();

		$('.form-dinamic .input-dinamic').each(function(){

			inputarry.push($(this).val());
			labelarry.push($(this).attr("name"));

		});

		$.onSaveData(labelarry, inputarry);



		//console.log("inputs", x);


		//alert(JSON.stringify(fields));

		//console.log(fields);
		//console.log(JSON.stringify(fields));



		/*var inputTypes = [];

		$('.form-dinamic input[name][id][value]').each(function(){

			inputTypes.push($(this).attr('type'));

		});

		console.log(inputTypes);
		*/

		/*
		<input type="'+form+'" class="input-dinamic" id="'+name+'" name="'+title+'" value="'+defaultvalue+'">
		*/

		//var map = {};

    ///$(".form-dinamic .input-dinamic").each(function(){

			 	//var map = $(this).val();
				//map[$(this).val()];

				//map[$(this).attr("id")] = $(this).val();
			//	map[$(this).attr("name")] = $(this).val();
    //});

  	//alert(map.key1); // "red"

		//alert(map);

		//console.log(JSON.stringify(map));

		//var d = num.toString(16);

		/*
		$(".form-build").removeClass('has-error');

		$('.input-dinamic').each(function(){


				if(!$(this).val() == "" && $(this).hasClass('required')){

					alert("Los campos marcados con rojo son obligatorios");
					$(".form-build").addClass('has-error');

					return;
			  }
				else{
					alert("seguir adelante");
				}

		});
		*/

		//alert("Salvare productos");

		//$(".form-build").removeClass('has-error');

		/*

		if($(".input-dinamic").val() == "" && $(".input-dinamic").hasClass('required')){

			alert("Los campos marcados con rojo son obligatorios");
			$(".form-build").addClass('has-error');

		}
		else{

			alert("salvando");

		}
		*/

		/*
		if(required == "1"){
			$(".form-build").addClass('has-error');
		}

		if ($(".form-build").hasClass("has-error") ||  ) {
			alert("Los campos marcados con rojo son obligatorios");
		}else{
			alert("Salvando");
		}
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
	var tipologia = $(this).attr('title');

	var content = '<a href="#" title="'+typingId+'" class="tag">'+tipologia+'</a>';
	$('.tree .tags').empty().append(content);

});


$.onsetEngine = function(user, passw){

  var url = ws+"rg_seguridadLogin";

  var oData = { User: user, Password: passw };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    //cache: false,
    crossDomain: true,
    data: oData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: onsetEngineSuccess,
    error: onsetEngineError
  });

};

function onsetEngineSuccess(data){

	var factory = data[0].configuracion;


	//$('.navbar-top').addClass('navbar-top-fixed'); //position fixed header

	$(".loader").slideDown("slow", function(){

		$.cssEngine(factory);
		$.baselayoutEngine(factory);
		$.captureRenderEngine(factory);
		$.typificationsEngine(factory);
		$.productsEngine(factory);
		$.typiHistoryEngine(factory);

		$(".loader").slideUp("slow", function(){
			$('.logout').html('<a href="#" id="logout-builder"><span class="glyphicon glyphicon-log-out"></span> LogOut</a>');
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

	var skillidx = Cookies.get('SkillId');
	//var skillidx = "";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var Fields = data[i].camposBase;

				if(Fields != ""){

					$('.base_layout').append('<h3 class="text-center">Campos Layout Base</h3><br />');

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

							var content = '<div class="form-group form-build"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-lg input-dinamic" id="'+name+'" maxlength="'+long+'" placeholder=""></div>';
							$('.base_layout').append(content);

							if(required == "1"){
								$(".input-dinamic").addClass('required');
							}

						}

					}

				}else{
					$('.base_layout').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Layout Base.</div>');
				}
		}

	}

};

$.captureRenderEngine = function(data){

	var skillidx = Cookies.get('SkillId');
	//var skillidx = "3";

	$('.advisory_capture').append('<h3 class="text-center">Campos Captura Asesor</h3>');

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

						if(form == "input" || form == "Input"){

							var content = '<div class="form-group form-dinamic"><label class="control-label">'+title+'</label><input type="'+form+'" class="form-control input-lg input-dinamic" id="'+name+'" name="'+title+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
							$('.advisory_capture').append(content);

							if(required == "1"){
								$(".input-dinamic").addClass('required');
							}

						}

					}

				}else{
					$('.advisory_capture').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Captura Asesor.</div>');
				}

		}

	}

};

$.typificationsEngine = function(data){

	var skillidx = Cookies.get('SkillId');
	//var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var typs = data[i].tipologias;

			$('.tree').append('<h3 class="text-center">Tipificaciones</h3><div class="list-group"></div><div class="tags"></div><h4>Comentarios</h4><textarea class="form-control comment well-sm" rows="3"></textarea>');

			for(var i = 0; i < typs.length; i++){

				var skillTipologiasId = typs[i].skillTipologiasId;
				var tipologia = typs[i].tipologia;
				var nivel = typs[i].nivel;
				var skillTipologiasIdSup = typs[i].skillTipologiasIdSup;
				var agendaLlamada = typs[i].agendaLlamada;
				var confirmaVenta = typs[i].confirmaVenta;

				var content = '<a href="#" id="'+skillTipologiasId+'" title="'+tipologia+'" class="list-typing list-group-item">'+tipologia+'</a>';

				$('.tree .list-group').append(content);

			}

		}

	}

};

$.productsEngine = function(data){

	var skillidx = Cookies.get('SkillId');
	//var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var items = data[i].productos;

			$('.products').append('<h3 class="text-center">Productos</h3><ul class="list-product list-group"></ul><div class="tags"></div>');

			for(var i = 0; i < items.length; i++){

				var skillsProductosId = items[i].skillsProductosId;
				var skillsId = items[i].skillsId;
				var product = items[i].producto;
				var skillsProductosIdSup = items[i].skillsProductosIdSup;
				var active = items[i].activo;
				var userAt = items[i].usuarioCreacion;
				var dateAt = items[i].fechaCreacion;

				var content = '<li id="'+skillsProductosId+'" title="'+product+'" class="list-group-item">'+product+'</li>';

				$('.products .list-product').append(content);

			}

		}

	}

};

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

			$('.historical').empty().append('<h3 class="text-center">Historico Tipificaciones</h3><ul class="list-group"></ul>');

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

//Save

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

		console.log("grabaste typing", data);

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
