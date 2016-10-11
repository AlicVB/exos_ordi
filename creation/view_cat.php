<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- livres</title>
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
    <div class="cat">Catégorie : 
      <?php
      if (isset($_GET['cat']))
      {
        $cat = $_GET['cat'];
        if ($cat == "") echo " Livres sans catégories";
        else echo " $cat";
        echo "</div>";
        $cat = $_GET['cat'];
        // on parcoure tous les livres de la categorie
        $tx = "../livres";
        if ($cat != "") $tx .= "/$cat";
        $livres = glob("$tx/*" , GLOB_ONLYDIR);
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
</body>
</html>
