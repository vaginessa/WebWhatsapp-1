<?php
class telefonoempresa {
	var $Empresa_id;
	var $telefono;
	var $nombre;
	var $relacion;
	var $correo;
	var $CON;
	function telefonoempresa($con) {
		$this->CON=$con;
	}

	function contructor($Empresa_id, $telefono, $nombre, $relacion, $correo){
		$this->Empresa_id = $Empresa_id;
		$this->telefono = $telefono;
		$this->nombre = $nombre;
		$this->relacion = $relacion;
		$this->correo = $correo;
	}

	function rellenar($resultado){
		if ($resultado->num_rows > 0) {
			$lista=array();
			while($row = $resultado->fetch_assoc()) {
				$telefonoempresa=array();
				$telefonoempresa["Empresa_id"]=$row['Empresa_id']==null?"":$row['Empresa_id'];
				$telefonoempresa["telefono"]=$row['telefono']==null?"":$row['telefono'];
				$telefonoempresa["nombre"]=$row['nombre']==null?"":$row['nombre'];
				$telefonoempresa["relacion"]=$row['relacion']==null?"":$row['relacion'];
				$telefonoempresa["correo"]=$row['correo']==null?"":$row['correo'];
				$lista[]=$telefonoempresa;
			}
			return $lista;
		}else{
			return null;
		}
	}

	function todo(){
		$consulta="select * from whatsapp.telefonoempresa";
		$result=$this->CON->consulta($consulta);
		return $this->rellenar($result);
	}

	function insertar(){
		$consulta="insert into whatsapp.telefonoempresa(Empresa_id, telefono, nombre, relacion, correo) values(".$this->Empresa_id.",'".$this->telefono."','".$this->nombre."','".$this->relacion."','".$this->correo."')";
		$resultado = $this->CON->manipular($consulta);
		if(!$resultado){
			return false;
		}
		$consulta = "SELECT LAST_INSERT_ID() as id";
		$resultado = $this->CON->consulta($consulta);
		$this->id_usuario=$resultado->fetch_assoc()['id'];
		return true;
	}

}
