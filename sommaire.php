<?php
 /*
    --En-tête officielle pour dire que ce code est sous une licence "libre" (plus d'infos: https://fr.wikipedia.org/wiki/Licence_publique_g%C3%A9n%C3%A9rale_GNU)--
    
    Copyright (C) A.RENAUDIN  Developer

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
*/

  include("core/maj.php");
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- Sommaire</title>
  <link rel="shortcut icon" href="icons/gnome-palm.png" >
  <link rel="stylesheet" href="sommaire.css">
</head>

<body>
  
  <div id="titre">Bienvenue <?php echo $_GET['user'];?></div>
  <p id="listetitre">Voici la liste des activités <?php if(isset($_GET['base'])) echo $_GET['base'];?> :</p>
  <table id="table">
    <?php
      // on récupère la liste des sous-dossiers
      $base = "./livres";
      if (isset($_GET['base']))
      {
        $base = $_GET['base'];
        $base = "./livres/$base";
      }
      $base = "$base/*";
      $dirs = glob("$base" , GLOB_ONLYDIR);
      $user = $_GET['user'];
      for ($i=0; $i<count($dirs); $i++)
      {
        $d = $dirs[$i];
        // on regarde si c'est un livre ou une catégorie
        echo "<tr class=\"tligne\">\n";
        if (file_exists("$d/livre.txt"))
        {
          // on récupère le titre du livre
          $infos = explode("\n", file_get_contents("$d/livre.txt"));
          $nom = $infos[0];
          // et on construit le lien
          $lien = "$d/intro.php?user=$user";

          echo "<th class=\"tico\"><a href=\"$lien\"><img class=\"ico\" src=\"./icons/stock_book_red.svg\" /></a></th>\n";
          echo "<th class=\"tnom\"><a class=\"lien\" href=\"$lien\">$nom</a></th>\n";
        }
        else
        {
          // on affiche la catégorie
          $nom = basename($d);
          $lien = "sommaire.php?user=$user&base=$nom";
          echo "<th class=\"tico\"><a href=\"$lien\"><img class=\"ico\" src=\"./icons/folder.svg\" /></a></th>\n";
          echo "<th class=\"tnom\"><a class=\"lien\" href=\"$lien\">$nom</a></th>\n";
        }
        echo "</tr>\n";
      }
    ?>
  </table>
  <div id="gpl"><img id="exotice" src="exotice.svg" /><br/><img id="gplimg" src="icons/gpl-v3-logo-nb.svg" /><br/>© A. RENAUDIN 2016<br/>v <?php echo VERSION() ?></div>
</body>
</html>
