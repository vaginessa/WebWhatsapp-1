<?php

include_once "../Libreria/variables.php";



if ($proceso === "BuscarQR") {
    $AccionCampana = new AccionCampana($con);
    $resultado = $AccionCampana->obtenerQR($idcampana);
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

if ($proceso === "actualizarCampana") {
    $con->transacion();
    $campana2 = new campana($con);
    $fechaactual = date("d/m/Y H:i:s");
    $campana2->contructor($idcampana, $campana, $fechaactual, $mensaje, 0, $foto, 0, $sessionUsuario["id_cuenta"], $telefono);
    if (!$campana2->modificar()) {
        $error = "No se logro modificar la campaña.Intente nuevamente.";
    } else {
        $lista = $_POST["listamensaje"];
        for ($i = 0; $i < count($lista); $i++) {
            $mensaje = new mensaje($con);
            $id = $lista[$i]["id"];
            $msn = $lista[$i]["mensaje"];
            $telf = $lista[$i]["telefono"];
            if (!$mensaje->modificar($id, $msn,$telf)) {
                $error = "No se logro modificar la campaña.Intente nuevamente.";
                break;
            }
        }
        if ($error === "") {
            $con->commit();
        } else {
            $con->rollback();
        }
    }
}

$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo $_GET['callback'] . json_encode($reponse);
} else {
    echo $_POST['callback'] . json_encode($reponse);
}


