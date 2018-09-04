<?php

include_once "../Libreria/variables.php";


if ($proceso === "qr") {
    $AccionCampana = new AccionCampana($con);
    $fechaactual = date("d/m/Y H:i:s");
    if (!$AccionCampana->modificar($idcampana, $estado, $fechaactual)) {
        $error = "No se logro generar el codigo QR. Intente Nuevamente.";
    } else {
        $HistoricoCampana = new HistoricoCampana($con);
        $HistoricoCampana->contructor(0, $idcampana, "Cambio estado de campaña", $estado, $fechaactual, $sessionUsuario["id_cuenta"]);
        if (!$HistoricoCampana->insertar()) {
            $error = "No se logro registrar la campaña.";
        }
    }
}
if ($proceso === "estadoActual") {
    $AccionCampana = new AccionCampana($con);
    $resultado = $AccionCampana->obtenerEstadoActual($idcampana, $tengoQR);
}
if ($proceso === "detenerCampana") {
    $AccionCampana = new AccionCampana($con);
    $fechaactual = date("d/m/Y H:i:s");
    $AccionCampana->modificar($idcampana, "INACTIVO", $fechaactual);
    $HistoricoCampana = new HistoricoCampana($con);
    $HistoricoCampana->contructor(0, $idcampana, "Cambio estado de campaña", "INACTIVO", $fechaactual, $sessionUsuario["id_cuenta"]);
    if (!$HistoricoCampana->insertar()) {
        $error = "No se logro registrar la campaña.";
    }
}
if ($proceso === "iniciar") {
    $campana = new campana($con);
    $variable = new variables($con);
    $mensaje = new mensaje($con);
    $dato = new datovariable($con);
    $resultado = array();
    $AccionCampana = new AccionCampana($con);
    $AccionCampana->pausarOtrasCampanas();
    $resultado["campana"] = $campana->buscarXid($idcampana);
    $resultado["variable"] = $variable->buscarXcampana($idcampana);
    $resultado["mensaje"] = $mensaje->buscarXcampana($idcampana);
    $resultado["contactos"] = $dato->buscarXcampana($idcampana);
}
if ($proceso === "resultadoMensaje") {
    $mensaje = new mensaje($con);
    $resultado = $mensaje->buscarXcampana($idcampana);
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo $_GET['callback'] . json_encode($reponse);
} else {
    echo $_POST['callback'] . json_encode($reponse);
}


