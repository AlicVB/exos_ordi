<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  $pos = (isset($_GET["pos"])) ? $_GET["pos"] : NULL;
  $nb = (isset($_GET["nb"])) ? $_GET["nb"] : NULL;
  $v = (isset($_GET["v"])) ? $_GET["v"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "../../sauvegardes/$user/$exoid.txt";
  
    // on crée/charge la liste des valeurs
    $vals = array();
    if (file_exists($fic))
    {
      $vals = explode("\n", file_get_contents($fic));
    }
    else
    {
      for ($i=0; $i<$nb; $i++)
      {
        $vals[] = '';
      }
    }
    
    // on change juste la ligne qu'il faut
    $vals[$pos] = $v;
    //et on réécrit le tout dans le fichier
    file_put_contents($fic, implode("\n", $vals));
  }
  ?>