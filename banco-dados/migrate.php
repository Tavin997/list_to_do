<?php
    require __DIR__ . "/conn.php";

    try {
        $sql = "CREATE TABLE IF NOT EXISTS usuarios (
        userID int primary key AUTO_INCREMENT,
        userName varchar(100) not null,
        userEmail varchar(100) not null unique,
        userPassword varchar(255) not null
        );";

        $db->exec($sql);

        $sql = "CREATE TABLE IF NOT EXISTS tarefas (
        tarefasID int primary key AUTO_INCREMENT,
        tarefasTiutlo varchar(100) not null,
        tarefasDescricao varchar(200),
        tarefasPrioridade int not null,
        tarefasStatus int not null,
        tarefasCategoria varchar(20) not null,
        tarefasData date not null, 
        userID int not null
        );";

        $db->exec($sql);

        error_log("Migrações executadas com sucesso");
    } catch (PDOException $e) {
        error_log("Erro: " . $e->getMessage());
    }
?>