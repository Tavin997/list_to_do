<?php

    $environment = getenv('APP_ENV') ?: 'development';

    if ($environment === 'production') {
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASSWORD');
        $ssl_ca = getenv('DB_SSL_CA') ?: '/banco-dados/ca.pem';
    } else {
        $host =  'localhost';
        $port =  '3306';
        $dbname ='todo';
        $user =  'root';
        $pass =  '';
        $ssl_ca = null; 
    }

    if (!$host || !$user) {
        error_log("Erro: Variáveis de ambiente do banco de dados não estão configuradas corretamente");
        exit("Erro de configuração do banco de dados");
    }

    $conn = "mysql:";
    $conn .= "host=" . $host;
    $conn .= ";port=" . ($port ?: 3307);
    $conn .= ";dbname=" . ($dbname ?: 'defaultdb');
    $conn .= ";sslmode=verify-ca";
    
    if ($ssl_ca && file_exists($ssl_ca)) {
        $conn .= ";sslca=" . $ssl_ca;
    }

    try {
        $db = new PDO($conn, $user, $pass);

        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->exec("SET NAMES utf8mb4");
        error_log("Conexão estabelecida com sucesso...");
    } catch (PDOException $e) {
        error_log("Erro de conexão: " . $e->getMessage());
        exit("Erro ao conectar ao banco de dados");
    }
?>