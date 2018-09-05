<!DOCTYPE html>
<html style="min-width: 1348px;">
    <head>
        <title>Login</title>
        <link rel="shortcut icon" href="img/conectado.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href = "css/Estilo.css" rel = "stylesheet" type = "text/css"/>
        <script src = "Script/Plugin/jquery-2.1.3.min.js" type = "text/javascript"></script>
        <script src="Script/Plugin/jquery-ui.js" type="text/javascript"></script>
        <script src="Script/Plugin/HERRAMIENTAS.js?1.0.2" type="text/javascript"></script>
        <script src="Script/Index.js" type="text/javascript"></script>
    </head>
    <body style="background: linear-gradient(to bottom, #1ebea5 0%,#1ebea5 2%,#1ebea5 32%,white 32%,white 100%); overflow: hidden;">

        <div id="CuerpoLogin" class="centrar">
            <div class='titulo'>
                <img src="img/conectado.png" alt="" style="width: 50px;"/>
                <span style="    font-size: 23px; position: relative; top: -17px;">Massive Whatsapp</span>
            </div>
            
            <span class='negrillaenter'>CUENTA</span>
            <input type='text'  name='cuenta'/>
            <span class='negrillaenter'>CONTRASEÑA</span>
            <input type='password'  name='contra' onkeyup="logear(event)"/>
            <button onclick="logear('')" >INGRESAR</button>
            
        </div>
    </body>
</html>