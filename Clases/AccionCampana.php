<?php

class AccionCampana {

    var $campana_id;
    var $estado;
    var $actualizado;
    var $codigoQR;
    var $CON;

    function AccionCampana($con) {
        $this->CON = $con;
    }

    function contructor($campana_id, $estado, $actualizado) {
        $this->campana_id = $campana_id;
        $this->estado = $estado;
        $this->actualizado = $actualizado;
    }

    function insertar() {
        $consulta = "insert into whatsapp.AccionCampana(campana_id, estado,actualizado) values(" . $this->campana_id . ",'" . $this->estado . "','" . $this->actualizado . "')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        return true;
    }

    function modificar($idcampana, $estado, $fecha) {
        $consulta = "update whatsapp.AccionCampana set estado='$estado',actualizado='$fecha' where  campana_id=$idcampana";
        return $this->CON->manipular($consulta);
    }

    function obtenerEstadoActual($idcampana, $tengoQR) {
        $this->vencimientoQR(); // DESPUES QUITAR ESTO DE AQUI
        $estado = "if(estado='QR GENERADO',codigoQR,'')";
        if ($tengoQR === "1") {
            $estado = "''";
        }
        $consulta = "select estado, $estado qr from  whatsapp.accioncampana where  campana_id=$idcampana";
        return $this->CON->consulta2($consulta)[0];
    }
    function pausarOtrasCampanas($idcampana) {
        $consulta = " update whatsapp.accioncampana a,whatsapp.campana c set estado='INACTIVO' ";
        $consulta = " where c.Empresa_id in (select Empresa_id from whatsapp.campana where idcampana=$idcampana)";
        $consulta = " and c.idcampana=a.campana_id";
        return $this->CON->consulta2($consulta)[0];
    }

    function vencimientoQR() {
        $consulta = "update whatsapp.accioncampana set estado='INACTIVO'  where (estado='QR GENERADO' || estado='OBTENER QR') and DATE_ADD(str_to_date(actualizado, '%d/%m/%Y %H:%i:%s'), INTERVAL 20 SECOND) < now()";
        return $this->CON->manipular($consulta);
    }

}
