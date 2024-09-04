<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = htmlspecialchars(trim($data['name'] ?? ''));
    $last_name = htmlspecialchars(trim($data['last_name'] ?? ''));
    $user = htmlspecialchars(trim($data['user'] ?? ''));
    $password = trim($data['password'] ?? '');
    $password_hashed = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = htmlspecialchars(trim($data['role'] ?? ''));
    $permissions = htmlspecialchars(trim($data['permissions'] ?? ''));
    // $date_time = htmlspecialchars(trim($data['datetime'] ?? ''));
    $date_time = date('Y-m-d h:i:s');

    if ($permissions == "admin"){
        if (!empty($user) && !empty($password)) {
            require_once 'conection.php';

            $stmt = $db->prepare("INSERT INTO `credentials` (`name`, `last_name`, `user`, `password`, `role`, `date_of_create`) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $name, $last_name, $user, $password_hashed, $role, $date_time);
            
            if($stmt->execute()){
                $response = [
                    "status" => "success",
                    'ok' => true,
                    "code" => 200,
                    "message" => "User was created successful",
                    "data" => ["user" => $user, "role" => $role, "datetime" => $date_time],
                    'timestamp' => date('c'),
                    "errors" => null
                ];
            }else{
                $response = [
                    'status' => 'error',
                    'ok' => false,
                    'code' => 401,
                    'message' => "Failed while creating new user",
                    'data' => null,
                    'errors' => [$stmt->error]
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
    } else{
        $response = [
            'status' => 'error',
            'ok' => false,
            'code' => 400,
            'message' => "insufficient permissions.",
            'data' => null,
            'errors' => ['Only the administrator can create new users']
        ];
    }

    echo json_encode($response);
    // echo json_encode([
    //     "password" => $password,
    //     "hashed" => $password_hashed
    // ]);
}
?>