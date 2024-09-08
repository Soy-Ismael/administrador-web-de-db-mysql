<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $user = htmlspecialchars(trim($data['user'] ?? 'guest'));
    $password = trim($data['password'] ?? 'guest');
    $color = trim($data['color'] ?? '');
    // $role = "general";


    if (!empty($user) && !empty($password)) {
        require 'conection.php';

        $stmt = $db->prepare("SELECT `name`, `password`, `role`, `user_color` FROM `credentials` WHERE `user` = ?");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $stmt->bind_result($name, $hashed_password, $role, $user_color);
        $stmt->fetch();


        if (password_verify($password, $hashed_password)) {
            $response = [
                "status" => "success",
                'ok' => true,
                "code" => 200,
                "message" => "Login successful",
                "data" => ["name" => $name, "role" => $role, 'user_color' => $user_color],
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

        require 'conection.php';
        
        $stmt = $db->prepare("UPDATE `credentials` SET `user_color` = ? WHERE `user` = ?");
        $stmt->bind_param("ss", $color, $user);
        $stmt->execute();
        
        $stmt->close();
        $db->close();
    } else {
        $response = [
            // 'consulta' => "UPDATE `credentials` SET `user_color` = $color WHERE `user` = $user"
            'status' => 'error',
            'ok' => false,
            'code' => 400,
            'message' => "Username or password field can't be empty.",
            'data' => null,
            'errors' => ['Empty username or password'],
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