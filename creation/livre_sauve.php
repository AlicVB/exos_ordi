<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  
  if (isset($_POST["fic"]) && isset($_POST["v"])) 
  {
    $fic = $_POST["fic"];
    $v = $_POST["v"];
    file_put_contents($fic, $v);
  }
?>
