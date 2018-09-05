<!DOCTYPE html>
<html style="min-width: 1348px;">
    <head>
        <title>Portal Administrativo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href = "css/Estilo.css" rel = "stylesheet" type = "text/css"/>
        <script src = "Script/Plugin/jquery-2.1.3.min.js" type = "text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js?1.0.2" type="text/javascript"></script>
        <script src="Script/Portal.js" type="text/javascript"></script>
    </head>
    <body  onunload="cerrarNavegador()">

        <menu>
            <span class="item" onclick="redireccionar('Formularios/ResumenGeneral.html')" >Resumen</span>
            <span class="item" onclick="redireccionar('Formularios/Campana.html')" >Campaña</span>
            <span class="item" onclick="redireccionar('Formularios/Campana.html')" style="display: none">Facturacion</span>
            <span class="item" onclick="redireccionar('Formularios/Campana.html')" style="display: none">Planes de pago</span>
            <span class="item" onclick="redireccionar('Formularios/Campana.html')" style="display: none">Empresa</span>
            <span class="item" onclick="redireccionar('Formularios/Campana.html')" style="display: none">Cuentas</span>
            <span id="cerrarSeccion"  class="item" onclick="cerrarSession(1)">Cerrar Session</span>
        </menu>
        <div id="cuerpo">
            <iframe src="">

            </iframe>
        </div>
        
    </body>
</html>