<?php

class CONN {

    var $servername = "localhost";
    var $username = "root";
    var $password = "tasdingo";
    var $dbname = "whatsapp";
    var $conn;
    var $estado;

    function CONN() {
        try {
            $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
            if ($this->conn->connect_errno) {
                $this->estado = false;
            } else {
                $this->estado = true;
            }
            $this->conn->set_charset("utf8");
        } catch (PDOException $e) {
            $this->estado = false;
        }
    }

    function transacion() {
        $this->conn->autocommit(false);
    }

    function manipular($query) {
        if ($this->conn->query($query) === TRUE) {
            return true;
        } else {
            return false;
        }
    }

    function rellenar($resultado) {
        //header("Content-Type: text/html;charset=utf-8");
        $lista = array();
        if ($resultado != null) {
            while ($row = $resultado->fetch_assoc()) {
                $obj = array();
                foreach ($row as $nombre_campo => $valor) {
                    $obj[$nombre_campo] = $valor == null ? "" : $valor;
                }
                $lista[] = $obj;
            }
        }
        return $lista;
    }

    function rellenarString($resultado) {
        $lista = "";
        if ($resultado != null) {
            while ($row = odbc_fetch_object($resultado)) {
                $obj = "";
                foreach ($row as $nombre_campo => $valor) {
                    $resp = $valor == null ? "" : $valor;
                    $obj .= "\"$nombre_campo\":\"$resp\",";
                }
                if ($obj != "") {
                    $obj = substr($obj, 0, -1);
                }
                $obj = "{" . $obj . "},";
                $lista .= $obj;
            }
        }
        if ($lista != "") {
            $lista = substr($lista, 0, -1);
        }
        $lista = "[$lista]";
        return $lista;
    }

    function consulta($sql) {
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $result;
        } else {
            return null;
        }
    }
    function consulta2($sql) {
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            return $this->rellenar($result);
        } else {
            return array();
        }
    }

    function cerrarConexion() {
        try {
            $close = $conn->close();
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    function commit() {
        $this->conn->commit();
    }

    function rollback() {
        $this->conn->rollback();
    }

    function closed() {
        mysql_close($conn);
    }

}
