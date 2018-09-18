<?php
$colors = array('#007AFF', '#FF7000', '#FF7000', '#15E25F', '#CFC700', '#CFC700', '#CF1100', '#CF00BE', '#F00');
$color_pick = array_rand($colors);
?>

<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            .chat-wrapper {
                font: bold 11px/normal 'lucida grande', tahoma, verdana, arial, sans-serif;
                background: #00a6bb;
                padding: 20px;
                margin: 20px auto;
                box-shadow: 2px 2px 2px 0px #00000017;
                max-width:700px;
                min-width:500px;
            }
            #message-box {
                width: 97%;
                display: inline-block;
                height: 300px;
                background: #fff;
                box-shadow: inset 0px 0px 2px #00000017;
                overflow: auto;
                padding: 10px;
            }
            .user-panel{
                margin-top: 10px;
            }
            input[type=text]{
                border: none;
                padding: 5px 5px;
                box-shadow: 2px 2px 2px #0000001c;
            }
            input[type=text]#name{
                width:20%;
            }
            input[type=text]#message{
                width:60%;
            }
            button#send-message {
                border: none;
                padding: 5px 15px;
                background: #11e0fb;
                box-shadow: 2px 2px 2px #0000001c;
            }
        </style>
    </head>
    <body>

        <div class="chat-wrapper">
            <div id="message-box"></div>
            <div class="user-panel">
                <input type="text" name="name" id="name" placeholder="Your Name" maxlength="15" />
                <input type="text" name="message" id="message" placeholder="Type your message here..." maxlength="100" />
                <button id="send-message">Send</button>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script language="javascript" type="text/javascript">
            var msgBox = $('#message-box');
            var wsUri = "ws://localhost:8888";
            //var wsUri = "ws://localhost:8888";
            var websocket;

            $('#send-message').click(function () {
                if (!websocket) {
                    websocket = new WebSocket(wsUri);

                    websocket.onopen = function (ev) {
                        send_message("iniciar");
                        msgBox.append('<div class="system_msg" style="color:#bbbbbb">Welcome to my "Demo WebSocket Chat box"!</div>'); //notify user
                    }
                    // mensaje recivido del servidor
                    websocket.onmessage = function (ev) {
                        var response = JSON.parse(ev.data); //PHP sends Json data

                        var res_type = response.type; //message type
                        var user_message = response.message; //message text
                        var user_name = response.name; //user name
                        var user_color = response.color; //color

                        switch (res_type) {
                            case 'usermsg':
                                msgBox.append('<div><span class="user_name" style="color:' + user_color + '">' + user_name + '</span> : <span class="user_message">' + user_message + '</span></div>');
                                break;
                            case 'system':
                                msgBox.append('<div style="color:#bbbbbb">' + user_message + '</div>');
                                break;
                        }
                        msgBox[0].scrollTop = msgBox[0].scrollHeight; //scroll message 

                    };

                    websocket.onerror = function (ev) {
                        msgBox.append('<div class="system_error">Error Occurred - ' + ev.data + '</div>');
                    };
                    websocket.onclose = function (ev) {
                        msgBox.append('<div class="system_msg">Connection Closed</div>');
                    };

                } else {
                    send_message("mensaje");
                }

            }
            );

            function send_message(tipo) {
                var message_input = $('#message'); //user message text
                var name_input = $('#name'); //user name

                var msg = {
                    tipo: tipo,
                    message: message_input.val(),
                    name: name_input.val(),
                    color: '<?php echo $colors[$color_pick]; ?>'
                };
                websocket.send(JSON.stringify(msg));
                message_input.val(''); //reset message input
            }
        </script>
    </body>
</html>
