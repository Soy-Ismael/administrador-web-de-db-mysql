<?php
header('Content-Type: application/json');

require_once 'conection.php';

// Seleccionar todo, pero dale formato a la fecha y solo muestrame que dia fue, no la hora (a pesar de guardar esos datos)
$query = "SELECT author, thinking, DATE_FORMAT(date, '%Y-%m-%d') AS new_date FROM `notes`;";
$result = $db->query($query);
$filas = $result->fetch_all(MYSQLI_ASSOC);

$data = [];

foreach ($filas as $fila) {
    $data[] = [
        "author" => $fila['author'],
        "thinking" => $fila['thinking'],
        "date" => $fila['new_date']
    ];
}

$result->free(); // Liberar memoria
$db->close(); // Cerrar conexión

// array_reverse se utiliza para invertir el orden de un array y devuelve un nuevo array, su función es hacer que los mensajes más recientes se envien de primero en el json y de ese modo js los coloque de primero en la página web y no al final
echo json_encode(array_reverse($data));
?>