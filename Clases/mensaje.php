<?php

class mensaje {

    var $idmensaje;
    var $mensaje;
    var $nroTelefono;
    var $hora;
    var $campana_id;
    var $respuesta;
    var $CON;

    function mensaje($con) {
        $this->CON = $con;
    }

    function contructor($idmensaje, $mensaje, $nroTelefono, $hora, $campana_id, $respuesta) {
        $this->idmensaje = $idmensaje;
        $this->mensaje = $mensaje;
        $this->nroTelefono = $nroTelefono;
        $this->hora = $hora;
        $this->campana_id = $campana_id;
        $this->respuesta = $respuesta;
    }

    

    function buscarXcampana($idcampa) {
        $consulta = "select nroTelefono,respuesta,hora,idmensaje from whatsapp.mensaje where campana_id=$idcampa";
        return $this->CON->consulta2($consulta);
    }

    function buscarXID($id) {
        $consulta = "select * from whatsapp.mensaje where anuncio_id=$id";
        $result = $this->CON->consulta($consulta);
        $mensaje = $this->rellenar($result);
        if ($mensaje == null) {
            return null;
        }
        return $mensaje[0];
    }
    function resumenMensual($idemp,$ano,$mes) {
        $consulta = "select respuesta,count(*) as cant";
        $consulta .= " FROM whatsapp.campana c, whatsapp.mensaje m";
        $consulta .= " where Empresa_id=$idemp and c.idcampana=m.campana_id";
        $consulta .= " 	 and year(str_to_date(c.fecha, '%d/%m/%Y'))=$ano";
        $consulta .= "   and month(str_to_date(c.fecha, '%d/%m/%Y'))=$mes";
        $consulta .= " group by respuesta";
        return $this->CON->consulta2($consulta);
    }

    function modificar($anuncio_id) {
        $consulta = "update whatsapp.mensaje set idmensaje =" . $this->idmensaje . ", mensaje ='" . $this->mensaje . "', nroTelefono ='" . $this->nroTelefono . "', hora ='" . $this->hora . "', campana_id =" . $this->campana_id . ", respuesta ='" . $this->respuesta . "' where anuncio_id=" . $anuncio_id;
        return $this->CON->manipular($consulta);
    }

    function eliminar($anuncio_id) {
        $consulta = "delete from whatsapp.mensaje where anuncio_id=" . $anuncio_id;
        return $this->CON->manipular($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.mensaje(mensaje, nroTelefono, hora, campana_id, respuesta) values('" . $this->mensaje . "','" . $this->nroTelefono . "','" . $this->hora . "'," . $this->campana_id . ",'" . $this->respuesta . "')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        return true;
    }

}
