<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Formulaire d'identification</title>
  <link rel="stylesheet" href="index.css">
</head>

<body>
  <p class="titre">Clique sur ton nom...</p>
  <?php
    // on ouvre le fichier des utilisateurs
    $fic = "utilisateurs.txt";
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
  <div id="bysa"><img src="icons/by-sa.png" />© A. RENAUDIN 2016</div>
</body>
</html>
