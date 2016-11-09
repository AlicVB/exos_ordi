<?php
 /*
    --En-tête officielle pour dire que ce code est sous une licence "libre" (plus d'infos: https://fr.wikipedia.org/wiki/Licence_publique_g%C3%A9n%C3%A9rale_GNU)--
    
    Copyright (C) A.RENAUDIN  Developer

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
*/

  include("../../../core/maj.php");
  $user = (isset($_GET["user"])) ? $_GET["user"] : "";

  // infos sur le livre
  $titre_livre = "";
  if (file_exists("livre.txt"))
  {
    // on récupère le titre du livre
    $infos = explode("\n", file_get_contents("livre.txt"));
    $titre_livre = $infos[0];
    
    // et les détails
    $coul = $infos[1];
    $aut = $infos[2];
    $img = $infos[3];
    
    //et les détails
    $details = "";
    for ($i=11; $i<count($infos); $i++)
    {
      if ($infos[$i] != "")
      {
        if ($i > 11) $details .= "<br/>";
        $details .= $infos[$i];
      }    
    }
  }
?> 
 
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo $titre_livre ?></title>
    <link rel="stylesheet" href="../../../core/intro.css">
    <script type="text/javascript" src="../../../core/livre.js"></script>
  </head>
  
  <body style="background-color: <?php echo $coul ?>;" onresize="intro_img_load()">
    <div id="c1">
      <div id="titrelivre"><?php echo $titre_livre ?></div>
      <br/><div id="details"><?php echo $details ?></div>
      <div id="basdiv">
        <div id="gotxt">On y va !</div>
        <a href="livre.php?user=<?php echo $user ?>&exo=0"><img id="goimg" src="../../../icons/go-next.svg" /></a>
        <div id="bysa" title="livre créé par <?php echo $aut ?> -- licence Creative Commons CC-BY-SA"><img src="../../../icons/cc.svg" /><span> <?php echo $aut ?></span></div>
      </div>
    </div>
    <img id="aideimg" src="<?php echo $img ?>" onload="intro_img_load()"/>
    <div id="gpl"><img id="exotice" src="../../../exotice.svg" /><br/><img id="gplimg" src="../../../icons/gpl-v3-logo-nb.svg" /><br/>© A. RENAUDIN 2016<br/>v <?php echo VERSION() ?></div>
  </body>
</html>

