<!DOCTYPE html>
<html style="min-width: 1348px;">
    <head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href = "css/Estilo.css" rel = "stylesheet" type = "text/css"/>
        <script src = "Script/Plugin/jquery-2.1.3.min.js" type = "text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js?1.0.2" type="text/javascript"></script>
        <script src="Script/Index.js" type="text/javascript"></script>
    </head>
    <body>

        <div id="CuerpoLogin" class="centrar">
            <div class='titulo'>ADMINISTRADOR</div>
            <span class='negrillaenter'>CUENTA</span>
            <input type='text'  name='cuenta'/>
            <span class='negrillaenter'>CONTRASEÑA</span>
            <input type='password'  name='contra' onkeyup="logear(event)"/>
            <button onclick="logear('')" >INGRESAR</button>
            
        </div>
    </body>
</html>