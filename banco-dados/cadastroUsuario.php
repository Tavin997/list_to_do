<?php
    require __DIR__ . '/conn.php';
    header('Content-Type: application/json');

    function cadastrarUsuario($Name, $Email, $Senha, $db){
        try {

            $sql = "INSERT INTO usuarios(nome, email, senha)
            VALUES ( :userName , :userEmail , :userPassword )";

            $stmt = $db->prepare($sql);

            $stmt->execute([
                ':userName' => $Name,
                ':userEmail' => $Email,
                ':userPassword' => password_hash($Senha, PASSWORD_DEFAULT)
            ]);
            
            if ($stmt->rowCount() > 0) {
                error_log("Usuário $Name cadastrado com sucesso! ID: " . $db->lastInsertId());
                
                http_response_code(201); // executado
                $responseJson = ['sucesso' => true, 'mensagem'=> "ok"];
                echo json_encode($responseJson);
                exit;
            } else {
                error_log("Nenhuma linha foi inserida");
                
                http_response_code(400); // falha na execução
                $responseJson = ['sucesso' => false, 'mensagem'=> "something went wrong (sounds of fart)"];
                echo json_encode($responseJson);
                exit;
            }
        } catch (PDOException $e) {
            error_log("Erro: " . $e->getMessage());

            http_response_code(500); // falha no sv
            $responseJson = ['sucesso' => false, 'mensagem'=> $e->getMessage()];
            echo json_encode($responseJson);
            exit;
        }
    }

    function validacaoEmail($Email, $db){
        try {
            $sql = "SELECT COUNT(*) as total FROM usuarios WHERE email = :email";

            $stmt = $db->prepare($sql);

            $stmt->execute([':email' => $Email]);

            $resposta = $stmt->fetch(PDO::FETCH_ASSOC);

            return $resposta['total'] == 0;

        } catch (PDOException $e) {
            error_log("Erro: " . $e->getMessage() . "\nCódigo do erro: " . $e->errorInfo[1]);
            return false;
        }
    }
    
    try {
        $json = file_get_contents('php://input');
        $dados = json_decode($json, true);

        if ($dados === null) {
            throw new Exception('JSON inválido ou mal formatado');
        }

        $campos = ['name', 'email', 'password'];
        foreach ($campos as $campo) {
            if (empty($dados[$campo])) {
                throw new Exception("Campo '$campo' é obrigatório");
            }
        }

         if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email inválido');
        }

        if (strlen($dados['password']) < 8) {
            throw new Exception('A senha deve ter no mínimo 8 caracteres');
        }

        $bool = validacaoEmail($dados['email'], $db);

        if ($bool == false) {
            http_response_code(409); // conflito
            $responseJson = ['sucesso' => false, 'mensagem'=> "Email existente"];
            echo json_encode($responseJson);
            exit;
        }

        cadastrarUsuario($dados['name'], $dados['email'], $dados['password'], $db);

    } catch (PDOException $e) {
        error_log("error: " . $e->getMessage());
    }
?>