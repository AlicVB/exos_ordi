<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  
  $ret = "";
  if (isset($_POST["fic"]) && isset($_POST["io"])) 
  {
    $io = $_POST["io"];
    $fic = $_POST["fic"];
    if ($io == "charge" && file_exists($fic))
    {
      $ret = file_get_contents($fic);
    }
    else if ($io == "sauve" && isset($_POST["v"]))
    {
      $v = $_POST["v"];
      file_put_contents($fic, $v);
    }
  }
  echo $ret;
?>
