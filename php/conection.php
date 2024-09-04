<?php
$db_servername = "localhost"; // Nombre del servidor de la base de datos.
$db_username = "ismael"; // Nombre de usuario de la base de datos (por defecto es root).
$db_password = "qRL#Yt5oN6as"; // Contraseña de la base de datos (por defecto no hay contraseña).
$db_dbname = "notes"; // Nombre de la base de datos que deseas usar.

// Crear conexión
$db = new mysqli($db_servername, $db_username, $db_password, $db_dbname);

// Verificar conexión
if ($db->connect_error) {
    die("Conexión fallida: " . $db->connect_error);
}

// Este código se ejecuta si todo sale bien.
// echo "Conexión exitosa"
?>