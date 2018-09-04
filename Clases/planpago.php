<?php

class planpago {

    var $idplanPago;
    var $detalle;
    var $extra;
    var $precio;
    var $estado;
    var $cantMensaje;
    var $costoTotal;
    var $CON;

    function planpago($con) {
        $this->CON = $con;
    }

    function contructor($idplanPago, $detalle, $extra, $precio, $estado, $cantMensaje,$costoTotal) {
        $this->idplanPago = $idplanPago;
        $this->detalle = $detalle;
        $this->extra = $extra;
        $this->precio = $precio;
        $this->estado = $estado;
        $this->cantMensaje = $cantMensaje;
        $this->costoTotal = $costoTotal;
    }

    function buscarXempresa($idemp) {
        $consulta = " SELECT p.*";
        $consulta .= " FROM  whatsapp.planpago p , whatsapp.empresaplan e";
        $consulta .= " where p.idplanPago=e.planPago_id and e.empresa_id=$idemp";
        $consulta .= " 	  and if((e.fechaHasta is null), (now()>=str_to_date(e.fechaDe, '%d/%m/%Y')),";
        $consulta .= " 	  (now() between str_to_date(e.fechaDe, '%d/%m/%Y') and str_to_date(e.fechaHasta, '%d/%m/%Y')))";
        return $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.planpago(idplanPago, detalle, extra, precio, estado, cantMensaje) values(" . $this->idplanPago . ",'" . $this->detalle . "'," . $this->extra . "," . $this->precio . ",'" . $this->estado . "'," . $this->cantMensaje . ")";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->id_usuario = $resultado->fetch_assoc()['id'];
        return true;
    }

}
