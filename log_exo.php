<?php


header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 


$user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
$livreid = (isset($_GET["livreid"])) ? $_GET["livreid"] : NULL;
$exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
$score = (isset($_GET["score"])) ? $_GET["score"] : NULL;
$tot = (isset($_GET["tot"])) ? $_GET["tot"] : NULL;
$dt = time();

if ($user && $exoid && $livreid) 
{
  // nom du fichier de sauvegarde
  $fic = "log_exo/$user/$livreid.txt";
  
  // on crée les répertoires si besoin
  mkdir("log_exo/$user", 0777, true);

  // ligne a écrire
  $ligne = "$livreid|$exoid|$score|$tot|$dt";
  
  // on crée/charge la liste des valeurs
  $vals = array();
  $ok=false;
  if (file_exists($fic))
  {
    $vals = explode("\n", file_get_contents($fic));
  }
  for ($i=0; $i<count($vals); $i++)
  {
    $v = explode("|", $vals[$i]);
    if (count($v)>2 && $v[1]==$exoid && $v[0]==$livreid)
    {
      $vals[$i] = $ligne;
      $ok = true;
      break;
    }
  }
  if ($ok == false) $vals[] = $ligne;
  
  //et on réécrit le tout dans le fichier
  file_put_contents($fic, implode("\n", $vals));
}

?>
