<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coleta dos dados do formulário
    $nome = $_POST['nome'];
    $idade = $_POST['idade'];
    $email = $_POST['email'];
    $feedback = $_POST['feedback'];

    // Montagem do corpo do e-mail
    $to = "kleitonxferreira@gmail.com";
    $subject = "Novo feedback de $nome";
    $message = "Nome: $nome\n";
    $message .= "Idade: $idade\n";
    $message .= "Email: $email\n\n";
    $message .= "Mensagem:\n$feedback";

    // Envia o e-mail
    $headers = "From: $email";
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Erro ao enviar o e-mail."));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Método inválido."));
}
?>
