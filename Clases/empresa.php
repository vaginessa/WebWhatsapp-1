<?php
class empresa {
	var $idEmpresa;
	var $nombreEmpresa;
	var $Actividad;
	var $Direccion;
	var $correo;
	var $registrada;
	var $estado;
	var $planPago_id;
	var $usuario_id;
	var $CON;
	function empresa($con) {
		$this->CON=$con;
	}

	function contructor($idEmpresa, $nombreEmpresa, $Actividad, $Direccion, $correo, $registrada, $estado, $planPago_id, $usuario_id){
		$this->idEmpresa = $idEmpresa;
		$this->nombreEmpresa = $nombreEmpresa;
		$this->Actividad = $Actividad;
		$this->Direccion = $Direccion;
		$this->correo = $correo;
		$this->registrada = $registrada;
		$this->estado = $estado;
		$this->planPago_id = $planPago_id;
		$this->usuario_id = $usuario_id;
	}

	function rellenar($resultado){
		if ($resultado->num_rows > 0) {
			$lista=array();
			while($row = $resultado->fetch_assoc()) {
				$empresa=array();
				$empresa["idEmpresa"]=$row['idEmpresa']==null?"":$row['idEmpresa'];
				$empresa["nombreEmpresa"]=$row['nombreEmpresa']==null?"":$row['nombreEmpresa'];
				$empresa["Actividad"]=$row['Actividad']==null?"":$row['Actividad'];
				$empresa["Direccion"]=$row['Direccion']==null?"":$row['Direccion'];
				$empresa["correo"]=$row['correo']==null?"":$row['correo'];
				$empresa["registrada"]=$row['registrada']==null?"":$row['registrada'];
				$empresa["estado"]=$row['estado']==null?"":$row['estado'];
				$empresa["planPago_id"]=$row['planPago_id']==null?"":$row['planPago_id'];
				$empresa["usuario_id"]=$row['usuario_id']==null?"":$row['usuario_id'];
				$lista[]=$empresa;
			}
			return $lista;
		}else{
			return null;
		}
	}

	function todo(){
		$consulta="select * from whatsapp.empresa";
		$result=$this->CON->consulta($consulta);
		return $this->rellenar($result);
	}

	function insertar(){
		$consulta="insert into whatsapp.empresa(idEmpresa, nombreEmpresa, Actividad, Direccion, correo, registrada, estado, planPago_id, usuario_id) values(".$this->idEmpresa.",'".$this->nombreEmpresa."','".$this->Actividad."','".$this->Direccion."','".$this->correo."','".$this->registrada."','".$this->estado."',".$this->planPago_id.",".$this->usuario_id.")";
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
