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
  <title>exotice -- utilisateur</title>
  <link rel="shortcut icon" href="icons/gnome-palm.png" >
  <link rel="stylesheet" href="index.css">
</head>

<body>
  <p class="titre">Clique sur ton nom...</p>
  <?php
    // on ouvre le fichier des utilisateurs
    $fic = "utilisateurs.txt";
    if (!file_exists($fic)) file_put_contents($fic, "__TEST__|XX|grey");

    $vals = array();
    if (file_exists($fic))
    {
      $vals = explode("\n", file_get_contents($fic));
    }
    
    // on compte le nb d'entrées non vides
    $nb = count($vals);
    if ($vals[$nb-1] == "") $nb--;
    
    // on crée une ligne par utilisateur
    // colonne 1
    echo "<div id=\"col1\">\n";
    for ($i=0; $i<ceil($nb/2-0.1); $i++)
    {
      $uvals=explode("|", $vals[$i]);
      if (count($uvals)>2)
      {
        echo "<p class=\"ligne\">\n";
        echo "<a class=\"nom\" style=\"background-color: $uvals[2];\" href=\"sommaire.php?user=$uvals[0]\">\n";
        echo "$uvals[0]\n";
        echo "</a></p>\n";
      }
    }
    echo "</div>\n";
    // colonne 2
    echo "<div id=\"col2\">\n";
    for ($i=ceil($nb/2-0.1); $i<$nb; $i++)
    {
      $uvals=explode("|", $vals[$i]);
      if (count($uvals)>2)
      {
        echo "<p class=\"ligne\">\n";
        echo "<a class=\"nom\" style=\"background-color: $uvals[2];\" href=\"sommaire.php?user=$uvals[0]\">\n";
        echo "$uvals[0]\n";
        echo "</a></p>\n";
      }
    }
    echo "</div>\n";
  ?>
  <div id="gpl"><img id="exotice" src="exotice.svg" /><br/><img id="gplimg" src="icons/gpl-v3-logo-nb.svg" /><br/>© A. RENAUDIN 2016<br/>v <?php echo VERSION() ?></div>
</body>
</html>
