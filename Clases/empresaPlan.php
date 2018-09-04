<?php

class empresaPlan {

    var $planpago_id;
    var $empresa_id;
    var $fechaDe;
    var $fechaHasta;
    var $CON;

    function empresaPlan($con) {
        $this->CON = $con;
    }

    function contructor($planpago_id, $empresa_id, $fechaDe, $fechaHasta) {
        $this->planpago_id = $planpago_id;
        $this->empresa_id = $empresa_id;
        $this->fechaDe = $fechaDe;
        $this->fechaHasta = $fechaHasta;
    }

   

   

}
