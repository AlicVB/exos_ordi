<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "../../sauvegardes/$user/$exoid.txt";
    
    // si pas de fichier, on sort
    if (file_exists($fic) == false) exit;
  
    // sinon, on lit le fichier ligne par ligne
    echo file_get_contents($fic);
  }
  ?>