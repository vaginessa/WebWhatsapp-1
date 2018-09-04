var url = '../Controlador/ResumenGeneral_Controlador.php';

$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        cerrarSession(1);
    }
    usuarioLocal = $.parseJSON(usuarioLocal);
    $("#Nombreusuario").html(usuarioLocal.nombre);
    var f = new Date();
    var mes = f.getMonth() + 1;
    $("#mes option[value=" + mes + "]").prop("selected", true);
    cargando(true);
    $.get(url, {proceso: 'iniciar'}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession(2);
            }
            $("body").msmOK(json.error);
        } else {
            var html = "";
            var listaAnos = json.result;
            for (var i = 0; i < listaAnos.length; i++) {
                html += "<option value='" + listaAnos[i].ANO + "'>" + listaAnos[i].ANO + "</option>";
            }
            $("#ano").html(html);
            ver();
        }
    });
});
function ver() {
    var mes = $("#mes option:selected").val();
    var ano = $("#ano option:selected").val();
    cargando(true);
    $.get(url, {proceso: 'verResumen', ano: ano, mes: mes}, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            if ("Error Session" === json.error) {
                window.parent.cerrarSession(2);
            }
            $("body").msmOK(json.error);
        } else {
            var mensaje = json.result.mensaje;
            var enviado = 0;
            var bloqueado = 0;
            var notiene = 0;
            var telefonoMal = 0;
            var espera = 0;
            for (var i = 0; i < mensaje.length; i++) {
                var tipo = mensaje[i].respuesta;
                var cant = parseInt(mensaje[i].cant);
                if (tipo === "TELEFONO MAL") {
                    telefonoMal = cant;
                }
                if (tipo === "BLOQUEADO") {
                    bloqueado = cant;
                }
                if (tipo === "ENVIADO") {
                    enviado = cant;
                }
                if (tipo === "NOTIENE") {
                    notiene = cant;
                }
                if (tipo === "ESPERA") {
                    espera = cant;
                }
            }
            var total = bloqueado + enviado + notiene + telefonoMal + espera;
            $("input[name=msnBloqueados]").val(bloqueado);
            $("input[name=msnEntregados]").val(enviado);
            $("input[name=msnSnWp]").val(notiene);
            $("input[name=msnInext]").val(telefonoMal);
            $("input[name=msnEspera]").val(espera);
            $("input[name=msnTotal]").val(total);

            var cuentas = json.result.cuentas;
            var totalcant = 0;
            var html = "<div style='text-align: right; font-size: 13px;' class='negrilla'>Mens. Enviado</div>"
            for (var i = 0; i < cuentas.length; i++) {
                var nombre = cuentas[i].nombre;
                var cant = parseInt(cuentas[i].cant);
                totalcant += cant;
                html += "<span class='' style='margin-bottom: 3px; display:block;'>";
                html += nombre;
                html += "<input type='text' class='cuadroResultado' value='" + cant + "'/>";
                html += "</span>";
            }
            $("#contenedorCuenta").html(html);
            html = "<span class=''>";
            html += "    <input type='text' class='cuadroResultado' value='" + totalcant + "' name='msnTotal' readonly/>";
            html += "    <span class='negrilla separar alineacionDerecha ' style='margin-right: 9px; margin-top: 2px;'>Total</span>";
            html += "</span>";
            $("#contenedorCuenta").append(html);

            var cuentas = json.result.plan;
            if (cuentas.length === 0) {
                window.parent.cerrarSession(2);
            } else {
                cuentas = cuentas[0];
                $("input[name=cantMensaje]").val(cuentas.cantMensaje);
                $("input[name=costoXmensaje]").val(cuentas.precio);
                $("input[name=mensajeExtra]").val(cuentas.extra);
                $("input[name=totalPaquete]").val(cuentas.costoTotal);

                var cantidadPaquete = parseInt(cuentas.cantMensaje);
                var costototal = parseFloat(cuentas.costoTotal);
                var extra = parseFloat(cuentas.extra);
                $("input[name=msnutilizados]").val(enviado);
                if (cantidadPaquete >= enviado) {
                    $("input[name=msnextraUtilizado]").val(0);
                    $("input[name=inversion]").val(costototal);
                } else {
                    var msnExtra = enviado - cantidadPaquete;
                    var inversion = extra * msnExtra;
                    $("input[name=msnextraUtilizado]").val(msnExtra);
                    $("input[name=inversion]").val(inversion.toFixed(2));
                }
                graficaMsn();
            }
        }
    });
}
function graficaMsn() {
    var oilCanvas = document.getElementById("grafMsn");
    var msnTotal = parseInt($("input[name=msnTotal]").val());
    var msnEspera = (parseInt($("input[name=msnEspera]").val()) / msnTotal) * 100;
    var msnEntregados = (parseInt($("input[name=msnEntregados]").val()) / msnTotal) * 100;
    var msnBloqueados = (parseInt($("input[name=msnBloqueados]").val()) / msnTotal) * 100;
    var msnSnWp = (parseInt($("input[name=msnSnWp]").val()) / msnTotal) * 100;
    var msnInext = (parseInt($("input[name=msnInext]").val()) / msnTotal) * 100;

    var msnEsperaColor = $("input[name=msnEspera]").css("background-color");
    var msnBloqueadosColor = $("input[name=msnBloqueados]").css("background-color");
    var msnEntregadosColor = $("input[name=msnEntregados]").css("background-color");
    var msnSnWpColor = $("input[name=msnSnWp]").css("background-color");
    var msnInextColor = $("input[name=msnInext]").css("background-color");

    //Chart.defaults.global.animation.animateScale = true;
    var oilData = {
        labels: [
            "Msn Espera",
            "Msn Entregados",
            "Telf Bloqueados",
            "Telf Sin Whatsapp",
            "Telf Inexistente"
        ],
        datasets: [
            {
                data: [msnEspera.toFixed(2), msnEntregados.toFixed(2), msnBloqueados.toFixed(2), msnSnWp.toFixed(2), msnInext.toFixed(2)],
                backgroundColor: [msnEsperaColor, msnEntregadosColor, msnBloqueadosColor, msnSnWpColor, msnInextColor]
                , borderColor: ["#000000", "#000000", "#000000", "#000000", "#000000"]
                , borderWidth: [1, 1, 1, 1, 1]
            }]
    };

    var pieChart = new Chart(oilCanvas, {
        type: 'pie',
        data: oilData,
        
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }/*,
             tooltips: {
             callbacks: {
             label: function (tooltipItem) {
             return tooltipItem.yLabel;
             }
             }
             }*/
        }
    });
}