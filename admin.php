<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>exotice -- administration</title>
  <link rel="stylesheet" href="admin.css">
</head>

<body>
  <div id="bandeau">
    <a href="creation/creation.php"><img class="bimg" src="icons/applications-accessories.svg" title="gestion des livres et exercices"/></a>
    <a href="admin_users.php"><img class="bimg" src="icons/stock_people.svg" title="gestion des utilisateurs"/></a>
  </div>
  <div id="logs">
    <?php
      // si besoin, on efface l'exercice passé en paramètre
      if (isset($_GET['erase']) && isset($_GET['user']) && isset($_GET['exo']) && isset($_GET['livre']))
      {
        // on cherche le chemin du livre
        $livre = $_GET['livre'];
        $user = $_GET['user'];
        $exo = $_GET['exo'];
        $d = "./livres/$livre";
        if (!file_exists("$d/livre.txt"))
        {
          $d = "";
          $dirs = glob("./livres/*" , GLOB_ONLYDIR);
          for ($i=0; $i<count($dirs); $i++)
          {
            if (file_exists("$dirs[$i]/$livre/livre.txt"))
            {
              $d = "$dirs[$i]/$livre";
              break;
            }
          }
        }
        if ($d != "")
        {
          if (file_exists("$d/sauvegardes/$user/$exo.txt")) unlink("$d/sauvegardes/$user/$exo.txt");
          if (file_exists("$d/sauvegardes/$user/$exo.nb.txt")) unlink("$d/sauvegardes/$user/$exo.nb.txt");
        }
        else echo "livre $livre introuvable !";
        // on vide le log
        $f = "./log_exo/$user/$livre.txt";
        if (file_exists("$f"))
        {
          $lg = explode("\n", file_get_contents($f));
          $tx = "";
          for ($i=0; $i<count($lg); $i++)
          {
            $v = explode("|", $lg[$i]);
            if (count($v)<2 || basename($v[1]) != $exo) $tx .= "$lg[$i]\n";
          }
          file_put_contents($f, $tx);
        }
      }
    
      // on récupère la liste des exos pour chaque livre existant
      $dirs = glob("./livres/*" , GLOB_ONLYDIR);
      for ($i=0; $i<count($dirs); $i++)
      {
        $d = $dirs[$i];
        // on regarde si c'est un livre ou une catégorie
        if (file_exists("$d/livre.txt"))
        {
          $exos[basename("$d")] = glob("$d/exos/*" , GLOB_ONLYDIR);
        }
        else
        {
          $cats = glob("$d/*" , GLOB_ONLYDIR);
          for ($j=0; $j<count($cats); $j++)
          {
            $exos[basename("$cats[$j]")] = glob("$cats[$j]/exos/*" , GLOB_ONLYDIR);
          }
        }
      }
      // on affiche un bandeau par utilisateur ayant des logs enregistrés
      $dirs = glob('log_exo/*' , GLOB_ONLYDIR);
      for ($i=0; $i<count($dirs); $i++)
      {
        echo "<div class=\"ligne\">\n";
        $user = basename($dirs[$i]);
        echo "<div class=\"user\">$user</div>\n";
        $livres = glob("$dirs[$i]/*.txt");
        for ($j=0; $j<count($livres); $j++)
        {
          echo "<div class=\"livre\">\n";
          echo "<table class=\"ltable\"><tr>\n";
          $livre = substr(basename($livres[$j]),0,-4);
          echo "<th class=\"lnom\">$livre</th>\n";
          $exos_logs = explode("\n", file_get_contents($livres[$j]));
          // on parcoure tous les exos existants
          $txexos = "";
          $s = 0;
          $t = 0;
          for ($l=0; $l<count($exos["$livre"]); $l++)
          {
            $ex = basename($exos["$livre"][$l]);
            $dd = dirname(dirname($exos["$livre"][$l]));
            $ok=0;
            for ($k=0; $k<count($exos_logs); $k++)
            {
              $vals = explode("|", $exos_logs[$k]);
              if (count($vals) > 3 && basename($vals[1]) == $ex)
              {
                $s += $vals[2];
                $t += $vals[3];
                $p = 100*$vals[2]/$vals[3];
                $dt = date("d/m/y H:i", $vals[4]);
                $c = "#00A500";
                if ($p<=25) $c = "red";
                else if ($p<=50) $c = "#FFA500";
                else if ($p<=75) $c = "#1E90FF";
                $txexos .= "<span class=\"exo\" title=\"$ex : $dt\" style=\"background-color: $c;\">";
                $txexos .= "<a href=\"$dd/livre.php?user=$user&exo=$l\">";
                $txexos .= "$vals[2]/$vals[3]</a> ";
                $txexos .= "<a href=\"admin.php?erase=1&user=$user&livre=$livre&exo=$ex\"><img class=\"erimg\" src=\"./icons/draw-eraser.svg\" /></a></span>\n";
                $ok=1;
                break;
              }
            }
            if ($ok==0) $txexos .= "<span class=\"exo\" title=\"$ex : non fait\" style=\"background-color: #AFAFAF;\"><a href=\"$dd/livre.php?user=$user&exo=$l\">--/--</a></span>\n";
          }
          
          if ($t > 0) $s = ceil(100*$s/$t)."%";
          else $s = "--";
          echo "<th class=\"lscore\">$s</th>\n";
          echo "<th class=\"lexos\">\n$txexos";
          
          echo "</th>\n</tr></table>\n</div>\n";
        }
        echo "</div>\n";
      }
    ?>
  </div>
  <div id="bysa"><img src="icons/by-sa.png" />© A. RENAUDIN 2016</div>
</body>
</html>
