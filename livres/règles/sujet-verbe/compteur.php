<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "./sauvegardes/$user/$exoid.nb.txt";
    
    if (file_exists("./sauvegardes/$user") == false) mkdir("./sauvegardes/$user", 0777, true);
    
    // on lit le fichier
    $txt = 0;
    if (file_exists($fic)) $txt = explode("\n", file_get_contents($fic))[0];
    
    // on traite les valeurs
    if (isset($_GET["action"]))
    {
      if ($_GET["action"] == "plus") $txt += 1;
      else if ($_GET["action"] == "moins") $txt -= 1;
      else if ($_GET["action"] == "reset") $txt = 0;
    }
    file_put_contents($fic, $txt);
    // on renvoi la valeur finale
    echo $txt;
  }
?>
