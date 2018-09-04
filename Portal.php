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
            <span class="item" onclick="menu('VENTA')" id="mVentas">VENTA</span>
            <span id="cerrarSeccion"  class="item" onclick="cerrarSession(1)">Cerrar Session</span>
        </menu>
        <div id="cuerpo">
            <div id='submenu'>
                <div class='menu'>
                    <div class="tituloMenu">MENU</div>
                    <div class='cuerpo'>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/ResumenGeneral.html')">Inicio</div>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/Campana.html')">Campaña</div>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/ResumenGeneral.html')" >Facturacion</div>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/ResumenGeneral.html')">Planes de pago</div>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/ResumenGeneral.html')">Empresa</div>
                        <div class='point item' id="p1" onclick="redireccionar('Formularios/ResumenGeneral.html')">Cuentas</div>
                    </div>
                </div>
                <div class="centrar" style="padding: 5px 0;   font-weight: bold;">
                    <span id="Nombreusuario"></span><br>
                   
                    <button onclick='cerrarSession(1)' class='medio' style="margin-top: 7px;   padding: 2px 0;">Cerrar Session</button>
                </div>
            </div>
            <iframe src="">

            </iframe>
        </div>
        
    </body>
</html>