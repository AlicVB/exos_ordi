<?php
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
  }
  
  // et sur les exos
  $exos = glob("./exos/*" , GLOB_ONLYDIR);
  
  // on récupère les paramètres
  $user = (isset($_GET["user"])) ? $_GET["user"] : "";
  if (file_exists("./sauvegardes/$user") == false) mkdir("./sauvegardes/$user", 0777, true);
  
  // on cherche l'exo en cours
  $exo = 0;
  $lien_pre = "";
  $lien_next = "";
  if (isset($_GET["exo"]))
  {
    $exo = $_GET["exo"];
    // on sauvegarde
    file_put_contents("./sauvegardes/$user/pos.txt",$exo);
  }
  else
  {
    // on recherche la dernière position
    if (file_exists("./sauvegardes/$user/pos.txt"))
    {
      $infos = explode("\n", file_get_contents("./sauvegardes/$user/pos.txt"));
      $exo = $infos[0];
    }
    else file_put_contents("./sauvegardes/$user/pos.txt",$exo);
  }
  if ($exo > 0)
  {
    $nb = $exo - 1;
    $lien_pre = "livre.php?user=$user&exo=$nb";
  }
  if ($exo < count($exos)-1)
  {
    $nb = $exo + 1;
    $lien_next = "livre.php?user=$user&exo=$nb";
  }
  else if ($exo == count($exos)-1) $lien_next = "bilan.php?user=$user";

  // on supprime les trucs enregistrés si besoin
  if (isset($_GET["erase"]))
  {
    $f = basename("$exos[$exo]");
    if (file_exists("./sauvegardes/$user/$f.txt")) unlink("./sauvegardes/$user/$f.txt");
  }
  
  // on récupère les infos sur l'exercice en cours
  $txt_exo = file_get_contents("$exos[$exo]/exo.txt");
  $vals = explode("\n", $txt_exo);
  $titre_exo = $vals[0];
  $consigne = $vals[1];
  
  //on affiche les en-têtes
  echo "<!DOCTYPE html>\n";
  echo "<html><head>\n";
  echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
  echo "<title>$titre_livre -- $titre_exo</title>\n";

  // les fichiers à inclure
  echo "<script type=\"text/javascript\" src=\"$exos[$exo]/exo.js\"></script>\n";
  echo "<script type=\"text/javascript\" src=\"livre.js\"></script>\n";
  echo "<link rel=\"stylesheet\" href=\"livre.css\">\n";
  echo "<link rel=\"stylesheet\" href=\"$exos[$exo]/exo.css\">\n";
  echo "</head>\n";
  
  // on affiche le corps
  $txt = htmlentities(str_replace("\n", "§", addslashes($txt_exo)));
  echo "<body onload=\"charge('$user', '$livreid', '$exos[$exo]', '$txt', '$root/');\">\n";
  
  // cadre exercice
  echo "<div id=\"c1\">\n";
  echo "<span id=\"user\">Prénom : $user</span>\n";
  include "$exos[$exo]/exo.php";
  echo "</div>\n";
  
  // cadre à côté
  echo "<div id=\"c2\">\n";
  echo "<span id=\"titrelivre\">$titre_livre</span>\n";
  echo "<br/><span id=\"titreexo\">$titre_exo</span>\n";
  echo "<br/><div id=\"consigne\">$consigne</div>\n";
  
  // aide
  echo "<br/><div id=\"aideimg\"><img style=\"height: 12vh;\" src=\"$root/icons/help-hint.svg\" onmouseover=\"affiche_aide(true);\" onmouseout=\"affiche_aide(false);\" /></div>\n";
  
  // correction
  echo "<div id=\"corr\"><table id=\"ctable\">\n";
  echo "<tr><th colspan=\"3\" id=\"cscore\">Sujets : 10/10 -- Verbes : 10/10</th></tr>\n";
  echo "<tr></tr><th id=\"cflag\"><img id=\"cflagimg\" src=\"$root/icons/flag-red.svg\" /></th>\n";
  echo "<th id=\"ctxt\">--</th>\n";
  echo "<th id=\"cbtn\"><img id=\"cbtnimg\" src=\"$root/icons/edit-find-replace.svg\" onclick=\"affiche_score(true);\" /></th>\n";
  echo "</tr></table></div>";
  
  // les numéros de page
  echo "<div id=\"bas\"\n>\n";
  if ($lien_pre != "") echo "<a href=\"$lien_pre\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"$root/icons/go-previous.svg\" /></a>\n";
  for ($i=0; $i<count($exos); $i++)
  {
    $j = $i + 1;
    $cl = "page";
    if ($i < $exo) $cl = "pageavant";
    else if ($i == $exo) $cl = "pagecours";
    echo "<a class=\"$cl\" href=\"livre.php?user=$user&exo=$i\">$j</a>\n";
  }
  echo "<a class=\"pagebilan\" href=\"bilan.php?user=$user\">B</a>\n";
  if ($lien_next != "") echo "<a href=\"$lien_next\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"$root/icons/go-next.svg\" /></a>\n";
  echo "</div>\n";
  
  echo "<img id=\"aide\" src=\"aide.jpg\" />\n";
  
  echo "</div>\n";
  
  // retour au sommaire
  echo "<div id=\"exitdiv\">\n";
  echo "<a href=\"$root/sommaire.php?user=$user\"><img id=\"exitimg\" src=\"$root/icons/system-shutdown.svg\" /></a>\n";
  echo "<a id=\"erasea\" href=\"livre.php?user=$user&exo=$exo&erase=1\"><img id=\"eraseimg\" src=\"$root/icons/draw-eraser.svg\" /></a>";
  echo "</div>\n";
  
  // coins page
  if ($lien_next != "")
  {
    echo "<div class=\"coin_d\">\n";
    echo "<a href=\"$lien_next\"><img id=\"coinimg\" src=\"$root/icons/go-next_coin.svg\" /></a>\n";
    echo "</div>\n";
  }
  //license
  echo "<div id=\"bysa\"><img src=\"$root/icons/by-sa.png\" />© A. RENAUDIN 2016</div>\n";
  /*if ($exo_pre >= 0)
  {
    echo "<div class=\"coin_g\">\n";
    echo "<a href=\"livre.php?user=$user&exo=$exo_pre\"><img id=\"coinimg\" src=\"$root/icons/go-previous_coin.svg\" /></a>\n";
    echo "</div>\n";
  }*/
  
  echo "</body></html>";
?>
