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
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "./sauvegardes/$user/$exoid.nb.txt";
    
    if (file_exists("./sauvegardes/$user") == false) mkdir("./sauvegardes/$user", 0777, true);
    
    // on lit le fichier
    $txt = 0;
    if (file_exists($fic)) $txt = explode("\n", file_get_contents($fic))[0];
    
    // on traite les valeurs
    if (isset($_GET["action"]))
    {
      if ($_GET["action"] == "plus") $txt += 1;
      else if ($_GET["action"] == "moins") $txt -= 1;
      else if ($_GET["action"] == "reset") $txt = 0;
    }
    file_put_contents($fic, $txt);
    // on renvoi la valeur finale
    echo $txt;
  }
?>
