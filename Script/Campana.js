var url = '../Controlador/Campana_Controlador.php';
var jsonExcel = [];
$(document).ready(function () {
    $(".fecha").val(fechaActual());
    $(".fecha").datepicker();
    localStorage.setItem("campana", 0);
    generarReporte();
});
function generarReporte() {
    var de = $("input[name=de]").val();
    var hasta = $("input[name=hasta]").val();
    cargando(true);
    $.get(url, {proceso: 'generarReporte', de: de, hasta: hasta}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession(2);
            }
            $("body").msmOK(json.error);
        } else {
            var campana = json.result;
            var html = "";
            var totalEspera = 0;
            var totalEnviado = 0;
            var totalBloqueado = 0;
            var totalNotiene = 0;
            var totalMal = 0;
            for (var i = 0; i < campana.length; i++) {
                var idcampana = campana[i].idcampana;
                var detalle = campana[i].detalle;
                var fecha = campana[i].fecha;
                var nombre = campana[i].nombre;
                var telefonoMal = parseInt(campana[i].telefonoMal);
                var bloqueado = parseInt(campana[i].bloqueado);
                var enviado = parseInt(campana[i].enviado);
                var notiene = parseInt(campana[i].notiene);
                var espera = parseInt(campana[i].espera);
                totalEspera += espera;
                totalEnviado += enviado;
                totalBloqueado += bloqueado;
                totalNotiene += notiene;
                totalMal += telefonoMal;
                html += "<tr ondblclick='ejecutarcampana(" + idcampana + ")'><td><div class='normal'>" + fecha + "</div></td>";
                html += "<td><div class='medio'>" + detalle + "</div></td>";
                html += "<td><div class='medio'>" + nombre + "</div></td>";
                html += "<td><div class='normal'>" + espera + "</div></td>";
                html += "<td><div class='normal'>" + enviado + "</div></td>";
                html += "<td><div class='normal'>" + bloqueado + "</div></td>";
                html += "<td><div class='normal'>" + notiene + "</div></td>";
                html += "<td><div class='normal'>" + telefonoMal + "</div></td></tr>";
            }
            $("#tblResultado tbody").html(html);
            html = "<td><div class='normal'></div></td>";
            html += "<td><div class='medio'></div></td>";
            html += "<td><div class='medio'>TOTAL</div></td>";
            html += "<td><div class='normal'>" + totalEspera + "</div></td>";
            html += "<td><div class='normal'>" + totalEnviado + "</div></td>";
            html += "<td><div class='normal'>" + totalBloqueado + "</div></td>";
            html += "<td><div class='normal'>" + totalNotiene + "</div></td>";
            html += "<td><div class='normal'>" + totalMal + "</div></td>";
            $("#tblResultado tfoot").html(html);

        }
    });
}
function ejecutarcampana(idcampana) {
    localStorage.setItem("campana", idcampana);
    window.location.href = "EjecutarCampana.html";
}
function popCampana(tipo) {
    if (tipo === 1) {
        $("#campanapop").limpiarFormulario();
        $(".fotoCuadro img").attr("src", "../img/earth190.svg");
        $("#tblExcel thead").html("");
        $("#tblExcel tbody").html("");
        $("#cuerpoEncabezado").html("");
        $("#campanapop").visible(1);
        $("#mensaje").val("");
        $(".background").visible(1);
        $("#campanapop").centrar();
    } else {
        $("#campanapop").ocultar();
        $(".background").ocultar();
        $("#popExportarGogle").ocultar();
        $(".background").ocultar();
    }
}
function subirExcel(e, tipo) {
    if (tipo === 1) {
        $("#inputExcel").click();
    } else {
        var files = e.target.files;
        var i, f;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            var name = f.name;
            $("input[name=nombreExcel]").val(name);
            reader.onload = function (e) {
                var data = e.target.result;
                jsonExcel = [];
                var workbook = XLSX.read(data, {type: 'array'});
                var sheet_name_list = workbook.SheetNames;
                sheet_name_list.forEach(function (y) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    if (roa.length > 0) {
                        jsonExcel = roa;
                    }
                });
                var head = "";
                var body = "";
                var variable = "";
                var optionVariable = "";
                for (var i = 0; i < jsonExcel.length; i++) {
                    var item = jsonExcel[i];
                    body += "<tr>";
                    for (var key in item) {
                        if (i === 0) {
                            head += "<th><div class='normal'>" + key + "</div></th>";
                            variable += "<div class='encabezadoVariable' onclick='copiarVariable(this)'>";
                            variable += "    <div class='nombre'>" + key + "</div>";
                            variable += "    <div class='variable'>[--" + (key.toUpperCase()) + "--]</div>";
                            variable += "</div>";
                            optionVariable += "<option value='" + key + "'>" + key + "</option>";
                        }
                        var valor = item[key];
                        body += "<td><div class='normal' >" + valor + "</div></td>";
                    }
                    body += "</tr>";
                }
                $("#contactoG").html(optionVariable);
                $("#telefonoG").html(optionVariable);
                $("#telefonoVariable").html(optionVariable);
                $("#tblExcel thead").html(head);
                $("#tblExcel tbody").html(body);
                $("#cuerpoEncabezado").html(variable);
                $("#tblExcel").igualartabla();
            };
            reader.readAsArrayBuffer(f);
        }
    }
}
function copiarVariable(ele) {
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
function crearCampaña() {
    var nombre = $("input[name=campana]").val().trim();
    var img = $(".fotoCuadro img").attr("src");//"../img/earth190.svg"
    var telefonoVar = $("#telefonoVariable option:selected").val();
    var mensaje = $("#mensaje").val();
    if (jsonExcel.length === 0) {
        $("body").msmOK("Para crear una campaña tiene que subir primero un excel.");
        return;
    }
    if (mensaje.length === 0 && img === "../img/earth190.svg") {
        $("body").msmOK("No ha escrito ningun mensaje para el envio o subido arte");
        return;
    }
    var listaMensajes = [];
    var listaHead = [];
    var listaEncabe = $("#cuerpoEncabezado .encabezadoVariable");
    var posicionTelefono = 0;
    for (var i = 0; i < listaEncabe.length; i++) {
        var nombre2 = $(listaEncabe[i]).find(".nombre").html();
        var variable = $(listaEncabe[i]).find(".variable").html();
        if (nombre2 === telefonoVar) {
            posicionTelefono = i;
        }
        listaHead.push({nombre: nombre2, variable: variable});
    }
    var listadatos = [];
    var lista = $("#tblExcel tbody tr");
    for (var i = 0; i < lista.length; i++) {
        listaMensajes.push({});
        var msnAux = mensaje;
        var dato = $(lista[i]).find("div");
        for (var j = 0; j < dato.length; j++) {
            var datoConte = $(dato[j]).html();
            listadatos.push({posicion: i, dato: datoConte, head: j});
            if (j === posicionTelefono) {
                listaMensajes[i]["telefono"] = datoConte;
            }
            var var1 = listaHead[j].variable;
            while (msnAux.indexOf(var1) >= 0) {
                msnAux = msnAux.replace(var1, datoConte);
            }
        }
        listaMensajes[i]["mensaje"] = msnAux;
    }

    cargando(true);
    $.post(url, {proceso: 'registrarCampana', nombrecampana: nombre, img: img, mensaje: mensaje
        , telefono: telefonoVar, listamensaje: listaMensajes, head: listaHead, dato: listadatos}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession();
            }
            $("body").msmOK(json.error);
        } else {
            popCampana(0);
            $("body").msmOK("La campaña se creo correctamente");
            generarReporte();
        }
    });
}
function popExportarGoogle(tipo) {
    if (tipo === 1) {
        if (jsonExcel.length === 0) {
            $("body").msmOK("Tiene que subir un excel primero.");
            return;
        }
        $("#popExportarGogle").visible();
        $("#popExportarGogle").centrar();
        $(".background").visible();
        $("#campanapop").ocultar();
    } else {
        $("#popExportarGogle").ocultar();
        $("#campanapop").visible();
    }
}
function exportarGoogle() {
    var nombreArchivo = "ContactoGoogle " + fechaActualReporte() + ".csv";
    var vContacto = $("#contactoG option:selected").val();
    var cTelefono = $("#telefonoG option:selected").val();
    var html = "Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Group Membership,Phone 1 - Type,Phone 1 - Value\n";
    for (var i = 0; i < jsonExcel.length; i++) {
        var item = jsonExcel[i];
        var contacto = item[vContacto];
        var telefono = item[cTelefono];
        html += contacto + ",,,,,,,,,,,,,,,,,,,,,,,,,,* My Contacts,Mobile," + telefono + "\n";
    }


    if (false && window.navigator.msSaveBlob) {
        var blob = new Blob([decodeURIComponent(html)], {
            type: 'text/csv;charset=utf8'
        });
        window.navigator.msSaveBlob(blob, nombreArchivo);
    } else if (window.Blob && window.URL) {
        var blob = new Blob([html], {type: 'text/csv;charset=utf8'});
        var csvUrl = URL.createObjectURL(blob);
        $("#export").attr({
            'download': nombreArchivo,
            'href': csvUrl
        });
    } else {
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(html);
        $("#export").attr({
            'download': nombreArchivo,
            'href': csvData,
            'target': '_blank'
        });
    }
}
function abrirGoogle() {
    window.open("https://www.google.com/contacts/u/0/?cplus=0#contacts", '_blank');
}
