<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  
function free_path($fic)
{
  if (!file_exists($fic)) return $fic;
  $p1 = substr($fic, 0, -4);
  $p2 = substr($fic, -4);
  $i = 1;
  while (file_exists($p1."_".$i.$p2))
  {
    $i++;
  }
  return $p1."_".$i.$p2;
}

  $ret = "";
  if (isset($_GET["fic"]) && isset($_GET["io"]))
  {
    $io = $_GET["io"];
    $fic = $_GET["fic"];
    $fic = dirname(dirname($fic));
    if ($io == "sauveimg")
    {
      if ("{$_FILES['cr_img_get']['error']}" == "1") $ret = "*Erreur : fichier trop gros !";
      else
      {
        $dest = free_path("$fic/img/{$_FILES['cr_img_get']['name']}");
        copy($_FILES['cr_img_get']['tmp_name'], $dest);
        if (file_exists($dest)) $ret = basename($dest);
        else $rest = "*Erreur: la copie de l'image a échoué !";
      }
    }
  }
  else if (isset($_POST["fic"]) && isset($_POST["io"])) 
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
