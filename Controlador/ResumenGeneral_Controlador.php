<?php

include_once "../Libreria/variables.php";
if ($proceso === "iniciar") {
    $campana=new campana($con);
    $resultado=$campana->antiguedadEmpresaXAno($sessionUsuario["empresa_id"]);
}
if ($proceso === "verResumen") {
    $mensaje=new mensaje($con);
    $cuenta=new cuenta($con);
    $plan=new planpago($con);
    $resultado=array();
    $resultado["mensaje"]=$mensaje->resumenMensual($sessionUsuario["empresa_id"],$ano,$mes);
    $resultado["cuentas"]=$cuenta->campanaGeneradaXcuenta($sessionUsuario["empresa_id"]);
    $resultado["plan"]=$plan->buscarXempresa($sessionUsuario["empresa_id"]);// como espor fecha esta hay que adaptarlo para saber la fecha
}
$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo $_GET['callback'] . json_encode($reponse);
} else {
    echo $_POST['callback'] . json_encode($reponse);
}


