var url = 'Controlador/Index_Controlador.php';
imagenCargando = "img/cargando.gif";
$(document).ready(function () {
    localStorage.removeItem("usuario");
    localStorage.setItem("campana", 0);
});
function logear(e){
    if(e==="" || e.keyCode===13){
        var json1=variables('#CuerpoLogin');
    json1.proceso="Logear";
    cargando(true);
    $.get(url, json1, function (response) {
        cargando(false);
        var json = $.parseJSON(response);
        if (json.error.length > 0) {
            $("body").msmOK(json.error);
        } else {
            localStorage.setItem("usuario", JSON.stringify(json.result));
            window.location.href="Portal.php";
        }
    });
    }
    
}
