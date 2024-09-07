<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $author = htmlspecialchars(trim($data['author'] ?? ''));
    $thinking = htmlspecialchars(trim($data['thinking'] ?? ''));
    $date_time = date('Y-m-d H:i:s');
    // DATE_FORMAT(date, '%Y-%m-%d %h:%i:%s %p') de esta forma se recuperan los datos con formato de 12 horas y con am y pm, si se le añade %a devuelve el dia de la semana, es decir, mon, tue, wed, thu, fri...

    if (!empty($author) && !empty($thinking)) {
        require_once 'conection.php';

        $stmt = $db->prepare("INSERT INTO `notes` (`author`,`thinking`,`date`) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $author, $thinking, $date_time);
        $result = $stmt->get_result();

        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                'ok' => true,
                "code" => 200,
                "message" => "Data was inserted successful",
                "data" => ["author" => $author],
                'timestamp' => date('c'),
                "errors" => null
            ];
        } else {
            $response = [
                'status' => 'error',
                'ok' => false,
                'code' => 401,
                'message' => "Issue in data",
                'data' => null,
                'errors' => ['Invalid data']
            ];
        }

        $stmt->close();
        $db->close();
    } else {
        $response = [
            'status' => 'error',
            'ok' => false,
            'code' => 400,
            'message' => "Author or thinking field can't be empty.",
            'data' => null,
            'errors' => ['Empty author or thinking']
        ];
    }

    echo json_encode($response);
    // echo json_encode([
    //     "author" => $author,
    //     "thinking" => $thinking,
    //     "date" => $date_time
    // ]);
}

// -- Recuperar el evento
// SELECT * FROM eventos;
// -- Esto mostrará: 2024-09-01 15:30:00

// -- Recuperar el evento sin mostrar segundos
// SELECT id, nombre, DATE_FORMAT(fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora
// FROM eventos;
// -- Esto mostrará: 2024-09-01 15:30
?>
