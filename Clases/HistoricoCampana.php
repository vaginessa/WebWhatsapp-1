<?php

class HistoricoCampana {

    var $id_HistoricoCampana;
    var $campana_id;
    var $detalle;
    var $fecha;
    var $tipo;
    var $cuenta_id;
    var $CON;

    function HistoricoCampana($con) {
        $this->CON = $con;
    }

    function contructor($id_HistoricoCampana,$campana_id, $detalle, $tipo, $fecha,$cuenta_id) {
        $this->id_HistoricoCampana= $id_HistoricoCampana;
        $this->campana_id = $campana_id;
        $this->detalle = $detalle;
        $this->fecha = $fecha;
        $this->tipo = $tipo;
        $this->cuenta_id = $cuenta_id;
    }

  

    function insertar() {
        $consulta = "insert into whatsapp.HistoricoCampana(campana_id, detalle,fecha,tipo,cuenta_id) values(" . $this->campana_id . ",'" . $this->detalle . "','" . $this->fecha . "','" . $this->tipo . "'," . $this->cuenta_id . ")";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
       
        return true;
    }

}
