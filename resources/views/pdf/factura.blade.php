<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Facturación PDF</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
        }

        .linea-punteada {
            width: 100%;
            border-bottom: 2px dashed #555;
            margin: 15px 0;
        }

        .barcode {
            top: 165px;
            left: 5px;
        }

        .barcode-text {
            position: absolute;
            top: 260px;
            /* mismo top del barcode */
            left: 35px;
            /* ajusta según distancia */
            transform: rotate(270deg);
            font-size: 13px;
            font-weight: bold;
            transform-origin: left top;
        }

        .page-break {
            page-break-after: always;
        }

        /* Cada factura ocupa exactamente el espacio del fondo */
        .factura-wrapper {
            width: 1175px;
            height: 470px;
            position: relative;
            background-image: url('{{ public_path("images/factura.jpg") }}');
            background-size: 1175px 470px;
            background-repeat: no-repeat;
            margin-bottom: 0;
        }

        /* Ajusta posiciones exactas según tu diseño del fondo */
        .campo {
            position: absolute;
            font-size: 16px;
            color: #000;
        }

        .cliente {

            top: 106px;
            left: 170px;
            width: 300px;
            /* MUY IMPORTANTE */
            white-space: nowrap;
            overflow: hidden;
            /* Si se pasa de largo → se corta */
            text-overflow: ellipsis;
            /* Opcional */

        }

        .direccion {
            top: 139px;
            left: 170px;
        }

        .estado {
            top: 170px;
            left: 170px;
        }

        .periodo {
            top: 107px;
            left: 730px;
        }

        .saldo-anterior {
            top: 139px;
            left: 730px;
        }

        .saldo-actual {
            top: 170px;
            left: 730px;
        }

        .otros {
            top: 205px;
            left: 730px;
        }

        .total {
            top: 235px;
            left: 730px;
            font-weight: bold;
        }

        .vencimiento {
            top: 268px;
            left: 730px;
        }

        .observaciones {
            top: 300px;
            left: 496px;
            position: absolute;

            width: 360px;
            /* CONTROL DE ANCHO */
            height: 120px;
            /* ESPACIO PERMITIDO */
            overflow: hidden;
            /* EVITA QUE SE SALGA */
            font-size: 14.5px;
            line-height: 16px;
            word-wrap: break-word;
            /* Rompe palabras largas */
            white-space: normal;
            /* Permite salto de línea */
            text-align: justify;
        }

        .ruta {
            top: 450px;
            left: 60px;
            font-family: monospace;
            font-size: 10px;
            margin: 0;
            padding: 5px;
            color: black;
            background: white;
        }


        .cliente_des {
            top: 98px;
            left: 890px;
            width: 245px;
            /* MUY IMPORTANTE */
            white-space: nowrap;
            overflow: hidden;
            /* Si se pasa de largo → se corta */
            text-overflow: ellipsis;
            /* Opcional */
        }

        .direccion_des {
            top: 135px;
            left: 890px;
            /* MUY IMPORTANTE */
            width: 245px;
            white-space: nowrap;
            overflow: hidden;
            /* Si se pasa de largo → se corta */
            text-overflow: ellipsis;
            /* Opcional */
        }

        .periodo_des {
            top: 169px;
            left: 890px;
        }

        .saldo-anterior_des {
            top: 202px;
            left: 890px;
        }

        .saldo-actual_des {
            top: 237px;
            left: 890px;
        }

        .otros_des {
            top: 272px;
            left: 890px;
        }

        .total_des {
            top: 305px;
            left: 890px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    @if ($factura)

    <div class="factura-wrapper">
        <div class="campo barcode">
            <img src="data:image/png;base64,{{$barcode}}" alt="{{$factura->id}}">
           
        </div>

         <strong class="barcode-text">{{ $factura->id}}</strong>


        <div class="campo cliente">
            {{ $factura->predio->cliente->nombre?? 'SIN CLIENTE' }}
        </div>

        <div class="campo direccion">
            {{ $factura->predio->direccion_predio. ' '. $factura->predio->barrio->abreviatura ?? 'SIN DIRECCIÓN' }}
        </div>

        <div class="campo estado">
            {{ $factura->predio->estado_servicio ?? 'Activo' }}
        </div>

        <div class="campo periodo">
            {{ $factura->ciclo->mes . ' ' . $factura->ciclo->anio }}
        </div>

        <div class="campo saldo-anterior">
            {{ number_format($factura->saldo_anterior, 0, ',', '.') }}
        </div>

        <div class="campo saldo-actual">
            {{ number_format($factura->saldo_actual, 0, ',', '.') }}
        </div>

        <div class="campo otros">
            {{ $factura->saldo_conexion + $factura->saldo_reconexion }}
        </div>

        <div class="campo total">
            {{ number_format($factura->total_factura, 0, ',', '.') }}
        </div>

        <div class="campo vencimiento">
            {{ $factura->fecha_vencimiento }}
        </div>

        <div class="campo observaciones">
            <strong> {{ $factura->observaciones }}</strong>
        </div>

        <div class="campo ruta">
            <strong> {{ $factura->predio->ruta }}</strong>
        </div>

        <!-- Desprendible -->

        <div class="campo cliente_des">
            {{ $factura->predio->cliente->nombre?? 'SIN CLIENTE' }}
        </div>

        <div class="campo direccion_des">
            {{ $factura->predio->direccion_predio. ' '. $factura->predio->barrio->abreviatura ?? 'SIN DIRECCIÓN' }}
        </div>

        <div class="campo periodo_des">
            {{ $factura->ciclo->mes . ' ' . $factura->ciclo->anio }}
        </div>

        <div class="campo saldo-anterior_des">
            {{ number_format($factura->saldo_anterior, 0, ',', '.') }}
        </div>

        <div class="campo saldo-actual_des">
            {{ number_format($factura->saldo_actual, 0, ',', '.') }}
        </div>

        <div class="campo otros_des">
            {{ $factura->saldo_conexion + $factura->saldo_reconexion }}
        </div>

        <div class="campo total_des">
            {{ number_format($factura->total_factura, 0, ',', '.') }}
        </div>

    </div>
    <div class="linea-punteada"></div>


    @endif

</body>

</html>