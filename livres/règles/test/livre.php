<?php 
  // infos sur le chemin du livre
  $livreid = basename(dirname($_SERVER['PHP_SELF']));
  $cat = basename(dirname(dirname($_SERVER['PHP_SELF'])));
  $root = "../../..";
  if ($cat == "livres")
  {
    $root = "../..";
    $cat = "";
  }
  
  // infos sur le livre
  $titre_livre = "";
  if (file_exists("livre.txt"))
  {
    // on récupère le titre du livre
    $infos = explode("\n", file_get_contents("livre.txt"));
    $titre_livre = $infos[0];
    $coul_livre = $infos[1];
    $aut_livre = $infos[2];
    $img_livre = $infos[3];
  }
  
  // et sur les exos
  $exos = glob("./exos/*" , GLOB_ONLYDIR);
  
  // on récupère les paramètres
  $user = (isset($_GET["user"])) ? $_GET["user"] : "";
  if (file_exists("./sauvegardes/$user") == false) mkdir("./sauvegardes/$user", 0777, true);
  
  // on cherche l'exo en cours
  $exo = 0;
  $lien_pre = "";
  $lien_next = "";
  if (isset($_GET["exo"]))
  {
    $exo = $_GET["exo"];
    // on sauvegarde
    file_put_contents("./sauvegardes/$user/pos.txt",$exo);
  }
  else
  {
    // on recherche la dernière position
    if (file_exists("./sauvegardes/$user/pos.txt"))
    {
      $infos = explode("\n", file_get_contents("./sauvegardes/$user/pos.txt"));
      $exo = $infos[0];
    }
    else file_put_contents("./sauvegardes/$user/pos.txt",$exo);
  }
  if ($exo > 0)
  {
    $nb = $exo - 1;
    $lien_pre = "livre.php?user=$user&exo=$nb";
  }
  if ($exo < count($exos)-1)
  {
    $nb = $exo + 1;
    $lien_next = "livre.php?user=$user&exo=$nb";
  }
  else if ($exo == count($exos)-1) $lien_next = "bilan.php?user=$user";

  // on supprime les trucs enregistrés si besoin
  if (isset($_GET["erase"]))
  {
    $f = basename("$exos[$exo]");
    if (file_exists("./sauvegardes/$user/$f.txt")) unlink("./sauvegardes/$user/$f.txt");
  }
  
  // on récupère les infos sur l'exercice en cours
  $txt_exo = file_get_contents("$exos[$exo]/exo.txt");
  $vals = explode("\n", $txt_exo);
  $titre_exo = $vals[0];
  $consigne = $vals[1];
  $exo_coul = $vals[10];
  $txt = htmlentities(str_replace("\n", "§", addslashes($txt_exo)));
?>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo "$titre_livre -- $titre_exo" ?></title>
    <script type="text/javascript" src="<?php echo $exos[$exo] ?>/exo.js"></script>
    <script type="text/javascript" src="livre.js"></script>
    <link rel="stylesheet" href="livre.css">
    <link rel="stylesheet" href="<?php echo $root ?>/libs/dragula.min.css">
    <link rel="stylesheet" href="<?php echo $exos[$exo] ?>/exo.css">
  </head>
  <body onload="charge('<?php echo $user ?>', '<?php echo $livreid ?>', '<?php echo $exos[$exo] ?>', '<?php echo $txt ?>', '<?php echo $root ?>/');" style="background-color: <?php echo $coul_livre ?>;">
    <script type="text/javascript" src="<?php echo $root ?>/libs/dragula.min.js"></script>
    <div id="c2" style="background-color: <?php echo $exo_coul ?>;">
      <span id="titrelivre"><?php echo $titre_livre ?></span>
      <br/><span id="titreexo"><?php echo $titre_exo ?></span>
      <br/><div id="consigne"><?php echo $consigne ?></div>
      <br/>
      <div id="aideimg">
        <img src="<?php echo $root ?>/icons/help-hint.svg" onmouseover="affiche_aide(true);" onmouseout="affiche_aide(false);" />
      </div>
      <div id="corr">
        <table id="ctable">
          <tr><th colspan="3" id="cscore">Sujets : 10/10 -- Verbes : 10/10</th></tr>
          <tr>
            <th id="cflag"><img id="cflagimg" src="<?php echo $root ?>/icons/flag-red.svg" /></th>
            <th id="ctxt">--</th>
            <th id="cbtn"><img id="cbtnimg" src="<?php echo $root ?>/icons/edit-find-replace.svg" onclick="affiche_score(true);" /></th>
          </tr>
        </table>
      </div>
      <div id="bas">
        <?php
          if ($lien_pre != "") echo "<a href=\"$lien_pre\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"$root/icons/go-previous.svg\" /></a>\n";
          for ($i=0; $i<count($exos); $i++)
          {
            $j = $i + 1;
            $cl = "page";
            if ($i < $exo) $cl = "pageavant";
            else if ($i == $exo) $cl = "pagecours";
            echo "<a class=\"$cl\" href=\"livre.php?user=$user&exo=$i\">$j</a>\n";
          }
          echo "<a class=\"pagebilan\" href=\"bilan.php?user=$user\">B</a>\n";
          if ($lien_next != "") echo "<a href=\"$lien_next\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"$root/icons/go-next.svg\" /></a>\n";
        ?>
      </div>
      <img id="aide" src="<?php echo $img_livre ?>"  onload="intro_img_load(this)"/>
      <div id="exitdiv">
        <a href="<?php echo $root ?>/sommaire.php?user=<?php echo $user ?>"><img id="exitimg" src="<?php echo $root ?>/icons/system-shutdown.svg" /></a>
        <a id="erasea" href="livre.php?user=<?php echo $user ?>&exo=<?php echo $exo ?>&erase=1"><img id="eraseimg" src="<?php echo $root ?>/icons/draw-eraser.svg" /></a>
      </div>
    </div>
    <div id="c1" style="background-color: <?php echo $exo_coul ?>;">
      <span id="user">Prénom : <?php echo $user ?></span>
      <?php include "$exos[$exo]/exo.php" ?>
      <?php
        // coins page
        if ($lien_next != "")
        {
          echo "<a href=\"$lien_next\"><img class=\"coin_d\" id=\"coinimg\" src=\"$root/icons/go-next_coin.svg\" /></a>\n";
        }
      ?>
    </div>
    <div id="bysa"><img src="<?php echo $root ?>/icons/by-sa.png" /><span style="color: <?php echo $coul_livre ?>">© <?php echo $aut_livre ?></span></div>
  </body>
</html>
