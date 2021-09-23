var btn = document.getElementById('boton');

btn.onclick = function () {
    var first_value = document.getElementById('first_value');
    var second_value = document.getElementById('second_value');
    var X_UTM = document.getElementById('X_UTM');
    var Y_UTM = document.getElementById('Y_UTM');

    var long = first_value.value;
    var lat = second_value.value;
    var a = 6378137;
    var b = 6356752.31424518;
    var exc = (Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2))) / a;
    var second_exc = (Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2))) / b;
    var C = Math.pow(a, 2) / b;
    var alpha = (a - b) / a;
    var index_long_degrees = long.search("°");
    var index_long_min = long.search("'");
    var index_long_seg = long.search("''");
    var index_lat_degrees = lat.search("°");
    var index_lat_min = lat.search("'");
    var index_lat_seg = lat.search("''");
    var long_degrees = parseFloat(long.slice(index_long_degrees - 2, index_long_degrees));
    var long_min = parseFloat(long.slice(index_long_min - 2, index_long_min));
    var long_seg = parseFloat(long.slice(index_long_seg - 2, index_long_seg));
    var long_decimal_degrees = long_degrees + long_min / 60 + long_seg / 3600;
    var lat_degrees = parseFloat(lat.slice(index_lat_degrees - 2, index_lat_degrees));
    var lat_min = parseFloat(lat.slice(index_lat_min - 2, index_lat_min));
    var lat_seg = parseFloat(lat.slice(index_lat_seg - 2, index_lat_seg));
    var lat_decimal_degrees = lat_degrees + lat_min / 60 + lat_seg / 3600;
    var long_rad = (long_decimal_degrees * Math.PI) / 180;
    var lat_rad = (lat_decimal_degrees * Math.PI) / 180;
    if (long.includes('E')) {
        long_rad = long_rad;
        long_decimal_degrees = long_decimal_degrees;
    } else if (long.includes('W')) {
        long_rad = -long_rad;
        long_decimal_degrees = -long_decimal_degrees;
    } else {
        alert("Incluir referencia del meridiano de Greenwich")
    }
    if (lat.includes('N')) {
        lat_rad = lat_rad;
        lat_decimal_degrees = lat_decimal_degrees;
    } else if (lat.includes('S')) {
        lat_rad = -lat_rad;
        lat_decimal_degrees = -lat_decimal_degrees;
    } else {
        alert("Incluir referencia del meridiano de Greenwich")
    }

    var huso = Math.floor((long_decimal_degrees / 6) + 31);
    var lambda_0 = (huso * 6) - 183;
    var deltha_lambda = long_rad - ((lambda_0 * Math.PI) / 180);

    // Ecuaciones de Coticchia-Surace
    var second_exc_2 = Math.pow(second_exc, 2);
    var Phi = lat_rad;
    var A = Math.cos(Phi) * Math.sin(deltha_lambda);
    var E = 0.5 * Math.log((1 + A) / (1 - A));
    var n = Math.atan(Math.tan(Phi) / Math.cos(deltha_lambda)) - Phi;
    var cos_phi_2 = Math.pow(Math.cos(Phi), 2);
    var u = 0.9996 * (C / Math.sqrt(1 + second_exc_2 * cos_phi_2));
    var dseta = (second_exc_2 / 2) * Math.pow(E, 2) * Math.pow(Math.cos(Phi), 2);
    var A_1 = Math.sin(2 * Phi);
    var A_2 = A_1 * Math.pow(Math.cos(Phi), 2);
    var J_2 = Phi + (A_1 / 2);
    var J_4 = (3 * J_2 + A_2) / 4;
    var J_6 = (5 * J_4 + A_2 * Math.pow(Math.cos(Phi), 2)) / 3;
    var alpha = (3 / 4) * second_exc_2;
    var betha = (5 / 3) * Math.pow(alpha, 2);
    var gamma = (35 / 27) * Math.pow(alpha, 3);
    var B_phi = 0.9996 * C * (Phi - (alpha * J_2) + (betha * J_4) - (gamma * J_6));
    X_UTM.value = (E * u * (1 + (dseta / 3)) + 500000).toFixed(2);
    if (lat.includes('S')) {
        Y_UTM.value = ((n * u * (1 + dseta) + B_phi) + 10000000).toFixed(2);
    } else {
        Y_UTM.value = (n * u * (1 + dseta) + B_phi).toFixed(2);
    }
}