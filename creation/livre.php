<?php
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
  //on traite d'abord des actions à faire
  if (isset($_GET['action']) && isset($_GET['exo']) && isset($_GET['cat']) && isset($_GET['livre']))
  {
    $dos = "../livres";
    $cat = $_GET['cat'];
    if ($cat != "") $dos .= "/$cat";
    $dos .= "/{$_GET['livre']}/exos";
    $dos2 = "$dos/{$_GET['exo']}";
    
    switch ($_GET['action'])
    {
      case "remove":
        if (file_exists($dos2)) recursiveRemoveDirectory($dos2);
        break;
      case "rmimg":
        if (file_exists($dos2)) unlink($dos2);
        $infos = explode("\n", file_get_contents("$dos/livre.txt"));
        if (count($infos)>3) $infos[3] = "";
        file_put_contents("$dos/livre.txt", implode("\n", $infos));
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
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- livres</title>
  <link rel="stylesheet" href="livre.css">
  <script type="text/javascript" src="../libs/jscolor.min.js"></script>
  <script type="text/javascript" src="livre.js"></script>
</head>

<body>
<?php
  if (isset($_GET['cat']) && isset($_GET['livre']))
  {
    $cat = $_GET['cat'];
    $livre = $_GET['livre'];
    $dos = "../livres";
    if ($cat != "") $dos .= "/$cat";
    $dos .= "/$livre";
    //si le dossier n'existe pas, on le crée
    if (!file_exists("$dos")) mkdir("$dos", 0777, true);
    if (!file_exists("$dos/exos")) mkdir("$dos/exos", 0777, true);
    $titre = $livre;
    $aut = "";
    $coul = "#ffffff";
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
    echo "<div class=\"col\">\n";
    echo "<div class=\"titre\">informations</div>\n";
    echo "<table>";
    echo "<tr>";
    echo "<td class=\"td1\">Titre du livre</td>";
    echo "<td class=\"td2\"><input type=\"text\" id=\"ititre\" size=\"30\" value=\"$titre\" onchange=\"infos_change(this)\"/></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Auteur</td>";
    echo "<td class=\"td2\"><input type=\"text\" id=\"iaut\" size=\"30\" value=\"$aut\" onchange=\"infos_change(this)\"/></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Couleur de fond</td>";
    echo "<td class=\"td2\"><input class=\"jscolor {hash:true}\" type=\"text\" id=\"icoul\" value=\"$coul\" onchange=\"infos_change(this)\" /></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Détails</td>";
    echo "<td class=\"td2\"><textarea id=\"idetails\" onchange=\"infos_change(this)\">$details</textarea></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td class=\"td1\">Image principale</td>";
    echo "<td class=\"td2\">";
    if (file_exists("$dos/$img")) echo "<img src=\"$dos/$img\" title=\"$dos/$img\" onload=\"iimg_load(this)\"/><a href=\"livre.php?cat=$cat&livre=$livre&action=rmimg&exo=$img\"><img class=\"eimg\" src=\"../icons/window-close.svg\" title=\"supprimer l'image\"/></a>";
    else echo "<input type=\"file\" id=\"iimg\" onchange=\"infos_img_change(this)\"/>";
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
        echo "<td class=\"td2\"><a class=\"ea\" href=\"create_exo.php?cat=$cat&livre=$livre&exo=$exo\">";
        echo "$et ($exos[$i])</a></td>\n";
        echo "<td><a href=\"livre.php?cat=$cat&livre=$livre&action=remove&exo=$exo\"><img class=\"eimg\" src=\"../icons/window-close.svg\" title=\"supprimer l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=copie&exo=$exo\"><img class=\"eimg\" src=\"../icons/tab-new.svg\" title=\"copier l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=up&exo=$exo\"><img class=\"eimg\" src=\"../icons/go-up.svg\" title=\"monter l'exo\"/></a>\n";
        echo "<a href=\"livre.php?cat=$cat&livre=$livre&action=down&exo=$exo\"><img class=\"eimg\" src=\"../icons/go-down.svg\" title=\"descendre l'exo\"/></a>\n";
        echo "</td></tr>\n";
      }
    }
    echo "</table>";
    echo "</div>\n";
  }
?>
</body>
</html>
