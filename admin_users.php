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
  $fic = "utilisateurs.txt";
  if (!file_exists($fic)) file_put_contents($fic, "__TEST__|XX|grey");
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- utilisateurs</title>
  <link rel="shortcut icon" href="icons/gnome-palm.png" >
  <link rel="stylesheet" href="admin_users.css" >
</head>

<body>
  <div id="bandeau">
    <a href="creation/creation.php"><img class="bimg" src="icons/applications-accessories.svg" title="gestion des livres et exercices"/></a>
    <a href="admin.php"><img class="bimg" src="icons/edit-find-replace.svg" title="logs des exercices"/></a>
  </div>
  <div id="logs">
    <div class="cat">Utilisateurs</div>
    <div id="aide">
      <?php
        if (isset($_POST['texte']))
        {
          $txt = $_POST['texte'];
          file_put_contents("utilisateurs.txt", $txt);
          echo "fichier sauvegardé...<br/><br/>";
        }
      ?>
      Aide :<br/><br/>
      chaque ligne doit être de la forme :<br/>
      prénom|classe|couleur<br/><br/>
      prénom : doit être UNIQUE<br/>
      classe : peu importe<br/>
      couleur au format html (couleur en Anglais, #XXXXXX, rgb(xx,xx,xx), ...)<br/><br/>
      Attention AUCUN charactère : '/*."      
    </div>
    <div id="forme">
      <form action="admin_users.php" method="post">
        <textarea name="texte" rows="36" cols="60"><?php echo file_get_contents("utilisateurs.txt");?></textarea>
        <input type="submit" value="Sauvegarder" />
      </form>
    </div>
  </div>
  <div class="exotice"><img src="exotice.svg" /> <span>v <?php echo VERSION() ?></span></div>
  <div class="copyright"><img src="icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
