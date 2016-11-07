<?php
  include("../core/maj.php");
  
function recursiveRemoveDirectory($directory)
{
    foreach(glob("{$directory}/*") as $file)
    {
        if(is_dir($file)) { 
            recursiveRemoveDirectory($file);
        } else {
            unlink($file);
        }
    }
    rmdir($directory);
}
function recurse_copy($src,$dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}
function free_path($fic)
{
  if (!file_exists($fic)) return $fic;
  $p1 = substr($fic, 0, -4);
  $p2 = substr($fic, -4);
  $i = 1;
  while (file_exists($p1."_".$i.$p2))
  {
    $i++;
  }
  return $p1."_".$i.$p2;
}
function livre_creation($dos)
{
  //on crée tout ce qu'il manque
  if (!file_exists("$dos")) mkdir("$dos", 0777, true);
  if (!file_exists("$dos/exos")) mkdir("$dos/exos", 0777, true);
  if (!file_exists("$dos/img")) mkdir("$dos/img", 0777, true);
  if (!file_exists("$dos/sons")) mkdir("$dos/sons", 0777, true);
  if (!file_exists("$dos/livre.php")) file_put_contents("$dos/livre.php", "<?php include(\"../../../core/livre.php\"); ?>");
  if (!file_exists("$dos/bilan.php")) file_put_contents("$dos/bilan.php", "<?php include(\"../../../core/bilan.php\"); ?>");
  if (!file_exists("$dos/compteur.php")) file_put_contents("$dos/compteur.php", "<?php include(\"../../../core/compteur.php\"); ?>");
  if (!file_exists("$dos/intro.php")) file_put_contents("$dos/intro.php", "<?php include(\"../../../core/intro.php\"); ?>");
  if (!file_exists("$dos/version")) copy("../VERSION", "$dos/version");
}
  
  //on traite d'abord des actions à faire
  if (isset($_GET['action']) && isset($_GET['exo']) && isset($_GET['cat']) && isset($_GET['livre']))
  {
    $dos = "../livres";
    $cat = $_GET['cat'];
    $dos .= "/$cat";
    $dos1 = "$dos/{$_GET['livre']}";
    $dos .= "/{$_GET['livre']}/exos";
    $dos2 = "$dos/{$_GET['exo']}";
    
    switch ($_GET['action'])
    {
      case "remove":
        if (file_exists($dos2)) recursiveRemoveDirectory($dos2);
        break;
      case "rmimg":
        if (file_exists("$dos1/{$_GET['exo']}")) unlink("$dos1/{$_GET['exo']}");
        $infos = explode("\n", file_get_contents("$dos1/livre.txt"));
        if (count($infos)>3) $infos[3] = "";
        file_put_contents("$dos1/livre.txt", implode("\n", $infos));
        break;
      case "saveimg":
        $dest = free_path("$dos1/img/{$_FILES['iimg']['name']}");
        copy($_FILES['iimg']['tmp_name'], $dest);
        $infos = explode("\n", file_get_contents("$dos1/livre.txt"));
        if (count($infos)>3) $infos[3] = "img/".basename($dest);
        file_put_contents("$dos1/livre.txt", implode("\n", $infos));
        break;
      case "copie":
        $exos = glob("$dos/*" , GLOB_ONLYDIR);
        $id = ord(basename($exos[count($exos)-1]));
        $id += 1;
        $n = chr($id);
        recurse_copy($dos2, "$dos/$n");
        break;
      case "up":
        $exos = glob("$dos/*" , GLOB_ONLYDIR);
        $pos = array_search($dos2, $exos);
        if ($pos > 0)
        {
          $tmp = "$dos/tmp";
          $n = $exos[$pos-1];
          rename($n, $tmp);
          rename($dos2, $n);
          rename($tmp, $dos2);
        }
        break;
      case "down":
        $exos = glob("$dos/*" , GLOB_ONLYDIR);
        $pos = array_search($dos2, $exos);
        if ($pos < count($exos)-1)
        {
          $tmp = "$dos/tmp";
          $n = $exos[$pos+1];
          rename($n, $tmp);
          rename($dos2, $n);
          rename($tmp, $dos2);
        }
        break;
    }
  }
  
  if (isset($_GET['cat']) && isset($_GET['livre']))
  {
    $cat = $_GET['cat'];
    $livre = $_GET['livre'];
    $dos = "../livres/$cat/$livre";
    livre_creation($dos);
    $titre = $livre;
    $aut = "";
    $coul = "#6D7BCF";
    $details = "";
    $img = "";
    //on essaie de lire le fichier descriptif
    if (file_exists("$dos/livre.txt"))
    {
      $infos = explode("\n", file_get_contents("$dos/livre.txt"));
      if (count($infos)>0) $titre = $infos[0];
      if (count($infos)>1) $coul = $infos[1];
      if (count($infos)>2) $aut = $infos[2];
      if (count($infos)>3) $img = $infos[3];
      for ($i=11; $i<count($infos); $i++)
      {
        if ($i>11) $details .= "\n";
        $details .= $infos[$i];
      }
    }
    else
    {
      file_put_contents("$dos/livre.txt", "$titre\n$coul\n\n\n\n\n\n\n\n\n");
    }
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- livres</title>
  <link rel="stylesheet" href="livre.css">
  <link rel="shortcut icon" href="../icons/gnome-palm.png" >
  <script type="text/javascript" src="../libs/jscolor.min.js"></script>
  <script type="text/javascript" src="livre.js"></script>
</head>

<body onload="start('<?php echo $aut; ?>')">
  <div id="bandeau">
    <a href="creation.php"><img class="bimg" src="../icons/applications-accessories.svg" title="gestion des livres et exercices"/></a>
    <a href="../admin_users.php"><img class="bimg" src="../icons/stock_people.svg" title="gestion des utilisateurs"/></a>
    <a href="../admin.php"><img class="bimg" src="../icons/edit-find-replace.svg" title="logs des exercices"/></a>
  </div>
<?php
    echo "<div class=\"col\">\n";
    echo "<div class=\"titre\">informations</div>\n";
    echo "<table>";
    echo "<tr>";
    echo "<td class=\"td1\">Titre du livre</td>";
    echo "<td class=\"td2\"><input type=\"text\" id=\"ititre\" size=\"30\" value=\"$titre\" onchange=\"infos_change('$dos/livre.txt')\"/></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Auteur</td>";
    echo "<td class=\"td2\"><input type=\"text\" id=\"iaut\" size=\"30\" value=\"$aut\" onchange=\"infos_change('$dos/livre.txt')\"/></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Couleur de fond</td>";
    echo "<td class=\"td2\"><input class=\"jscolor {hash:true}\" type=\"text\" id=\"icoul\" value=\"$coul\" onchange=\"infos_change('$dos/livre.txt')\" /></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Détails</td>";
    echo "<td class=\"td2\"><textarea id=\"idetails\" onchange=\"infos_change('$dos/livre.txt')\">$details</textarea></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Image principale</td>";
    echo "<td class=\"td2\">";
    if ($img != "" && file_exists("$dos/$img")) echo "<img id=\"iimg\" src=\"$dos/$img\" title=\"$dos/$img\" onload=\"iimg_load(this)\"/><a href=\"livre.php?cat=$cat&livre=$livre&action=rmimg&exo=$img\"><img class=\"eimg\" src=\"../icons/window-close.svg\" title=\"supprimer l'image\"/></a>";
    else echo "<form id=\"iimg_form\" action=\"livre.php?cat=$cat&livre=$livre&action=saveimg&exo=\" method=\"POST\" enctype=\"multipart/form-data\"><input type=\"file\" id=\"iimg\" name=\"iimg\" onchange=\"infos_img_change(this)\"/></form>";
    echo "</td>";
    echo "</tr>";
    echo "</table>";
    echo "</div>\n";
    echo "<div class=\"col\">\n";
    echo "  <div class=\"titre\">exercices</div>\n";
    echo "<table>";
    $exos = glob("$dos/exos/*" , GLOB_ONLYDIR);
    for ($i=0; $i<count($exos); $i++)
    {
      //on lit les détails de l'exo
      if (file_exists("$exos[$i]/exo.txt"))
      {
        $exo = basename("$exos[$i]");
        $et = "";
        $econs = "";
        $ecoul = "transparent";
        $infos = explode("\n", file_get_contents("$exos[$i]/exo.txt"));
        if (count($infos)>0) $et = $infos[0];
        if (count($infos)>1) $econs = $infos[1];
        if (count($infos)>10) $ecoul = $infos[10];
        // on écrit le bloc qui correspond
        echo "<tr style=\"background-color:$ecoul;\">\n";
        echo "<td class=\"td2\"><a class=\"ea\" href=\"crea_exo/infos.php?cat=$cat&livre=$livre&exo=$exo\">";
        echo "$et ($exos[$i])</a></td>\n";
        echo "<td class=\"td3\"><a href=\"livre.php?cat=$cat&livre=$livre&action=remove&exo=$exo\"><img class=\"eimg\" src=\"../icons/window-close.svg\" title=\"supprimer l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=copie&exo=$exo\"><img class=\"eimg\" src=\"../icons/tab-new.svg\" title=\"copier l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=up&exo=$exo\"><img class=\"eimg\" src=\"../icons/go-up.svg\" title=\"monter l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=down&exo=$exo\"><img class=\"eimg\" src=\"../icons/go-down.svg\" title=\"descendre l'exo\"/></a>\n";
        echo "</td></tr>\n";
      }
    }
    echo "</table>";
    echo "<div class=\"enew\"><button onclick=\"window.location.href='crea_exo/infos.php?cat=$cat&livre=$livre&exo='\">nouvel exercice</button>&nbsp;&nbsp;";
    echo "<select onchange=\"add_select(this, '$dos')\">";
    echo "<option value=\"\" selected>exercice existant...</option>";
    $it = new RecursiveDirectoryIterator("../livres/");
    foreach(new RecursiveIteratorIterator($it) as $file)
    {
      if (basename($file) == "exo.txt")
      {
        $v = explode("\n", file_get_contents($file));
        if (count($v) > 0)
        {
          $d = dirname(dirname(dirname($file)));
          $d = substr($d, 10);
          echo "<option value=\"".dirname($file)."\">$d - $v[0]</option>";
        }
      }
    }
    echo "</select>";
    echo "</div>";
    echo "</div>\n";
?>
  <div class="exotice"><img src="../exotice.svg" /> <span>v <?php echo VERSION() ?></span></div>
  <div class="copyright"><img src="../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div> 
</body>
</html>
