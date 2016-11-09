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

  include("../../core/maj.php");
  //gestion des actions à effectuer
  if (isset($_GET['def']))
  {
    $v = $_GET['def'];
    if (file_exists("modeles/".$v)) file_put_contents("default_modele.txt", $v);
  }
  else if (isset($_GET['del']))
  {
    $v = $_GET['del'];
    if (file_exists("modeles/".$v)) unlink("modeles/".$v);
  }
  
  //récupération de la liste des modeles
  $modeles = glob("modeles/*");
  
  //et du modele par defaut
  if (file_exists("default_modele.txt")) $def = file_get_contents("default_modele.txt");
  else $def = "basic";
  if (!file_exists("modeles/".$def)) $def = "basic";
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- modèles</title>
  <link rel="shortcut icon" href="../../icons/gnome-palm.png" >
  <link rel="stylesheet" href="modeles.css">
</head>

<body>
  <div id="logs">
    <div class="cat">Modèles généraux d'exercices</div>
    <table id="liste">
      <?php
        for ($i=0; $i<count($modeles); $i++)
        {
          $m = basename($modeles[$i]);
          echo "<tr class=\"";
          if ($m == $def) echo "trdef";
          else echo "tr1";
          echo "\"><td class=\"td1\">".$m."</td>";
          echo "<td class=\"td2\">";
          if ($m == $def) echo "<img src=\"../../icons/dialog-apply-nb.svg\"/>";
          else echo "<a href=\"modeles.php?def=".$m."\"><img src=\"../../icons/dialog-apply.svg\"/></a>";
          if ($m == "basic") echo "<img src=\"../../icons/window-close-nb.svg\"/>";
          else echo "<a href=\"modeles.php?del=".$m."\"><img src=\"../../icons/window-close.svg\"/></a>";
          echo "</td>";
          echo "</tr>";
        }
      ?>
    </table>
  </div>
  <div class="exotice"><img src="../../exotice.svg" /> <span>v <?php echo VERSION() ?></span></div>
  <div class="copyright"><img src="../../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
