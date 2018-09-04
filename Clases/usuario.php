<?php
class usuario {
	var $idusuario;
	var $nombre;
	var $registrado;
	var $telefono;
	var $cuenta;
	var $contrasena;
	var $direccion;
	var $estado;
	var $CON;
	function usuario($con) {
		$this->CON=$con;
	}

	function contructor($idusuario, $nombre, $registrado, $telefono, $cuenta, $contrasena, $direccion, $estado){
		$this->idusuario = $idusuario;
		$this->nombre = $nombre;
		$this->registrado = $registrado;
		$this->telefono = $telefono;
		$this->cuenta = $cuenta;
		$this->contrasena = $contrasena;
		$this->direccion = $direccion;
		$this->estado = $estado;
	}

	function rellenar($resultado){
		if ($resultado->num_rows > 0) {
			$lista=array();
			while($row = $resultado->fetch_assoc()) {
				$usuario=array();
				$usuario["idusuario"]=$row['idusuario']==null?"":$row['idusuario'];
				$usuario["nombre"]=$row['nombre']==null?"":$row['nombre'];
				$usuario["registrado"]=$row['registrado']==null?"":$row['registrado'];
				$usuario["telefono"]=$row['telefono']==null?"":$row['telefono'];
				$usuario["cuenta"]=$row['cuenta']==null?"":$row['cuenta'];
				$usuario["contrasena"]=$row['contrasena']==null?"":$row['contrasena'];
				$usuario["direccion"]=$row['direccion']==null?"":$row['direccion'];
				$usuario["estado"]=$row['estado']==null?"":$row['estado'];
				$lista[]=$usuario;
			}
			return $lista;
		}else{
			return null;
		}
	}

	function todo(){
		$consulta="select * from whatsapp.usuario";
		$result=$this->CON->consulta($consulta);
		return $this->rellenar($result);
	}


	function buscarXID($id){
		$consulta="select * from whatsapp.usuario where ciudad_id=$id";
		$result=$this->CON->consulta($consulta);
		$usuario=$this->rellenar($result);
		if($usuario==null){
			return null;
		}
		return $usuario[0];
	}

	function modificar($ciudad_id){
		$consulta="update whatsapp.usuario set idusuario =".$this->idusuario.", nombre ='".$this->nombre."', registrado ='".$this->registrado."', telefono ='".$this->telefono."', cuenta ='".$this->cuenta."', contrasena ='".$this->contrasena."', direccion ='".$this->direccion."', estado ='".$this->estado."' where ciudad_id=".$ciudad_id;
		return $this->CON->manipular($consulta);
	}

	function eliminar($ciudad_id){
		$consulta="delete from whatsapp.usuario where ciudad_id=".$ciudad_id;
		return $this->CON->manipular($consulta);
	}

	function insertar(){
		$consulta="insert into whatsapp.usuario(idusuario, nombre, registrado, telefono, cuenta, contrasena, direccion, estado) values(".$this->idusuario.",'".$this->nombre."','".$this->registrado."','".$this->telefono."','".$this->cuenta."','".$this->contrasena."','".$this->direccion."','".$this->estado."')";
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
