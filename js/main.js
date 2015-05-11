/* Main Camu.Agente */

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

		$("#logdIn").slideToggle(1000, function(){
			$(".loader").fadeIn("slow", function(){
				$(".loader").fadeOut("slow", function(){

						//cookies everywhere
						var id = Cookies.set('id', response[0].usuariosId);
						var name = Cookies.set('name', response[0].usuario);
						var profile = Cookies.set('profile', response[0].perfil);
						var dataM = response[0].menu;
						var dataS = response[0].skills;
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

		$("#services").slideDown().show();

	}else{

		$("#services").hide();
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

			var content = '<option value="'+skillsId+'" name="'+skill+'">'+skill+'</option>';
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

  var Data = { nombre1: name, nombre2: "", apellido1: pat, apellido2: mat, valorClave: phone, usuarioId: myid, skillid: skillID };

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

			$('.result').empty().append('<table class="search_evals table table-striped"><thead><tr><th>#</th><th>Nombre</th><th>Apellido Pat</th><th>Apellido Mat</th><th>Valor Clave</th><th>Lada Telefono</th><th>Ext</th><th>Servicio</th><th>Build it</th></tr></thead><tbody></tbody></table>');

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

					var content = '<tr><th>'+id+'</th><th>'+name+' '+second_name+'</th><th>'+pat_name+'</th><th>'+mat_name+'</th><th>'+clave+'</th><th>'+lada+'</th><th>'+extension+'</th><th>'+service+'</th><th><button class="btn btn-engine build"><span class="glyphicon glyphicon-cog"></span></button></th></tr>';
					$('.result table.search_evals').append(content);
			}

	}else{
		$(".result").empty().append('<span class="not-found">No hay resultados</span>');
	}

}

function SearchOnError(data){
  //alert("Perror", data);
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


};


/*Login*/

$(document).on('click', '#login', function(){

	//business logic...

  var user = $('#user').val();
  var password = $('#password').val();

  if($("#user").val() == '' || $("#password").val() == ''){

			alert("Los campos son obligatorios");
      $(".form-group").addClass('has-error');
			$("#login").prop( "disabled", false );

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
	location.reload();

});

/*Services Box*/

$(document).on('click', '.choice-service', function(){


	alert("sol");
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
	//var skillstd = $(".skillchoice option:selected").attr('name');

	Cookies.set('SkillId', skillID);

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

$(document).ready(function(){

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
});

$(document).on('click', '.search-back', function(){

  $('.result').empty();
	$(".form-group").removeClass('has-error');
  $("#box-name").val("");
  $("#box-pat").val("");
  $("#box-mat").val("");
  $("#box-phone").val("");

	$("#search-result").slideUp("slow", function(){
		$("#search").slideDown("slow");
	});

});


/*+++++++++++++++++++++++++++++++
		Template Builder Engine
 ++++++++++++++++++++++++++++++++*/


$(document).on('click', '.build', function(){

	$.ajax({
		url: "index.html",
		type: "POST",
		async: false,
		success: function(){
			window.open('engine.html', '_blank');
		}
	});

});

$(document).on('click', '#logout-builder', function(){

	Cookies.remove('id');
	Cookies.remove('name');
	Cookies.remove('profile');
	Cookies.remove('parole');
	Cookies.remove('SkillId');

	$('#Builder_Engine').empty("", function(){
		location.reload();
	});

});

$(document).ready(function(){

	if(path == "/engine.html"){

		$('.navbar-top').addClass('navbar-top-fixed');
		//var name = Cookies.get('name');
		//var passw = Cookies.get('parole');
		var user = "master";
		var passw = "master";
		$.onsetEngine(user, passw);

	}

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

	//console.info(data);
	var factory = data[0].configuracion;

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

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

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
							var content = '<div class="form-group"><label for="">'+title+'</label><input type="'+form+'" class="form-control input-lg" id="'+name+'" maxlength="'+long+'" placeholder=""></div>';
							$('.base_layout').append(content);
						}

					}

				}else{
					$('.base_layout').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Layout Base.</div>');
				}
		}

	}

};


$.captureRenderEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

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
							var content = '<div class="form-group"><label for="">'+title+'</label><input type="'+form+'" class="form-control input-lg" id="'+name+'" value="'+defaultvalue+'"  maxlength="'+long+'" placeholder=""></div>';
							$('.advisory_capture').append(content);
						}

					}

				}else{
					$('.advisory_capture').append('<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> No hay configurados Campos Captura Asesor.</div>');
				}

		}

	}

};

$.typificationsEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var typs = data[i].tipologias;

			$('.tree').append('<h3 class="text-center">Tipificaciones</h3><div class="list-group"></div>');

			for(var i = 0; i < typs.length; i++){

				var skillTipologiasId = typs[i].skillTipologiasId;
				var tipologia = typs[i].tipologia;
				var nivel = typs[i].nivel;
				var skillTipologiasIdSup = typs[i].skillTipologiasIdSup;
				var agendaLlamada = typs[i].agendaLlamada;
				var confirmaVenta = typs[i].confirmaVenta;

				var content = '<a href="#" class="list-group-item"><span class="badge">'+skillTipologiasId+'</span>'+tipologia+'</a>';

				$('.tree div.list-group').append(content);

			}

		}

	}

};

$.productsEngine = function(data){

	//var skillidx = Cookies.get('SkillId');
	var skillidx = "3";

	for(var i = 0; i < data.length; i++){

		if(skillidx == data[i].skillsId){

			var items = data[i].productos;

			$('.products').append('<h3 class="text-center">Productos</h3><div class="list-group"></div>');

			for(var i = 0; i < items.length; i++){

				var skillsProductosId = items[i].skillsProductosId;
				var skillsId = items[i].skillsId;
				var product = items[i].producto;
				var skillsProductosIdSup = items[i].skillsProductosIdSup;
				var active = items[i].activo;
				var userAt = items[i].usuarioCreacion;
				var dateAt = items[i].fechaCreacion;

				var content = '<a href="#" class="list-group-item"><span class="badge">'+skillsProductosId+'</span>'+product+'</a>';

				$('.products div.list-group').append(content);

			}

		}

	}

};

$.typiHistoryEngine = function(data){

	var myid = Cookies.get('id');
	//var myid =  = "12";

	var clientesId = "1"
	var servicesid = data[0].serviciosId;

	var url = ws+"rg_ListClienteHistorico";

  var oData = { clientesId: clientesId, serviciosid: servicesid, usuariosId: myid  };

	$.support.cors = true;
  $.ajax({
    type: "GET",
    url: url,
    //cache: false,
    crossDomain: true,
    data: oData,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
		success: function(data){

			$('.historical').append('<h3 class="text-center">Historico Tipificaciones</h3><ul class="list-group"></ul>');

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
