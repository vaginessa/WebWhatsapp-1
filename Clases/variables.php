<?php

class variables {

    var $campana_id;
    var $nombre;
    var $apodo;
    var $idVariable;
    var $CON;

    function variables($con) {
        $this->CON = $con;
    }

    function contructor($campana_id, $nombre, $idVariable, $apodo) {
        $this->campana_id = $campana_id;
        $this->nombre = $nombre;
        $this->apodo = $apodo;
        $this->idVariable = $idVariable;
    }

    function buscarXcampana($idcamp) {
        $consulta = "select * from whatsapp.variables where campana_id=$idcamp";
        return $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.variables(campana_id, nombre,apodo) values(" . $this->campana_id . ",'" . $this->nombre . "','" . $this->apodo . "')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->idVariable = $resultado->fetch_assoc()['id'];
        return true;
    }

}
