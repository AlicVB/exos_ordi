<?php
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
    <div class="cat_ligne"><a class="acat" href="view_cat.php?cat=" style="color:black;">Livres sans categorie</a></div>
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
  <img class="exotice" src="../exotice.svg" />
  <div class="copyright"><img src="../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
