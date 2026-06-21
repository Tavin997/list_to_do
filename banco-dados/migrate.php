<?php
    require __DIR__ . "/conn.php";

    try {
        $sql = "CREATE TABLE IF NOT EXISTS usuarios (
        id int primary key AUTO_INCREMENT,
        nome varchar(100) not null,
        email varchar(100) not null unique,
        senha varchar(255) not null
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);

        $sql = "CREATE TABLE IF NOT EXISTS tarefas (
        id int primary key AUTO_INCREMENT,
        titulo varchar(100) not null,
        descricao varchar(200),
        prioridade int not null,
        status int not null,
        categoria varchar(20) not null,
        data date not null, 
        userid int not null,

        CONSTRAINT fk_userID
        FOREIGN KEY (userID) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        $db->exec($sql);

        error_log("Migrações executadas com sucesso");
    } catch (PDOException $e) {
        error_log("Erro: " . $e->getMessage());
    }
?>