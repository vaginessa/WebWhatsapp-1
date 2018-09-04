<?php
error_reporting(0);
include_once "CONN.php";
include_once "../Clases/campana.php";
include_once "../Clases/cuenta.php";
include_once "../Clases/datovariable.php";
include_once "../Clases/empresa.php";
include_once "../Clases/mensaje.php";
include_once "../Clases/planpago.php";
include_once "../Clases/telefonoempresa.php";
include_once "../Clases/usuario.php";
include_once "../Clases/variables.php";
include_once "../Clases/AccionCampana.php";
include_once "../Clases/HistoricoCampana.php";


$error = "";
$resultado = "";
session_start();
$con = new CONN();
if (!$con->estado) {
    $error = "No se pudo acceder a la base de datos. Intente mas tarde o contactese con el administrador.";
    $reponse = array("error" => $error, "result" => $resultado);
        return;
}
if (!$sinconeccion) {
    $sessionUsuario = $_SESSION["usuario"];
    if ($sessionUsuario == null) {
        $error = "Error Session";
        $proceso = "Error Session";
        $reponse = array("error" => $error, "result" => $resultado);
        return;
    }
}


foreach ($_POST as $nombre_campo => $valor) {
    $asignacion = "\$" . $nombre_campo . "='" . $valor . "';";
    eval($asignacion);
}
foreach ($_GET as $nombre_campo => $valor) {
    $asignacion = "\$" . $nombre_campo . "='" . $valor . "';";
    eval($asignacion);
}

