<?php


try {
            $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
            if ($this->conn->connect_errno) {
                $this->estado = false;
            } else {
                $this->estado = true;
            }
        } catch (PDOException $e) {
            $this->estado = false;
        }


?>