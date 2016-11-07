<?php
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
