<?php

class campana {

    var $idcampana;
    var $detalle;
    var $fecha;
    var $mensaje;
    var $Empresa_id;
    var $arte;
    var $usuario_id;
    var $cuenta_id;
    var $varTelefono;
    var $CON;

    function campana($con) {
        $this->CON = $con;
    }

    function contructor($idcampana, $detalle, $fecha, $mensaje, $Empresa_id, $arte, $usuario_id, $cuenta_id,$varTelefono) {
        $this->idcampana = $idcampana;
        $this->detalle = $detalle;
        $this->fecha = $fecha;
        $this->mensaje = $mensaje;
        $this->Empresa_id = $Empresa_id;
        $this->arte = $arte;
        $this->usuario_id = $usuario_id;
        $this->cuenta_id = $cuenta_id;
        $this->varTelefono = $varTelefono;
    }

    

    function buscarXid($idcamp) {
        $consulta = "select *,if(year(str_to_date(fecha, '%d/%m/%Y'))=year(now()) and month(str_to_date(fecha, '%d/%m/%Y'))=month(now()),1,0) estado from whatsapp.campana where idcampana=$idcamp";
        return $this->CON->consulta2($consulta)[0];
    }
    function buscarXFecha($idemp,$de,$hasta) {
        $consulta = " select c1.idcampana,SUBSTRING(fecha, 1, 10) fecha,c1.detalle,(select nombre from whatsapp.cuenta where id_cuenta=c1.cuenta_id) nombre,";
	$consulta .= "	(select count(*) FROM whatsapp.campana c, whatsapp.mensaje m where c.idcampana=m.campana_id and c.idcampana=c1.idcampana and m.respuesta='ESPERA') espera,";
	$consulta .= "	(select count(*) FROM whatsapp.campana c, whatsapp.mensaje m where c.idcampana=m.campana_id and c.idcampana=c1.idcampana and m.respuesta='TELEFONO MAL') telefonoMal,";
        $consulta .= "	(select count(*) FROM whatsapp.campana c, whatsapp.mensaje m where c.idcampana=m.campana_id and c.idcampana=c1.idcampana and m.respuesta='BLOQUEADO') bloqueado,";
        $consulta .= "	(select count(*) FROM whatsapp.campana c, whatsapp.mensaje m where c.idcampana=m.campana_id and c.idcampana=c1.idcampana and m.respuesta='ENVIADO') enviado,";
        $consulta .= "	(select count(*) FROM whatsapp.campana c, whatsapp.mensaje m where c.idcampana=m.campana_id and c.idcampana=c1.idcampana and m.respuesta='NOTIENE') notiene";
        $consulta .= "	from  whatsapp.campana c1";
        $consulta .= "	where str_to_date(c1.fecha, '%d/%m/%Y')  between";
        $consulta .= "	      str_to_date('$de', '%d/%m/%Y') and";
        $consulta .= "	      str_to_date('$hasta', '%d/%m/%Y')";
        $consulta .= "	      and c1.Empresa_id=$idemp";
        $consulta .= "	      order by c1.idcampana desc";
        return $this->CON->consulta2($consulta);
        
    }
    function antiguedadEmpresaXAno($idemp) {
        $consulta = "SELECT year(str_to_date(fecha, '%d/%m/%Y')) ANO";
        $consulta .= " FROM whatsapp.campana";
        $consulta .= " WHERE Empresa_id=$idemp";
        $consulta .= " GROUP BY year(str_to_date(fecha, '%d/%m/%Y'))";
        $consulta .= " order by year(str_to_date(fecha, '%d/%m/%Y')) desc";
        return $this->CON->consulta2($consulta);
    }

    function insertar() {
        $consulta = "insert into whatsapp.campana(detalle, fecha, mensaje, Empresa_id, arte, cuenta_id,varTelefono) values('" . $this->detalle . "','" . $this->fecha . "','" . $this->mensaje . "'," . $this->Empresa_id . ",'" . $this->arte . "'," . $this->cuenta_id . ",'" . $this->varTelefono . "')";
        $resultado = $this->CON->manipular($consulta);
        if (!$resultado) {
            return false;
        }
        $consulta = "SELECT LAST_INSERT_ID() as id";
        $resultado = $this->CON->consulta($consulta);
        $this->idcampana = $resultado->fetch_assoc()['id'];
        return true;
    }
    function modificar() {
        $consulta = "update whatsapp.campana set detalle='$this->detalle', fecha='$this->fecha', mensaje='$this->mensaje', arte='$this->arte', cuenta_id=$this->cuenta_id,varTelefono='$this->varTelefono' where idcampana=$this->idcampana";
        return $this->CON->manipular($consulta);
    }

}
