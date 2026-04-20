<!DOCTYPE html>
<html>
    <head>
        <title>{{name}}</title>
        <link rel="stylesheet" href="/static/normalize.css">
        <link href="/static/favicon.ico" rel="icon" type="image/x-icon">"
    </head>
    <body>
        <h1>Page 1</h1>
        <p>This is the content of page 1.</p>
        <p><a href="/view/page2">Go to Page 2</a></p>

        <input id="env" value="{{env}}">
        <input id="options" value="{{options}}">
    </body>
    <script>
        try {
            var env = document.getElementById('env').value;
            var options = JSON.parse(document.getElementById('options').value);
            window.env = env;
            window.options = options;
        } catch (e) {
            console.error(e);
        }
    </script>
</html>