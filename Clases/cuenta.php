<?php

class cuenta {

    var $id_cuenta;
    var $cuenta;
    var $contrasena;
    var $telefono;
    var $nombre;
    var $estado;
    var $empresa_id;
    var $CON;

    function cuenta($con) {
        $this->CON = $con;
    }

    function contructor($id_cuenta, $cuenta, $contrasena, $telefono, $nombre, $estado, $empresa_id) {
        $this->id_cuenta = $id_cuenta;
        $this->cuenta = $cuenta;
        $this->contrasena = $contrasena;
        $this->telefono = $telefono;
        $this->nombre = $nombre;
        $this->estado = $estado;
        $this->empresa_id = $empresa_id;
    }

    function ExisteUsuario($cuenta,$contra) {
        $consulta = "select * from whatsapp.cuenta where cuenta='$cuenta' and contrasena=md5('$contra')";
        return  $this->CON->consulta2($consulta);
    }
    function campanaGeneradaXcuenta($idemp) {
        $consulta .= "SELECT nombre,count(*) as cant";
        $consulta .= " FROM whatsapp.cuenta c, whatsapp.campana ca";
        $consulta .= " where c.empresa_id=$idemp and c.id_cuenta=ca.cuenta_id";
        $consulta .= " group by nombre ";
        $consulta .= " having count(*)>0 ";
        return  $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.cuenta(id_cuenta, cuenta, contrasena, telefono, nombre, estado, empresa_id) values(" . $this->id_cuenta . ",'" . $this->cuenta . "','" . $this->contrasena . "','" . $this->telefono . "','" . $this->nombre . "','" . $this->estado . "'," . $this->empresa_id . ")";
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
