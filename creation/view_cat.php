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

  include("../core/maj.php");
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- livres</title>
  <link rel="shortcut icon" href="../icons/gnome-palm.png" >
  <link rel="stylesheet" href="creation.css">
  <script>
    function add_new(cat)
    {
      txt = prompt("nom du livre", "");
      if (!txt || txt == "") return;
      
      location.href = "livre.php?livre=" + txt + "&cat=" + cat;
    }
  </script>
</head>

<body>
  <div id="bandeau">
    <a href="creation.php"><img class="bimg" src="../icons/applications-accessories.svg" title="gestion des livres et exercices"/></a>
    <a href="../admin_users.php"><img class="bimg" src="../icons/stock_people.svg" title="gestion des utilisateurs"/></a>
    <a href="../admin.php"><img class="bimg" src="../icons/edit-find-replace.svg" title="logs des exercices"/></a>
  </div>
  <div id="logs">
    <div class="cat">Catégories : 
      <?php
      if (isset($_GET['cat']))
      {
        $cat = $_GET['cat'];
        echo " $cat";
        echo "</div>";
        $cat = $_GET['cat'];
        // on parcoure tous les livres de la categorie
        $livres = glob("../livres/$cat/*" , GLOB_ONLYDIR);
        for ($i=0; $i<count($livres); $i++)
        {
          //on regarde si le fichier du livre existe
          if (file_exists("$livres[$i]/livre.txt"))
          {
            $livre = basename($livres[$i]);
            echo "<div class=\"cat_ligne\"><a class=\"acat\" href=\"livre.php?livre=$livre&cat=$cat\">$livre</a></div>\n";
          }
        }
        $ncat = urlencode($cat);
        echo "<div class=\"cat_ligne\"><a class=\"acat\" href=\"#\" style=\"color:orange;\" onclick=\"add_new('{$cat}')\">+ nouveau livre...</a></div>";
      }
    ?>
    
  </div>
  <div class="exotice"><img src="../exotice.svg" /> <span>v <?php echo VERSION() ?></span></div>
  <div class="copyright"><img src="../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
