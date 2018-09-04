<?php

include_once "../Libreria/variables.php";


if ($proceso === "generarReporte") {
    $campana = new campana($con);
    $resultado = $campana->buscarXFecha($sessionUsuario["empresa_id"], $de, $hasta);
}
if ($proceso === "registrarCampana") {
    $campana = new campana($con);
    $fechaactual = date("d/m/Y H:i:s");
    $con->transacion();
    $campana->contructor(0, $nombrecampana, $fechaactual, $mensaje, $sessionUsuario["empresa_id"], $img, 0, $sessionUsuario["id_cuenta"],$telefono);
    if (!$campana->insertar()) {
        $error = "No se logro registrar la campaña.";
    } else {
        $listamensaje = $_POST["listamensaje"];
        for ($i = 0; $i < count($listamensaje); $i++) {
            $mensajeobj = new mensaje($con);
            $msn = $listamensaje[$i]["mensaje"];
            $tel = $listamensaje[$i]["telefono"];
            $mensajeobj->contructor(0, $msn, $tel, '', $campana->idcampana, 'ESPERA');
            if (!$mensajeobj->insertar()) {
                $error = "No se logro registrar la campaña.";
                break;
            }
        }
        $listahead = $_POST["head"]; //aqui
        if ($error === "") {
            $AccionCampana=new AccionCampana($con);
            $AccionCampana->contructor($campana->idcampana, "INACTIVO", $fechaactual);
            if(!$AccionCampana->insertar()){
                $error = "No se logro registrar la campaña.";
            }
        }
        if ($error === "") {
            $HistoricoCampana=new HistoricoCampana($con);
            $HistoricoCampana->contructor(0, $campana->idcampana,"Se creo la campaña $nombrecampana", "CREACION", $fechaactual,$sessionUsuario["id_cuenta"]);
            if(!$HistoricoCampana->insertar()){
                $error = "No se logro registrar la campaña.";
            }
        }
        if ($error === "") {
            for ($i = 0; $i < count($listahead); $i++) {
                $variableObj = new variables($con);
                $nombre = $listahead[$i]["nombre"];
                $variable = $listahead[$i]["variable"];
                $variableObj->contructor($campana->idcampana, $nombre, 0, $variable);
                if (!$variableObj->insertar()) {
                    $error = "No se logro registrar la campaña.";
                    break;
                } else {
                    $listahead[$i]["id"] = $variableObj->idVariable;
                }
            }
        }
        
        if ($error === "") {
            $listadato = $_POST["dato"]; //aqui
            for ($i = 0; $i < count($listadato); $i++) {
                $datoVariable = new datovariable($con);
                $posicion = $listadato[$i]["posicion"];
                $dato = $listadato[$i]["dato"];
                $head = $listadato[$i]["head"];
                $idvariable=$listahead[$head];
                $datoVariable->contructor($idvariable["id"], $dato, $posicion);
                if (!$datoVariable->insertar()) {
                    $error = "No se logro registrar la campaña.";
                    break;
                } 
            }
        }
    }
    if ($error === "") {
        $con->commit();
    } else {
        $con->rollback();
    }
}
$con->closed();
$reponse = array("error" => $error, "result" => $resultado);
if (empty($_POST['proceso'])) {
    echo $_GET['callback'] . json_encode($reponse);
} else {
    echo $_POST['callback'] . json_encode($reponse);
}


