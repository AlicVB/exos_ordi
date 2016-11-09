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

header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 


$user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
$livreid = (isset($_GET["livreid"])) ? $_GET["livreid"] : NULL;
$exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
$score = (isset($_GET["score"])) ? $_GET["score"] : NULL;
$tot = (isset($_GET["tot"])) ? $_GET["tot"] : NULL;
$dt = time();

if ($user && $exoid && $livreid) 
{
  // nom du fichier de sauvegarde
  $fic = "log_exo/$user/$livreid.txt";
  
  // on crée les répertoires si besoin
  mkdir("log_exo/$user", 0777, true);

  // ligne a écrire
  $ligne = "$livreid|$exoid|$score|$tot|$dt";
  
  // on crée/charge la liste des valeurs
  $vals = array();
  $ok=false;
  if (file_exists($fic))
  {
    $vals = explode("\n", file_get_contents($fic));
  }
  for ($i=0; $i<count($vals); $i++)
  {
    $v = explode("|", $vals[$i]);
    if (count($v)>2 && $v[1]==$exoid && $v[0]==$livreid)
    {
      $vals[$i] = $ligne;
      $ok = true;
      break;
    }
  }
  if ($ok == false) $vals[] = $ligne;
  
  //et on réécrit le tout dans le fichier
  file_put_contents($fic, implode("\n", $vals));
}

?>
