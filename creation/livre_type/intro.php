<?php
  $user = (isset($_GET["user"])) ? $_GET["user"] : "";
  // infos sur le chemin du livre
  $livreid = basename(dirname($_SERVER['PHP_SELF']));
  $cat = basename(dirname(dirname($_SERVER['PHP_SELF'])));
  $root = "../../..";
  if ($cat == "livres")
  {
    $root = "../..";
    $cat = "";
  }
  
  // infos sur le livre
  $titre_livre = "";
  if (file_exists("livre.txt"))
  {
    // on récupère le titre du livre
    $infos = explode("\n", file_get_contents("livre.txt"));
    $titre_livre = $infos[0];
    
    // et les détails
    $coul = $infos[1];
    
    //et les détails
    $details = "";
    for ($i=11; $i<count($infos); $i++)
    {
      if ($infos[$i] != "")
      {
        if ($i > 11) $details .= "<br/>";
        $details .= $infos[$i];
      }    
    }
  }
  
  //on affiche les en-têtes
  echo "<!DOCTYPE html>\n";
  echo "<html><head>\n";
  echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
  echo "<title>$titre_livre</title>\n";

  // les fichiers à inclure
  echo "<link rel=\"stylesheet\" href=\"intro.css\">\n";
  echo "</head>\n";
  
  // on affiche le corps
  echo "<body style=\"background-color: $coul;\">\n";
  
  // cadre exercice
  echo "<div id=\"c1\">\n";
  echo "<div id=\"titrelivre\">$titre_livre</div>\n";
  echo "<br/><div id=\"details\">$details</div>\n";
  echo "<br/><img id=\"aideimg\" src=\"aide.jpg\" />\n";
  echo "<br/><div id=\"godiv\">\n";
  echo "<div id=\"gotxt\">On y va !</div>\n";
  echo "<a href=\"livre.php?user=$user&exo=0\"><img id=\"goimg\" src=\"$root/icons/go-next.svg\" /></a>\n";
  echo "</div>\n";
  echo "</div>\n";
  
  
  echo "</body></html>";
?>
