<?php
header('Content-Type: application/json');

require_once 'conection.php';

if (isset($_GET['oneline'])) {
    $one_line = htmlspecialchars($_GET['oneline']);
    // isset se utiliza para comprobar que si se hayan recibidio datos, útil para evitar errores de variables vacias o indefinidas
    // echo "Received parameters: param1 = $one_line";
}

// if(empty($id)){
//     echo json_encode([
//         'status' => 'error',
//         'ok' => false,
//         'code' => 401,
//         'message' => "Invalid request",
//         'data' => null,
//         'errors' => ['Empty date'],
//     ]);
//     exit;
// }

if ($one_line == "true"){
    // $query = "SELECT author, thinking, DATE_FORMAT(date, '%Y-%m-%d %a %h:%i:%s %p') AS new_date FROM `notes` ORDER BY date DESC LIMIT 1;";
    $query = "SELECT author, thinking, DATE_FORMAT(date, '%Y-%m-%d %a %h:%i %p') AS new_date, `user_color` FROM `notes` INNER JOIN `credentials` ON `author` = `name` ORDER BY date DESC LIMIT 1;";
} else{
    // $query = "SELECT author, thinking, DATE_FORMAT(date, '%Y-%m-%d %a %h:%i %p') AS new_date FROM `notes`;";
    $query = "SELECT `author`, `thinking`, DATE_FORMAT(`date`, '%Y-%m-%d %a %h:%i %p') AS new_date, `user_color` FROM `notes` INNER JOIN `credentials` ON `author` = `name`;";
}

// Seleccionar todo, pero dale formato a la fecha y solo muestrame que dia fue, no la hora (a pesar de guardar esos datos)
// $query = "SELECT author, thinking, DATE_FORMAT(date, '%Y-%m-%d') AS new_date FROM `notes`;";
$result = $db->query($query);
$filas = $result->fetch_all(MYSQLI_ASSOC);

$data = [];

foreach ($filas as $fila) {
    $data[] = [
        "author" => $fila['author'],
        "thinking" => $fila['thinking'],
        "date" => $fila['new_date'],
        "user_color" => $fila['user_color'],
    ];
}

$result->free(); // Liberar memoria
$db->close(); // Cerrar conexión

// array_reverse se utiliza para invertir el orden de un array y devuelve un nuevo array, su función es hacer que los mensajes más recientes se envien de primero en el json y de ese modo js los coloque de primero en la página web y no al final
echo json_encode(array_reverse($data));
// echo json_encode([
    //     "recibed" => $one_line,
    //     "test" => $test
    // ])
?>