var imagenCargando = "../img/cargando.gif";
(function (a) {
    $.fn.extend({
        visible: function (tipo) {
            if (tipo === 1) {
                $(this).css("display", "block");
                $(this).focus();
            } else {
                $(this).css("display", "inline-block");
            }
        },
        igualartabla: function () {
            var tabla = $(this);
            $(this).find("tbody").css("width", $(this).find("thead").width() + 20);
            tabla.find("tbody tr").click(function () {
                tabla.find("tbody tr td").css("background", "white");
                $(this).find("td").css("background", "rgba(253, 246, 169, 0.62)");
            });
        },
        ocultar: function () {
            $(this).css("display", "none");
        },
        dragable: function (drag, drog, evento) {
            $(drag).draggable({
                revert: "invalid",
                refreshPositions: true,
                containment: 'parent',
                drag: function (event, ui) {
                    $(this).css({
                        cursor: "move",
                        opacity: "0.3",
                        transform: "scale(0.8,0.8)",
                    });
                },
                stop: function (event, ui) {
                    $(this).css({
                        cursor: "pointer",
                        opacity: "1",
                        transform: "scale(1,1)"
                    });
                }
            });
            $(drog).droppable({
                drop: evento
            });
        },
        limpiarFormulario: function () {
            $(this).find("input").val("");
            $(this).find(".error").text("");
            $(this).find(".correcto").text("");
            $(this).find("input[type=number]").val(0);
            $(this).find("select option:eq(0)").attr("selected", true);
            $(this).find(".fecha").val(fechaActual());
        },
        centrar: function () {
            $(this).css({
                position: 'fixed',
                left: ($(window).width() - $(this).outerWidth()) / 2,
                top: 25
            });
            $(window).resize(function () {
                $(this).css({
                    position: 'fixed',
                    left: ($(window).width() - $(this).outerWidth()) / 2,
                    top: 25
                });
            });
        },
        msmOK: function (options) {
            var result = "<div class='background' id='backgroundAux'></div><div class='popup' id='msmOK'>" +
                    "<span class='negrillaenter centrar'>ALERTA</span>" +
                    "<div>" + options + "</div>" +
                    "<div class='centrar'>" +
                    "<button onclick='ok()' class='normal'>OK</button>" +
                    "</div>" +
                    "</div>"
            $(this).append(result);
            $("#msmOK").visible(1);
            $("#msmOK").centrar();
            $("#msmOK button").focus();
            $(".background").visible(1);
        },
        msmPregunta: function (pregunta, funcion) {
            var result = "<div class='background' id='backgroundAux'></div><div class='popup' id='msmOK'>" +
                    "<span class='negrillaenter centrar'>ALERTA</span>" +
                    "<div>" + pregunta + "</div>" +
                    "<div class='centrar'>" +
                    "<button onclick=\"" + funcion + "\" class='normal' >SI</button>" +
                    "<button onclick='ok()' class='normal'>NO</button>" +
                    "</div>" +
                    "</div>"
            $(this).append(result);
            $("#msmOK").visible(1);
            $("#msmOK").centrar();
            $("#msmOK button").focus();
            $(".background").visible(1);
        }
        ,
        by: function (options) {
            var result = "<div class='background' id='backgroundAux'></div>" +
                    "<div id='by'>" +
                    "<div class='centrar negrilla'>SISTEMA DE LABORATORIOS UNIDOS \"LABUN\"</div>" +
                    "<div  style='margin-right: 19px; width: 100px; padding-top: 13px; float: left;'>" +
                    "<img src='IMAGENES/logo.png' alt=''/>" +
                    "</div>" +
                    "<div style='width: 250px; float: left;'>" +
                    "<span class='negrillaenter'>Hecho Por:</span>" +
                    "Ing. Williams Armando Montenegro Mansilla" +
                    "<span class='negrillaenter'>Telefono: </span>" +
                    "3251551 - 75685675" +
                    "<span class='negrillaenter'>Correo: </span>" +
                    "WdigitalSolution02@gmail.com" +
                    "</div>" +
                    "<span class='negrilla point' style='position: absolute; top: 4px; right: 6px;' onclick='cerrarBy()'>(x)</span>"
            "</div>";
            $(this).append(result);
            $("#by").visible(1);
            $("#by").centrar();
            $(".background").visible(1);
        }
        ,
        validar: function () {
            this.each(function () {
                var $this = $(this);
                var typ = $this.attr("type");
                switch (typ) {
                    case "text":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }
                            });
                        });
                        break;
                    case "number":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }

                            });
                        });
                        break;
                    case "email":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var expresion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                                var valor = $this.val();
                                if (!expresion.test(valor)) {
                                    $this.css({"background-color": "#e44e2d"});
                                    $this.next().text($this.next().data("acro") + " electronico invalido");
                                } else {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                }
                            });
                        });
                        break;
                    case "password":
                        $this.focus(function () {
                            $this.keyup(function () {
                                var min = parseInt($this.data("min"));
                                var max = parseInt($this.data("max"));
                                var valor = $this.val().length;
                                if (valor >= min && valor <= max) {
                                    $this.css({"background-color": "#00ff00"});
                                    $this.next().text("");
                                } else {
                                    $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                                    $this.css({"background-color": "#e44e2d"});
                                }
                            });
                        });
                        break;
                }
            });
        },
        validarActualizar: function () {
            this.each(function () {
                var $this = $(this);
                var typ = $this.attr("type");

                switch (typ) {
                    case "text":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                    case "number":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (isNaN($this.val())) {
                            $this.next().text($this.next().data("acro") + " debe ser de tipo numerico");
                            $this.css({"background-color": "#e44e2d"});
                            return;
                        }
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                    case "email":
                        var expresion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                        var valor = $this.val();
                        if (!expresion.test(valor)) {
                            $this.css({"background-color": "#e44e2d"});
                            $this.next().text($this.next().data("acro") + " electronico es invalido");
                        } else {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        }
                        break;
                    case "password":
                        var min = parseInt($this.data("min"));
                        var max = parseInt($this.data("max"));
                        var valor = $this.val().length;
                        if (valor >= min && valor <= max) {
                            $this.css({"background-color": "#00ff00"});
                            $this.next().text("");
                        } else {
                            $this.next().text($this.next().data("acro") + " debe tener como minimo " + min + " caracteres y maximo " + max);
                            $this.css({"background-color": "#e44e2d"});
                        }
                        break;
                }
            });
        }
    });
})(jQuery);
$(document).ready(function () {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié;', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
    };
    $.datepicker.setDefaults($.datepicker.regional["es"]);
});
function validar(tipo, texto) {
    texto = texto.trim();
    switch (tipo) {
        case "texto":
            var expresion = /^[a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
            if (expresion.exec(texto + " ")) {
                return true;
            }
            break;
        case "correo":
            var expresion = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (expresion.test(texto))
                return true;
            break;
        case "cuenta":
            if (texto.length >= 4 && texto.length <= 8) {
                var expresion = /^[0-9a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
                if (expresion.exec(texto + " ")) {
                    return true;
                }
            }
            break;
        case "entero":
            var expresion = /^[0-9\s]+$/;
            if (expresion.exec(texto)) {
                return true;
            }
            break;
        case "decimal":
            var expresion = /^\d+(\.\d{1,2})?/;
            if (expresion.exec(texto)) {
                return true;
            }
            break;
        case "texto y entero":
            var expresion = /^[0-9a-zA-Z\.\,\s-_º()=?¿/%$@!:;{}óíáéúñÍÁÉÚÓ]+$/;
            if (expresion.exec(texto + " ")) {
                return true;
            }
            break;
    }
    return false;
}
function ok() {
    $("#backgroundAux").remove();
    $(".background").ocultar();
    $("#msmOK").remove();
}
function cerrarBy() {
    $("#backgroundAux").remove();
    $(".background").ocultar();
    $("#by").remove();
}
function horaActual() {
    var f = new Date();
    var hora = f.getHours();
    var min = f.getMinutes();
    var seg = f.getSeconds();
    hora = hora < 10 ? "0" + hora : hora;
    min = min < 10 ? "0" + min : min;
    seg = seg < 10 ? "0" + seg : seg;
    return hora + ":" + min + ":" + seg;
}
function fechaActual() {

    var f = new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var ano = f.getFullYear();
    dia = dia < 10 ? "0" + dia : dia;
    mes = mes < 10 ? "0" + mes : mes;
    return dia + "/" + mes + "/" + ano;
}
function fechaActualReporte() {
    var f = new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var ano = f.getFullYear();
    dia = dia < 10 ? "0" + dia : dia;
    mes = mes < 10 ? "0" + mes : mes;
    return dia + "-" + mes + "-" + ano;
}
var imagenAModificar;
function cargarImagen(input, tipo) {
    if (tipo === 1 || tipo === "1") {
        imagenAModificar = $(input);
        $("body").append("<input type='file' onchange='cargarImagen(this,2)' id='fotocargar' style='display: none;' accept='.jpg, .jpeg, .png'/><canvas id='canvas' style='display: none;'></canvas>");
        $('#fotocargar').click();
        return;
    }
    if (input.files && input.files[0]) {
        cargando(true);
        var reader = new FileReader();
        reader.onload = function (e) {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(img, 0, 0, this.width, this.height);
                imagenAModificar.attr("src", canvas.toDataURL(input.files[0].type));
                cargando(false);
                $("#fotocargar").remove();
                $("#canvas").remove();
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function tuplaSeleccionada(tabla) {
    var seleccionado = "";
    var lista = $("#" + tabla + " tbody tr");
    for (var i = 0; i < lista.length; i++) {
        if ($(lista[i]).css("background-color") === "rgb(23, 181, 102)") {
            $("#" + tabla + " tbody tr").css("background", "none");
            seleccionado = $(lista[i]);
            break;
        }
    }
    return seleccionado;
}
/*importa
 * 
 * <script src="Script/Plugin/tableExport.min.js" type="text/javascript"></script>
 <script src="Script/Plugin/tableExport.min.js" type="text/javascript"></script>
 */
function exportarExcel(tabla, titulo) {
    cargando(true);
    var lista = $("#" + tabla).find("tr");
    var elemento = "<table id='tablaExcel'><thead>";
    for (var i = 0; i < lista.length; i++) {
        if ($(lista[i]).css("display") === "none")
            continue;
        var tr = $(lista[i]).find("div");
        elemento += "<tr>";
        for (var j = 0; j < tr.length; j++) {
            var ele = $(tr[j]).children();
            var texto = "";
            if (ele.is('input')) {
                texto = ele.val();
            }
            if (ele.is('select')) {
                texto = ele.find("option:selected").text();
            }
            if (texto === "") {
                texto = $(tr[j]).text();
            }
            if (texto.indexOf(",") >= 0) {
                texto = texto.replace(/\./g, '').replace(/\,/g, '.');
            }
            if (i === 0) {
                elemento += "<th>" + texto + "</th>";
            } else {
                elemento += "<td>" + texto + "</td>";
            }
        }
        elemento += "</tr>";
        if (i === 0) {
            elemento += "</thead><tboddy>";
        }
    }
    elemento += "</tboddy></table>";
    $("body").append(elemento);
    cargando(false);
    $('#tablaExcel').tableExport({type: 'xls', fileName: titulo});
    $("#tablaExcel").remove();
}
function cargando(estado) {
    if (estado) {
        var elemento = "<div  id='cargando' style='z-index: 2;'>"
                + "<div>"
                + "<img src='" + imagenCargando + "' title='CARGANDO'/>"
                + "<span class='negrillaenter centrar'>CARGANDO</span>"
                + "</div>";
        +"</div>";
        $("body").append(elemento);
    } else {
        $("#cargando").remove();
    }
}
var openRequest;
function inicializarBaseDatos() {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Su Navegador no soporta el sistema. Actualicelo.");
        return;
    }
    openRequest = indexedDB.open("tiotito", 1);
    openRequest.onupgradeneeded = function (e) {
        var thisDB = e.target.result;
        if (!thisDB.objectStoreNames.contains("")) {
            var version = thisDB.createObjectStore("version", {keyPath: "version"});
            var versionIndex = version.createIndex("version", "version", {unique: true});
            version.put({version: "versioncliente", nro: 0, datos: {}});
            version.put({version: "versionmarca", nro: 0, datos: {}});
            version.put({version: "versionlinea", nro: 0, datos: {}});
            version.put({version: "versioncategoria", nro: 0, datos: {}});
            version.put({version: "versionproducto", nro: 0, datos: {}});
        }
    };
    cargando(true);
    openRequest.onsuccess = function () {
        var db = openRequest.result;
        var tx = db.transaction('version', "readonly");
        var store = tx.objectStore('version');
        var index = store.index('version');
        var requestCliente = index.get('versioncliente');
        var requestLinea = index.get('versionlinea');
        var requestCategoria = index.get('versioncategoria');
        var requestProducto = index.get('versionproducto');
        var requestMarca = index.get('versionmarca');
        requestCliente.onsuccess = function () {
            var dataSet = requestCliente.result;
            versionCliente = dataSet.nro;
            listaCliente = dataSet.datos;
            requestLinea.onsuccess = function () {
                var dataSet = requestLinea.result;
                versionLinea = dataSet.nro;
                listaLinea = dataSet.datos;
                requestCategoria.onsuccess = function () {
                    var dataSet = requestCategoria.result;
                    versionCategoria = dataSet.nro;
                    listaCategoria = dataSet.datos;
                    requestProducto.onsuccess = function () {
                        var dataSet = requestProducto.result;
                        versionProducto = dataSet.nro;
                        listaProducto = dataSet.datos;
                        requestMarca.onsuccess = function () {
                            var dataSet = requestMarca.result;
                            versionMarca = dataSet.nro;
                            listaMarca = dataSet.datos;
                            cargando(false);
                            Version();
                        };
                    };
                };
            };
        };
    };
}
var nroresetversion = 0;
function Version() {
    cargando(true);
    $.get(url, {proceso: "version", versionCliente: versionCliente, versionMarca: versionMarca, versionLinea: versionLinea, versionCategoria: versionCategoria, versionProducto: versionProducto}, function (response) {
        cargando(false);
        if ("-1" === response) {
            var db = openRequest.result;
            var tx = db.transaction("version", "readwrite");
            var store = tx.objectStore("version");
            var guardar = {version: "versioncliente", nro: 0, datos: {}};
            store.put(guardar);
            var guardar = {version: "versionmarca", nro: 0, datos: {}};
            store.put(guardar);
            var guardar = {version: "versionlinea", nro: 0, datos: {}};
            store.put(guardar);
            var guardar = {version: "versionproducto", nro: 0, datos: {}};
            store.put(guardar);
            var guardar = {version: "versioncategoria", nro: 0, datos: {}};
            store.put(guardar);
            alert("Se produjo un error. Vuelva a logearse Por favor.");
            window.location.href = "Index.php";
            return;
        }
        var json = $.parseJSON(response);
        var cliente = json.cliente;
        if (cliente !== null) {
            for (var i = 0; i < cliente.length; i++) {
                listaCliente["c" + cliente[i].id_cliente] = cliente[i];
                if (parseInt(cliente[i].version) > versionCliente) {
                    versionCliente = parseInt(cliente[i].version);
                }
            }
        }
        var marca = json.marca;
        if (marca !== null) {
            for (var i = 0; i < marca.length; i++) {
                listaMarca["m" + marca[i].codigo] = marca[i];
                var aux = parseInt(marca[i].idlinea);
                if (aux > versionMarca) {
                    versionMarca = aux;
                }
            }
        }
        var categoria = json.categoria;
        if (categoria !== null) {
            for (var i = 0; i < categoria.length; i++) {
                listaCategoria["c" + categoria[i].codigo] = categoria[i];
                var aux = parseInt(categoria[i].idlinea);
                if (aux > versionCategoria) {
                    versionCategoria = aux;
                }
            }
        }
        var producto = json.producto;
        if (producto !== null) {
            for (var i = 0; i < producto.length; i++) {
                listaProducto["p" + producto[i].id_producto] = producto[i];
                versionProducto = parseInt(producto[i].version);
            }
        }
        var linea = json.linea;
        if (linea !== null) {
            for (var i = 0; i < linea.length; i++) {
                listaLinea["l" + linea[i].codigo] = linea[i];
                var aux = parseInt(linea[i].idlinea);
                if (aux > versionLinea) {
                    versionLinea = aux;
                }
            }
        }
        cargando(true);
        var db = openRequest.result;
        var tx = db.transaction("version", "readwrite");
        var store = tx.objectStore("version");
        var guardar = {version: "versioncliente", nro: versionCliente, datos: listaCliente};
        var update = store.put(guardar);
        update.onsuccess = function () {
            var guardar = {version: "versionmarca", nro: versionMarca, datos: listaMarca};
            var update = store.put(guardar);
            update.onsuccess = function () {
                var guardar = {version: "versionlinea", nro: versionLinea, datos: listaLinea};
                var update = store.put(guardar);
                update.onsuccess = function () {
                    var guardar = {version: "versionproducto", nro: versionProducto, datos: listaProducto};
                    var update = store.put(guardar);
                    update.onsuccess = function () {
                        var guardar = {version: "versioncategoria", nro: versionCategoria, datos: listaCategoria};
                        var update = store.put(guardar);
                        update.onsuccess = function () {
                            cargando(false);
                            if ($("iframe").attr("src") !== "") {
                                $("iframe").contents().find("#actualizar").click();
                                return;
                            }
                            iniciarPortal();
                        };
                    };
                };
            };
        };
    });
}
function variables(formulario) {
    var result = {};
    var input = $(formulario).find("input");
    for (var i = 0; i < input.length; i++) {
        var nombre = $(input[i]).attr("name");
        var valor = $(input[i]).val().replace(/\"/g, '').replace(/\'/g, '').trim();

        result[nombre] = valor
    }
    var select = $(formulario).find("select");
    for (var i = 0; i < select.length; i++) {
        var nombre = $(select[i]).attr("id");
        var valor = $(select[i]).find(" option:selected").val();
        result[nombre] = valor;
    }
    var textarea = $(formulario).find("textarea");
    for (var i = 0; i < textarea.length; i++) {
        var nombre = $(textarea[i]).attr("id");
        var valor = $(textarea[i]).val();
        result[nombre] = valor.replace(/\"/g, '').replace(/\'/g, '').trim();
    }
    return result;
}
function queryString(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
function format(input) {
    var decimal = parseFloat(input).toFixed(2).split(".");
    var num = decimal[0].replace(/\./g, '');
    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    num = num.split('').reverse().join('').replace(/^[\.]/, '');
    return num + "," + decimal[1];
}
function decimalAdjust(type, value, exp) {//type=round ,floor, ceil   exp=en negativo cantidad desimales q see requiere
    var num = theform.original.value, rounded = theform.rounded
    var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    rounded.value = with2Decimals
}
function selectText(ele){
    $(ele).select();
}