<?php

class datovariable {

    var $variables_id;
    var $dato;
    var $posicion;
    var $CON;

    function datovariable($con) {
        $this->CON = $con;
    }

    function contructor($variables_id, $dato, $posicion) {
        $this->variables_id = $variables_id;
        $this->posicion = $posicion;
        $this->dato = $dato;
    }

    function buscarXcampana($idcampana) {
        $consulta .= " select d.dato,d.posicion,v.apodo";
        $consulta .= " from whatsapp.datovariable d,whatsapp.variables v ";
        $consulta .= " where v.campana_id=$idcampana and v.idVariable=d.variables_id ";
        $consulta .= " order by posicion asc";
        return $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.datovariable(variables_id, dato,posicion) values(" . $this->variables_id . ",'" . $this->dato . "'," . $this->posicion . ")";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        return true;
    }

}
