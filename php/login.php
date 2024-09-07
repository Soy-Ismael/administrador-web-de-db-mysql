<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user = htmlspecialchars(trim($data['user'] ?? ''));
    $password = trim($data['password'] ?? '');
    $role = "general";

    if (!empty($user) && !empty($password)) {
        require_once 'conection.php';

        $stmt = $db->prepare("SELECT `password`, `role`, `id` FROM `credentials` WHERE `user` = ?");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->bind_result($hashed_password, $role, $id);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            $response = [
                "status" => "success",
                'ok' => true,
                "code" => 200,
                "message" => "Login successful",
                "data" => ["user" => $user, "role" => $role, "id" => $id],
                'timestamp' => date('c'),
                "errors" => null
            ];
        } else {
            $response = [
                'status' => 'error',
                'ok' => false,
                'code' => 401,
                'message' => "Invalid credentials",
                'data' => null,
                'errors' => ['Invalid password']
            ];
        }

        $stmt->close();
        $db->close();
    } else {
        $response = [
            'status' => 'error',
            'ok' => false,
            'code' => 400,
            'message' => "Username or password field can't be empty.",
            'data' => null,
            'errors' => ['Empty username or password']
        ];
    }
    echo json_encode($response);
    // echo json_encode([
    //     "son iguales?" => password_verify($password, $hashed_password),
    //     "password" => $password,
    //     "hashed" => $hashed_password
    // ]);
}
?>