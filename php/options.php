<?php
// SELECT thinking FROM `notes` where thinking = 'Mensaje más reciente aqui!';
// El código anterior es valido y funciona por lo que intuyo que con update funciona.
header('Content-Type: application/json');
require_once 'conection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $purpose = $data['purpose'];
    $text = $data['text'];
    $author = $data['author'];

    // Código para borrar un mensaje de la base de datos
    if ($purpose == 'delete') {
        $stmt = $db->prepare("DELETE FROM `notes` WHERE `thinking` = ? AND author = ?");
        $stmt->bind_param("ss", $text, $author);
        $result = $stmt->get_result();

        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                'ok' => true,
                "code" => 200,
                "message" => "Data was deleted successful",
                "data" => ["purpose" => $purpose, "old_text" => $text],
                'timestamp' => date('c'),
                "errors" => null
            ];
        } else {
            $response = [
                'status' => 'error',
                'ok' => false,
                'code' => 401,
                'message' => "Issue while deleting data",
                'data' => null,
                'errors' => ['Unknow error']
            ];
        }

        $stmt->close();
        $db->close();
    } elseif ($purpose == 'edit') {
        $new_text = trim($data['new_text']);

        //* NOTA: Tambien se podria guardar un segundo campo de fecha para el momento en que se edito el mensaje y así se tiene la fecha de modificación y de creación.
        $stmt = $db->prepare("UPDATE `notes` SET `thinking` = ? WHERE `thinking` = ? AND author = ?");
        $stmt->bind_param("sss", $new_text, $text, $author);
        $result = $stmt->get_result();

        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                'ok' => true,
                "code" => 200,
                "message" => "Data was modified successful",
                "data" => ["purpose" => $purpose, "old_text" => $text, "new_text" => $new_text],
                'timestamp' => date('c'),
                "errors" => null
            ];
        } else {
            $response = [
                'status' => 'error',
                'ok' => false,
                'code' => 401,
                'message' => "Issue while modifying data",
                'data' => null,
                'errors' => ['Unknow error']
            ];
        }

        $stmt->close();
        $db->close();
    }




    echo json_encode($response);
}

?>