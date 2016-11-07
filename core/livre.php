<?php 
  include("../../../core/maj.php");
  
  // infos sur le chemin du livre
  $livreid = basename(dirname($_SERVER['PHP_SELF']));
  
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
  $exo_audio = "";
  if (count($vals)>11) $exo_audio = $vals[11];
  $exo_image = $img_livre;
  $exo_image_hover = "0";
  if (count($vals)>13)
  {
    $vv = explode("|", $vals[13]);
    if (count($vv)>1)
    {
      $exo_image = "img/".$vv[0];
      $exo_image_hover = $vv[1];
    }
  }
  if ($exo_image == "") $exo_image = $img_livre;
  $txt = htmlentities(str_replace("\n", "§", addslashes($txt_exo)));
?>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo "$titre_livre -- $titre_exo" ?></title>
    <script type="text/javascript" src="../../../core/exo.js"></script>
    <script type="text/javascript" src="../../../core/livre.js"></script>
    <link rel="shortcut icon" href="../../../icons/gnome-palm.png" >
    <link rel="stylesheet" href="../../../core/livre.css">
    <link rel="stylesheet" href="../../../core/exo.css">
    <link rel="stylesheet" href="../../../core/livre_print.css" media="print">
  </head>
  <body onload="livre_ini('<?php echo $user ?>', '<?php echo $livreid ?>', '<?php echo $exos[$exo] ?>', '<?php echo $txt ?>', '../../../');" style="background-color: <?php echo $coul_livre ?>;">
    <div id="c2" style="background-color: <?php echo $exo_coul ?>;">
      <span id="version2" ><span id="version">v&nbsp;&nbsp;<?php echo VERSION() ?></span></span>
      <span id="titrelivre"><?php echo $titre_livre ?></span>
      <br/><span id="titreexo"><?php echo $titre_exo ?></span>
      <br/><div id="consigne">
        <?php
          if ($exo_audio != "") echo "<img src=\"../../../icons/audacity.svg\" onclick=\"consigne_play()\"/><audio id=\"consigne_audio\" src=\"$exo_audio\"></audio>";
          echo $consigne;
        ?>
      </div>
      <br/>
      <?php
        if ($exo_image_hover == "0")
        {
          echo "<div id=\"aideimg\"><img src=\"../../../icons/help-hint.svg\" onmouseover=\"affiche_aide(true);\" onmouseout=\"affiche_aide(false);\" /></div>";
        }
      ?>
      <div id="corr">
        <table id="ctable">
          <tr><th colspan="3" id="cscore">Sujets : 10/10 -- Verbes : 10/10</th></tr>
          <tr>
            <th id="cflag"><img id="cflagimg" src="../../../icons/flag-red.svg" /></th>
            <th id="ctxt">--</th>
            <th id="cbtn"><img id="cbtnimg" src="../../../icons/edit-find-replace.svg" onclick="affiche_score(true);" /></th>
          </tr>
        </table>
      </div>
      <div id="bas">
        <?php
          if ($lien_pre != "") echo "<a href=\"$lien_pre\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"../../../icons/go-previous.svg\" /></a>\n";
          for ($i=0; $i<count($exos); $i++)
          {
            $j = $i + 1;
            $cl = "page";
            if ($i < $exo) $cl = "pageavant";
            else if ($i == $exo) $cl = "pagecours";
            echo "<a class=\"$cl\" href=\"livre.php?user=$user&exo=$i\">$j</a>\n";
          }
          echo "<a class=\"pagebilan\" href=\"bilan.php?user=$user\">B</a>\n";
          if ($lien_next != "") echo "<a href=\"$lien_next\"><img style=\"height: 3vh; vertical-align: bottom;\" src=\"../../../icons/go-next.svg\" /></a>\n";
        ?>
      </div>
      <?php if ($exo_image_hover == "0") echo "<img id=\"aide\" src=\"$exo_image\"  onload=\"intro_img_load(this)\"/>"; ?>
      <div id="exitdiv">
        <a href="../../../sommaire.php?user=<?php echo $user ?>"><img id="exitimg" src="../../../icons/edit-undo.svg" /></a>
        <img onclick="page_print()" id="exitimg" src="../../../icons/printer.svg" />
        <a id="erasea" href="livre.php?user=<?php echo $user ?>&exo=<?php echo $exo ?>&erase=1"><img id="eraseimg" src="../../../icons/draw-eraser.svg" /></a>
      </div>
    </div>
    <?php if ($exo_image_hover != "0") echo "<img id=\"aide\" src=\"$exo_image\"/>"; ?>
    <div id="c1" style="background-color: <?php echo $exo_coul ?>;">
      <span sss="20" id="user">Prénom : <?php echo $user ?></span>
      <?php include "$exos[$exo]/exo.php" ?>
      <?php
        // coins page
        if ($lien_next != "")
        {
          echo "<a href=\"$lien_next\"><img class=\"coin_d\" id=\"coinimg\" src=\"../../../icons/go-next_coin.svg\" /></a>\n";
        }
      ?>
      <img id="exotice" src="../../../exotice.svg" />
      <div sss="15" id="bysa"><img id="cc_img" src="../../../icons/cc.svg" /><span> <?php echo $aut_livre ?></span></div>
    </div>
  </body>
</html>
