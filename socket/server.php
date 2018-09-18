<?php

$host = 'localhost'; //host
$port = '8888'; //port
$null = NULL; //null var

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socket, 0, $port);
socket_listen($socket);

//php -q F:\xampp\htdocs\tiotito\socket\server.php
$clients = array($socket);
$listaclients = array();
$AppServer;

while (true) {
    $changed = $clients;
    socket_select($changed, $null, $null, 0, 10);

    if (in_array($socket, $changed)) {
        $socket_new = socket_accept($socket);
        $clients[] = $socket_new;
        $header = socket_read($socket_new, 1024);
        if (strpos($header, "Sec-WebSocket-Key:")) {
            perform_handshaking($header, $socket_new, $host, $port);
            $response = mask(json_encode(array('tipo' => 'system', 'mensaje' => ' connected')));
        } else {
            $response_text = "Conectar|0|0\r\n";
            $nuevo = array();
            $nuevo["id"] = $socket_new;
            $nuevo["tipo"] = "App";
            $AppServer = $nuevo;
        }
        socket_getpeername($socket_new, $ip);
        socket_write($socket_new, $response, strlen($response));
        $found_socket = array_search($socket, $changed);
        unset($changed[$found_socket]);
    }

    foreach ($changed as $changed_socket) {

        while (socket_recv($changed_socket, $buf, 1024, 0) >= 1) {
            $isWeb = mb_detect_encoding($buf);
            if (!$isWeb) {
                $asd = unmask($buf);
                $jsonRespuesta = json_decode($asd, true);
            } else {
                $jsonRespuesta = json_decode($buf, true);
            }
            $tipo = $jsonRespuesta['tipo'];
            $idcampana = $jsonRespuesta['idcampana'];
            $detalle = $jsonRespuesta['detalle'];
            $accion = $jsonRespuesta['accion'];
            $idmsn = $jsonRespuesta['id'];
            $fecha = $jsonRespuesta['fecha'];

            if ($tipo === "iniciar") {
                if (!$listaclients[$idcampana]) {
                    $aux = array();
                    $nuevo = array();
                    $nuevo["id"] = $changed_socket;
                    if (!$isWeb) {
                        $nuevo["tipo"] = "html";
                        $aux[] = $nuevo;
                        $listaclients[$idcampana] = $aux;
                    }
                } else {
                    $nuevo = array();
                    $nuevo["id"] = $changed_socket;
                    if (!$isWeb) {
                        $nuevo["tipo"] = "html";
                        $listaclients[$idcampana][] = $nuevo;
                    }
                }
            }
            $item = $listaclients[$idcampana];
            if ($item) {
                foreach ($item as $changed_so) {
                    $response_text = mask(json_encode(array('tipo' => tipo, 'idcampana' => $idcampana, 'detalle' => $detalle, 'accion' => $accion, 'id' => $idmsn, 'fecha' => $fecha)));
                    socket_write($changed_so["id"], $response_text, strlen($response_text));
                }
            }
            if ($AppServer != null) {// envia mensaje server
                $accion = $accion == "" ? 0 : $accion;
                $idcampana = $idcampana == "" ? 0 : $idcampana;
                $tipo = $tipo == "" ? 0 : $tipo;
                $response_text = $tipo . "|" . $accion . "|" . $idcampana . "\r\n";
                socket_write($AppServer["id"], $response_text, strlen($response_text));
            }

            break 2;
        }
        $buf = socket_read($changed_socket, 1024, PHP_NORMAL_READ);
        if ($buf === false) {
            $found_socket = array_search($changed_socket, $clients);
            socket_getpeername($changed_socket, $ip);
            unset($clients[$found_socket]);
            $idcampana = 0;
            foreach ($listaclients as $idcampana => $value) {
                for ($j = 0; $j < count($value); $j++) {
                    $conexion = $value[$j]["id"];
                    if ($conexion === $changed_socket) {
                        $idcampana = $idcampana;
                        unset($listaclients[$idcampana][$j]);
                        break 2;
                    }
                }
            }
            if ($idcampana != 0) {
                $item = $listaclients[$idcampana];
                if ($item) {
                    foreach ($item as $changed_so) {
                        $response_text = mask(json_encode(array('tipo' => "mensaje", 'idcampana' => $idcampana, 'detalle' => "", 'accion' => "Detener", 'id' => "", 'fecha' => "")));
                        socket_write($changed_so["id"], $response_text, strlen($response_text));
                    }
                }
                if ($AppServer != null) {
                    $response_text = "mensaje|Detener|" . $idcampana . "\r\n";
                    socket_write($AppServer["id"], $response_text, strlen($response_text));
                }
            } else {
                if ($AppServer != null && $AppServer["id"] === $changed_socket) {
                    foreach ($clients as $changed_so) {
                        $response_text = mask(json_encode(array('tipo' => "mensaje", 'idcampana' => $idcampana, 'detalle' => "", 'accion' => "Detener", 'id' => "", 'fecha' => "")));
                        socket_write($changed_so["id"], $response_text, strlen($response_text));
                    }
                    $AppServer = null;
                }
            }
        }
    }
}
// close the listening socket
socket_close($socket);

//Unmask incoming framed message
function unmask($text) {
    $length = ord($text[1]) & 127;
    if ($length == 126) {
        $masks = substr($text, 4, 4);
        $data = substr($text, 8);
    } elseif ($length == 127) {
        $masks = substr($text, 10, 4);
        $data = substr($text, 14);
    } else {
        $masks = substr($text, 2, 4);
        $data = substr($text, 6);
    }
    $text = "";
    for ($i = 0; $i < strlen($data); ++$i) {
        $text .= $data[$i] ^ $masks[$i % 4];
    }
    return $text;
}

//Encode message for transfer to client.
function mask($text) {
    $b1 = 0x80 | (0x1 & 0x0f);
    $length = strlen($text);

    if ($length <= 125)
        $header = pack('CC', $b1, $length);
    elseif ($length > 125 && $length < 65536)
        $header = pack('CCn', $b1, 126, $length);
    elseif ($length >= 65536)
        $header = pack('CCNN', $b1, 127, $length);
    return $header . $text;
}

function perform_handshaking($receved_header, $client_conn, $host, $port) {
    $headers = array();
    $lines = preg_split("/\r\n/", $receved_header);
    foreach ($lines as $line) {
        $line = chop($line);
        if (preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
            $headers[$matches[1]] = $matches[2];
        }
    }

    $secKey = $headers['Sec-WebSocket-Key'];
    $secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    //hand shaking header
    $upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
            "Upgrade: websocket\r\n" .
            "Connection: Upgrade\r\n" .
            "WebSocket-Origin: $host\r\n" .
            "WebSocket-Location: ws://$host:$port/demo/shout.php\r\n" .
            "Sec-WebSocket-Accept:$secAccept\r\n\r\n";
    socket_write($client_conn, $upgrade, strlen($upgrade));
}
