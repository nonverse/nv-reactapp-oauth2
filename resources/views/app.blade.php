<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href={{asset('css/app.css')}}>
    <title>Nonverse | Labs</title>
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
</head>
<body>
<div id="root">
    {{--Div in which React.js app will be rendered--}}
</div>
<script defer src="../js/app.js"></script>
</body>
</html>
