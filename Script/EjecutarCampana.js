var url = '../Controlador/EjecutarCampana_Controlador.php';
var jsonExcel = [];
var idcampana = 0;
var tengoQr = 0;
var estadoQR = "INACTIVO";
var hilo = new Worker('../Script/Plugin/hilo.js');
$(document).ready(function () {
    hilo.addEventListener('message', function (e) {
        cambioEstadoQR();
    }, true);
    idcampana = localStorage.getItem("campana");
    if (idcampana === null || idcampana === "0") {
        window.location.href = "Campana.html";
    }
    cargando(true);
    $.get(url, {proceso: 'iniciar', idcampana: idcampana}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            var campana = json.result.campana;
            if(campana.estado==="0"){
                $("#btnqr").remove();
            }
            var listavariable = json.result.variable;
            var listacontactos = json.result.contactos;
            var listamensaje = json.result.mensaje;
            var optionVariable = "";
            var variable = "";
            var htmlHead = "";
            var htmlModelo = "<tr>";
            for (var i = 0; i < listavariable.length; i++) {
                variable += "<div class='encabezadoVariable' onclick='copiarVariable(this)'>";
                variable += "    <div class='nombre'>" + listavariable[i].nombre + "</div>";
                variable += "    <div class='variable'>[--" + listavariable[i].nombre + "--]</div>";
                variable += "</div>";
                optionVariable += "<option value='" + listavariable[i].nombre + "'>" + listavariable[i].nombre + "</option>";
                htmlHead += "<th><div class='normal'>" + listavariable[i].nombre + "</div></th>";
                htmlModelo += "<td><div class='normal'>" + listavariable[i].apodo + "</div></td>";
            }
            htmlModelo += "</tr>";
            var htmlBody = "";
            var position = -1;
            for (var i = 0; i < listacontactos.length; i++) {
                if (position !== listacontactos[i].posicion) {
                    position = listacontactos[i].posicion;
                    htmlBody += htmlModelo;
                }
                var dato = listacontactos[i].dato;
                var apodo = listacontactos[i].apodo;
                while (htmlBody.indexOf(apodo) >= 0) {
                    htmlBody = htmlBody.replace(apodo, dato);
                }
            }
            $("#tblExcel thead").html(htmlHead);
            $("#tblExcel tbody").html(htmlBody);
            $("#cuerpoEncabezado").html(variable);
            $("#telefonoVariable").html(optionVariable);
            $("#telefonoVariable option[value='" + campana.varTelefono + "']").prop("selected", true);
            $("input[name=campana]").val(campana.detalle);
            $("input[name=fecha]").val(campana.fecha);
            $("#mensaje").val(campana.mensaje);
            $(".fotoCuadro img").attr("src", campana.arte);
            var htmlMensaje = "";
            var env = 0;
            var blo = 0;
            var sw = 0;
            var tm = 0;
            var ep = 0;
            for (var i = 0; i < listamensaje.length; i++) {
                var estado = listamensaje[i].respuesta;
                var css = "";
                if (estado === "ENVIADO") {
                    css = "enviado";
                    env++;
                }
                if (estado === "BLOQUEADO") {
                    css = "bloqueado";
                    blo++;
                }
                if (estado === "NOTIENE") {
                    css = "sinWhatsapp";
                    sw++;
                }
                if (estado === "TELEFONO MAL") {
                    css = "telefonoMal";
                    tm++;
                }
                if (estado === "ESPERA") {
                    css = "espera";
                    ep++;
                }
                htmlMensaje += "<tr id='m" + listamensaje[i].idmensaje + "' data-id='" + listamensaje[i].idmensaje + "'><td><div class='pequeno'>" + listamensaje[i].nroTelefono + "</div></td>";
                htmlMensaje += "<td class='" + css + "'><div class='normal'>" + listamensaje[i].respuesta + "</div></td>";
                htmlMensaje += "<td><div class='normal'>" + listamensaje[i].hora + "</div></td></tr>";
            }
            $("#scE").text(env);
            $("#scB").text(blo);
            $("#scSW").text(sw);
            $("#scTI").text(tm);
            $("#scEP").text(ep);
            $("#tblmensaje tbody").html(htmlMensaje);
            setTimeout(function () {
                actualizarResultadoMensaje();
            }, 1000);
        }
    });
});
function detenerCampana() {
    cargando(true);
    $.post(url, {proceso: 'detenerCampana', idcampana: idcampana}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
        }
    });
}
function cambioEstadoQR() {
    $.get(url, {proceso: 'estadoActual', idcampana: idcampana, tengoQR: tengoQr}, function (response) {
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            var item = json.result;
            if (item.estado === "QR GENERADO" && tengoQr === 1) {
                setTimeout(function () {
                    cambioEstadoQR();
                }, 500);
            }
            if (item.estado === "QR GENERADO" && tengoQr === 0) {
                $("#imgQR").attr("src", item.qr);
                $("#estadoQR").html("Esperando");
                tengoQr = 1;
                setTimeout(function () {
                    cambioEstadoQR();
                }, 500);
            }
            if (item.estado === "INACTIVO") {
                $("#btnqr").text("Obtener QR");
                $("#estadoQR").html("Desconectado");
                $("#estadoQR").removeClass("verdeClarito");
                $("#estadoQR").removeClass("AmarilloClarito");
                $("#estadoQR").addClass("rojoClarito");
                $("#imgQR").attr("src", "../img/wpLogo.jpg");
                tengoQr = 0;
            }
            if (item.estado === "ACTIVO") {
                if ($("#estadoQR").html() !== "Conectado") {

                }
                $("#btnqr").text("Detener");
                $("#estadoQR").html("Conectado");
                $("#estadoQR").removeClass("rojoClarito");
                $("#estadoQR").removeClass("AmarilloClarito");
                $("#estadoQR").addClass("verdeClarito");
                $("#imgQR").attr("src", "../img/wpLogo.jpg");
                tengoQr = 0;
                setTimeout(function () {
                    cambioEstadoQR();
                }, 500);

            }
            if (item.estado === "OBTENER QR") {
                setTimeout(function () {
                    tengoQr = 0;
                    cambioEstadoQR();
                    //hilo.postMessage({});// pronar cual ocupa menos recursos esto o directo la otra
                }, 500);
            }
        }
    });
}
function GenerarQR() {
    var estado = $("#btnqr").text().toUpperCase();
    cargando(true);
    $.post(url, {proceso: 'qr', estado: estado, idcampana: idcampana, estado: estado}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            tengoQr = 0;
            $("#estadoQR").html("Esperando QR");
            $("#estadoQR").removeClass("verdeClarito");
            $("#estadoQR").removeClass("rojoClarito");
            $("#estadoQR").addClass("AmarilloClarito");
            if (estado === "DETENER") {
                $("#btnqr").text("Obtener QR");
                $("#estadoQR").html("Desconectado");
                $("#estadoQR").removeClass("verdeClarito");
                $("#estadoQR").removeClass("AmarilloClarito");
                $("#estadoQR").addClass("rojoClarito");
                $("#imgQR").attr("src", "../img/wpLogo.jpg");
                tengoQr = 0;
            } else {
                hilo.postMessage({});
            }

        }
    });
}
function actualizarResultadoMensaje() {
    $.get(url, {proceso: 'resultadoMensaje', idcampana: idcampana}, function (response) {
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            var listamensaje = json.result;
            var env = 0;
            var blo = 0;
            var sw = 0;
            var tm = 0;
            var ep = 0;
            for (var i = 0; i < listamensaje.length; i++) {
                var estado = listamensaje[i].respuesta;
                var css = "";
                if (estado === "ENVIADO") {
                    css = "enviado";
                    env++;
                }
                if (estado === "BLOQUEADO") {
                    css = "bloqueado";
                    blo++;
                }
                if (estado === "NOTIENE") {
                    css = "sinWhatsapp";
                    sw++;
                }
                if (estado === "TELEFONO MAL") {
                    css = "telefonoMal";
                    tm++;
                }
                if (estado === "ESPERA") {
                    css = "espera";
                    ep++;
                }
                $("#m" + listamensaje[i].idmensaje).find("td:eq(1)").removeClass("enviado")
                        .removeClass("bloqueado").removeClass("sinWhatsapp")
                        .removeClass("telefonoMal").removeClass("espera").addClass(css);

                $("#m" + listamensaje[i].idmensaje).find("div:eq(1)").html(estado);
                $("#m" + listamensaje[i].idmensaje).find("div:eq(2)").html(listamensaje[i].hora);
            }
            $("#scE").text(env);
            $("#scB").text(blo);
            $("#scSW").text(sw);
            $("#scTI").text(tm);
            $("#scEP").text(ep);
            if (ep > 0) {
                setTimeout(function () {
                    actualizarResultadoMensaje();
                }, 1000);
            }

        }
    });
}
function msnActualizarCampana(){
    var estado=$("#rojoClarito").html();
    if(estado==="Desconectado"){
        $("body").msmOK("Para guardar los cambio debes para el envio primero");
        return;
    }
    $("body").msmPregunta("El cambio realizado solo afectara a los mensajes con estado de ESPERA. ¿Deseas realizar el cambio? ","actualizarCambios()");
}
function actualizarCambios(){
    var campana=$("input[name=campana]").val();
    var mensaje=$("#mensaje").val();
    var foto=$(".fotoCuadro img").attr("src");
    var telefono=$("#telefonoVariable option:selected").val();
    var listaMensaje=$("#tblmensaje tbody tr");
    var lista=[];
    /*for (var i = 0; i < listaMensaje.length; i++) {
        var id=$(listaMensaje[i]).data("id");
        var estado=$(listaMensaje[i]).find("div:eq(1)").html();
        if(estado==="ESPERA"){
            var mensajeActual
            lista.push(id);
        }
    }*/
    cargando(true);
    $.post(url, {proceso: 'actualizarCampana' ,listamensaje:lista, idcampana: idcampana,campana:campana,
                mensaje:mensaje,foto:foto,telefono:telefono}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            $("body").msmOK("Los cambios se guardaron correctamente");
        }
    });
}