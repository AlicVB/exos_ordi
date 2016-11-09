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
  // on ajoute la catégorie si besoin
   if (isset($_GET['add']))
   {
     $cat = $_GET['add'];
     if ($cat != "")
     {
       $d = "../livres/$cat";
       if (!file_exists("$d"))
       {
         mkdir("$d", 0777, true);
       }
     }
   }
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- categories</title>
  <link rel="shortcut icon" href="../icons/gnome-palm.png" >
  <link rel="stylesheet" href="creation.css">
  <script>
    function add_new()
    {
      txt = prompt("nom de la catégorie", "");
      if (!txt || txt == "") return;
      location.href = "creation.php?add=" + txt;
    }
  </script>
</head>

<body>
  <div id="bandeau">
    <a href="../admin_users.php"><img class="bimg" src="../icons/stock_people.svg" title="gestion des utilisateurs"/></a>
    <a href="../admin.php"><img class="bimg" src="../icons/edit-find-replace.svg" title="logs des exercices"/></a>
  </div>
  <div id="logs">
    <div class="cat">catégories</div>
    <?php
      // on parcoure toutes les categories
      $cats = glob("../livres/*" , GLOB_ONLYDIR);
      for ($i=0; $i<count($cats); $i++)
      {
        if (!file_exists("$cats[$i]/livre.txt"))
        {
          $cat = basename($cats[$i]);
          echo "<div class=\"cat_ligne\"><a class=\"acat\" href=\"view_cat.php?cat=$cat\">$cat</a></div>\n";
        }
      }
    ?>
    <div class="cat_ligne"><a class="acat" href="#" style="color:orange;" onclick="add_new()">+ nouvelle catégorie...</a></div>
  </div>
  <div class="exotice"><img src="../exotice.svg" /> <span>v <?php echo VERSION() ?></span></div>
  <div class="copyright"><img src="../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
