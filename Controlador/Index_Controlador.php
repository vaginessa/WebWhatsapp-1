<?php

$sinconeccion = true;
include_once "../Libreria/variables.php";
if ($proceso === "Logear") {
    $cuenta1=new cuenta($con);
    $cuenta1=$cuenta1->ExisteUsuario($cuenta,$contra);
    if(count($cuenta1)>0){
        $resultado=$cuenta1[0];
        if($resultado["estado"]==="ACTIVO"){
            $_SESSION["usuario"]=$resultado;
        }else{
            $error="La cuenta se encuentra bloqueada. Contactese con el administrador.";
        }
    }else{
        $error="La cuenta o contraseña puede estar mal ingresada.";
    }
}
$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo $_GET['callback'] . json_encode($reponse);
} else {
    echo $_POST['callback'] . json_encode($reponse);
}


