<?php
class DB
{
    private static string $host = 'localhost';
    private static string $user = 'root';
    private static string $pass = '';
    private static string $name = 'clothtrack';

    public static function connect(): mysqli
    {
        $conn = new mysqli(self::$host, self::$user, self::$pass, self::$name);
        if ($conn->connect_error) {
            self::json(['error' => 'Database connection failed: ' . $conn->connect_error], 500);
        }
        $conn->set_charset('utf8mb4');
        return $conn;
    }

    /** @param mixed $data */
    public static function json($data, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function requireAuth(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['user_id'])) {
            self::json(['error' => 'Unauthorized'], 401);
        }
    }
}

function requireAuth(): void  { DB::requireAuth(); }
function getDB(): mysqli       { return DB::connect(); }
/** @param mixed $data */
function jsonResponse($data, int $code = 200): void { DB::json($data, $code); }
