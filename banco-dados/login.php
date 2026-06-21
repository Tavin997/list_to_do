<?php
    session_start([
        'cookie_lifetime' => 1800
    ]);
    
    require __DIR__ . '/conn.php';

    header('Content-Type: application/json');

    function realizarLogin($Email, $Senha, $db){

        $sql = "SELECT id, nome, email, senha FROM usuarios WHERE email = :email";

        $stmt = $db->prepare($sql);

        $stmt->execute([
            ':email' => $Email
        ]);

        $resposta = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$resposta) {
            $responseJson = [
                'sucesso'=>false,
                'mensagem'=>'email ou senha inválidos'
            ];
            echo json_encode($responseJson);
            exit;
        }

        if ($resposta['email'] === $Email && password_verify($Senha, $resposta['senha'])) {

            $_SESSION['user_name'] = $resposta['nome'];
            $_SESSION['user_email'] = $resposta['email'];
            $_SESSION['user_id'] = $resposta['id'] ?? null;
            $_SESSION['logado'] = true;
            $_SESSION['ultimo_acesso'] = time();

            $responseJson = [   
                'sucesso' => true,
                'mensagem' => "usuário logado"
            ];
            echo json_encode($responseJson);
            exit;
        } else {
            $responseJson = [
                'sucesso' => false,
                'mensagem' => "Login inválido"
            ];
            echo json_encode($responseJson);
            exit;
        }
    }

    try {
        $json = file_get_contents('php://input');
        $dados = json_decode($json, true);

        $validez = isset($dados);

        if($validez == false) {
            $responseJson = [
                'sucesso'=>false,
                'mensagem'=>"dados estão vazios"
            ];
            echo json_encode($responseJson);
            exit;
        }

        realizarLogin($dados['email'], $dados['password'], $db);

    } catch (PDOException $e) {
        error_log('erro: ' . $e->getMessage());
        $responseJson = [
            'sucesso'=>false,
            'mensagem'=>$e->getMessage()
        ];
        echo json_encode($responseJson);
        exit;
    }
?>