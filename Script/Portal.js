var url = 'Controlador/Portal_Controlador.php';

$(document).ready(function () {
    var usuarioLocal = localStorage.getItem("usuario");
    if (usuarioLocal === null) {
        cerrarSession(1);
    }
    localStorage.setItem("campana", 0);
    usuarioLocal=$.parseJSON(usuarioLocal);
    $("#Nombreusuario").html(usuarioLocal.nombre);
});
function redireccionar(url) {
    $("iframe").attr("src", url);
}
function cerrarSession(tipo) {
    localStorage.removeItem("usuario");
    if (tipo === 1) {
        window.location = "index.php";
    } else {
        window.location = "../index.php";
    }
}
