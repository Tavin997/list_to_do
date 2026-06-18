<?php
require __DIR__ . '/conn.php';

try {
    // 1. Preparar a consulta
    $sql = "SELECT * FROM usuarios";
    $stmt = $db->prepare($sql);
    
    // 2. Executar
    $stmt->execute();
    
    // 3. Buscar todos os resultados
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 4. Exibir
    foreach ($usuarios as $usuario) {
        echo "ID: " . $usuario['userID'] . "\n";
        echo "Nome: " . $usuario['userName'] . "\n";
        echo "Email: " . $usuario['userEmail'] . "\n";
        echo "---\n";
    }
    
} catch (PDOException $e) {
    error_log("Erro no SELECT: " . $e->getMessage());
}
?>