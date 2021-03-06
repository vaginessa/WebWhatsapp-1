var url = '../Controlador/EjecutarCampana_Controlador.php';
var jsonExcel = [];
var idcampana = 0;
var tengoQr = 0;
var estadoQR = "INACTIVO";
var websocket;
var env = 0;
var blo = 0;
var sw = 0;
var tm = 0;
var ep = 0;
$(document).ready(function () {
    
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
            if (campana.estado === "0") {
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
            $("#tblExcel").igualartabla();
            $("#cuerpoEncabezado").html(variable);
            $("#telefonoVariable").html(optionVariable);
            $("#telefonoVariable option[value='" + campana.varTelefono + "']").prop("selected", true);
            $("input[name=campana]").val(campana.detalle);
            $("input[name=fecha]").val(campana.fecha);
            $("#mensaje").val(campana.mensaje);
            $(".fotoCuadro img").attr("src", campana.arte);
            var htmlMensaje = "";

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
            conectarSocket();
        }
    });
});
function conectarSocket() {
    wsUri = "ws://"+window.location.hostname+":8888";
    websocket = new WebSocket(wsUri);
    websocket.onmessage = function (ev) {
        var response = JSON.parse(ev.data);
        var tipo = response.tipo;
        if (tipo === "system") {
            send_message("iniciar", "Detener");
        } else {
            var accion = response.accion;
            switch (accion) {
                case 'Server Off':
                    $("#btnqr").text("Obtener QR");
                    $("#estadoQR").html("Desconectado");
                    $("#estadoQR").removeClass("verdeClarito");
                    $("#estadoQR").removeClass("AmarilloClarito");
                    $("#estadoQR").addClass("rojoClarito");
                    $("#imgQR").attr("src", "../img/desconectado.png");
                    $("body").msmOK("El servidor se encuentra desconectado. Intente nuevamente o contactese con el administrador del portal.");
                    break;
                case 'Detener':
                    $("#btnqr").text("Obtener QR");
                    $("#estadoQR").html("Desconectado");
                    $("#estadoQR").removeClass("verdeClarito");
                    $("#estadoQR").removeClass("AmarilloClarito");
                    $("#estadoQR").addClass("rojoClarito");
                    $("#imgQR").attr("src", "../img/desconectado.png");
                    break;
                case 'Obtener QR':
                    $("#estadoQR").html("Esperando QR");
                    $("#btnqr").text("Detener");
                    $("#estadoQR").removeClass("verdeClarito");
                    $("#estadoQR").removeClass("rojoClarito");
                    $("#estadoQR").addClass("AmarilloClarito");
                    $("#imgQR").attr("src", "../img/desconectado.png");
                    break;
                case 'QR Generado':
                    var detalle = response.detalle;
                    var idcampana = response.idcampana;
                    $.get(url, {proceso: 'BuscarQR', idcampana: idcampana}, function (response) {
                        var json = $.parseJSON(response);
                        if (json.error.length > 0) {
                            if ("Error Session" === json.error) {
                                window.parent.cerrarSession();
                            }
                            $("body").msmOK(json.error);
                        } else {
                            $("#imgQR").attr("src", json.result.qr);
                            $("#estadoQR").html("Inicialice..");
                            $("#btnqr").text("Detener");
                            $("#estadoQR").removeClass("rojoClarito");
                            $("#estadoQR").removeClass("AmarilloClarito");
                            $("#estadoQR").addClass("verdeClarito");
                        }
                    });
                    break;
                case 'Conectado':
                    $("#btnqr").text("Detener");
                    $("#estadoQR").html("Conectado");
                    $("#estadoQR").removeClass("rojoClarito");
                    $("#estadoQR").removeClass("AmarilloClarito");
                    $("#estadoQR").addClass("verdeClarito");
                    $("#imgQR").attr("src", "../img/conectado.png");
                    break;
                case 'EnvioMsn':
                    var detalle = response.detalle;
                    var idmensaje = response.id;
                    var fecha = response.fecha;
                    
                    var css = "";
                    if (detalle === "ENVIADO") {
                        css = "enviado";
                        env++;
                    }
                    if (detalle === "BLOQUEADO") {
                        css = "bloqueado";
                        blo++;
                    }
                    if (detalle === "NOTIENE") {
                        css = "sinWhatsapp";
                        sw++;
                    }
                    if (detalle === "TELEFONO MAL") {
                        css = "telefonoMal";
                        tm++;
                    }
                    if (detalle === "ESPERA") {
                        css = "espera";
                        ep++;
                    }
                    $("#scE").text(env);
                    $("#scB").text(blo);
                    $("#scSW").text(sw);
                    $("#scTI").text(tm);
                    $("#scEP").text(ep);
                    $("#m" + idmensaje).find("div:eq(1)").html(detalle);
                    $("#m" + idmensaje).find("td:eq(1)").removeClass("espera").addClass(css);
                    $("#m" + idmensaje).find("div:eq(2)").html(fecha);
                    break;
            }
        }
    };
    websocket.onerror = function (ev) {
        window.location.href = "Campana.html";
    };
    websocket.onclose = function (ev) {
        window.location.href = "Campana.html";
    };
}
function send_message(tipo, accion) {
    var msg = {
        tipo: tipo,
        detalle: '',
        accion: accion,
        id: '',
        fecha: '',
        idcampana: idcampana
    };
    websocket.send(JSON.stringify(msg));
}
function GenerarQR() {
    var btn = $("#btnqr").text();
    switch (btn) {
        case 'Obtener QR':
            send_message("mensaje", btn);
            break;
        case 'Detener':
            send_message("mensaje", btn);
            break;
    }
}
function msnActualizarCampana() {
    var estado = $("#rojoClarito").html();
    if (estado === "Desconectado") {
        $("body").msmOK("Para guardar los cambio debes para el envio primero");
        return;
    }
    $("body").msmPregunta("El cambio realizado solo afectara a los mensajes con estado de ESPERA. ¿Deseas realizar el cambio? ", "actualizarCambios()");
}
function actualizarCambios() {
    var campana = $("input[name=campana]").val();
    var mensaje = $("#mensaje").val();
    var foto = $(".fotoCuadro img").attr("src");
    var telefono = $("#telefonoVariable option:selected").val();
    var listaMensaje = $("#tblmensaje tbody tr");
    var lista = [];
    for (var i = 0; i < listaMensaje.length; i++) {
        var id = $(listaMensaje[i]).data("id");
        var estado = $(listaMensaje[i]).find("div:eq(1)").html();
        if (estado === "ESPERA") {
            var mensajeActual = mensaje;
            var columnas = $("#tblExcel tbody tr:eq(" + i + ") div");
            var vartelf = "";
            for (var j = 0; j < columnas.length; j++) {
                var head = "[--" + $("#tblExcel thead div:eq(" + j + ")").html().toUpperCase() + "--]";
                var dato = $(columnas[j]).html();
                if (head === "[--" + telefono.toUpperCase() + "--]") {
                    vartelf = dato;
                }
                while (mensajeActual.indexOf(head) >= 0) {
                    mensajeActual = mensajeActual.replace(head, dato);
                }
            }
            lista.push({id: id, mensaje: mensajeActual, telefono: vartelf});
        }
    }
    ok();
    cargando(true);
    $.post(url, {proceso: 'actualizarCampana', listamensaje: lista, idcampana: idcampana, campana: campana,
        mensaje: mensaje, foto: foto, telefono: telefono}, function (response) {
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
function copiarVariable(ele) {
    $("#cuerpoEncabezado .encabezadoVariable").removeClass("verdeClarito");
    $(ele).addClass("verdeClarito");
    var valor = $(ele).find(".variable").html();
    var input = document.createElement("textarea");
    input.value = valor;
    input.id = 'txtareaCopy';
    document.querySelector("body").appendChild(input);
    input.select();
    document.execCommand("Copy");
    $("#txtareaCopy").remove();
    $("#mensaje").focus();
}
function copiarVariableSeleccionada() {
    var ele = $("#cuerpoEncabezado .verdeClarito");
    return;
    /*if(ele.length===0){
        return;
    }*/
    var valor = $(ele).find(".variable").html();
    var input = document.createElement("textarea");
    input.value = valor;
    input.id = 'txtareaCopy';
    document.querySelector("body").appendChild(input);
    input.select();
    document.execCommand("Copy");
    $("#txtareaCopy").remove();
    $("#mensaje").focus();
}