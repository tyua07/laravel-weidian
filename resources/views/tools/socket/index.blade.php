<!--
  Lincense: Public Domain
-->

<html><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Sample of web_socket.js</title>

    <!-- Include these three JS files: -->
    <script src="//cdn.bootcss.com/web-socket-js/1.0.0/web_socket.min.js"></script>


    <script type="text/javascript">

        // Set URL of your WebSocketMain.swf here:
        WEB_SOCKET_SWF_LOCATION = "//cdn.bootcss.com/web-socket-js/1.0.0/WebSocketMain.swf";
        // Set this to dump debug message from Flash to console.log:
        WEB_SOCKET_DEBUG = true;

        // Everything below is the same as using standard WebSocket.

        var ws;

        var fb = 0;

        function init() {
            // Connect to Web Socket.
            // Change host/port here to your own Web Socket server.
            ws = new WebSocket("ws://localhost:9502/");
            // Set event handlers.
            ws.onopen = function() {
                output("onopen");
            };
            ws.onmessage = function(e) {
                var _data = eval("(" + e.data + ")");
                // e.data contains received string.
                fb = _data.fd;
                output("onmessage: " + _data.fd+'data:'+_data.content);
            };
            ws.onclose = function() {
                output("onclose");
            };
            ws.onerror = function() {
                output("onerror");
            };
        }

        function onSubmit() {
            var input = document.getElementById("input");
            var data = '{"content":'+input.value+', "fd":2}';
            ws.send(data);
            output("send: " + input.value);
            input.value = "";
            input.focus();
        }

        function onCloseClick() {
            ws.close();
        }

        function output(str) {
            var log = document.getElementById("log");
            var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
                replace(/>/, "&gt;").replace(/"/, "&quot;"); // "
            log.innerHTML = escaped + "<br>" + log.innerHTML;
        }
    </script>
</head><body onload="init();">
<form onsubmit="onSubmit(); return false;">
    <input type="text" id="input">
    <input type="submit" value="Send">
    <button onclick="onCloseClick(); return false;">close</button>
</form>
<div id="log"></div>
</body></html>