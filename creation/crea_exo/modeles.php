<?php
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
  <img class="exotice" src="../../exotice.svg" />
  <div class="copyright"><img src="../../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
