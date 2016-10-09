<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- utilisateurs</title>
  <link rel="stylesheet" href="admin_users.css" >
</head>

<body>
  <div id="bandeau">
    <a href="creation/creation.php"><img class="bimg" src="icons/applications-accessories.svg" title="gestion des livres et exercices"/></a>
    <a href="admin.php"><img class="bimg" src="icons/edit-find-replace.svg" title="logs des exercices"/></a>
  </div>
  <div id="logs">
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
      couleur : rouge, vert, bleu, blanc, gris, orange<br/><br/>
      Attention AUCUN '/*."      
    </div>
    <div id="forme">
      <form action="admin_users.php" method="post">
        <textarea name="texte" rows="36" cols="60"><?php echo file_get_contents("utilisateurs.txt");?></textarea>
        <input type="submit" value="Sauvegarder" />
      </form>
    </div>
  </div>
</body>
</html>
