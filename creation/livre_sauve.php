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

function wd_remove_accents($str, $charset='utf-8')
{
    $str = htmlentities($str, ENT_NOQUOTES, $charset);
    
    $str = preg_replace('#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str);
    $str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str); // pour les ligatures e.g. '&oelig;'
    $str = preg_replace('#&[^;]+;#', '_', $str); // supprime les autres caractères
    
    return $str;
}

  if (isset($_GET['export']) && isset($_GET['exo']) && isset($_GET['nom']))
  {
    //on veut offrir au téléchargement un zip de l'exercice
    $exo = urldecode($_GET['exo']);
    $nom = urldecode($_GET['nom']);
    $nom = wd_remove_accents($nom);
    $nom = preg_replace("/[^A-Za-z0-9]/", "_", $nom);
    $files = array("charge.php", "exo.css", "exo.js", "exo.php", "exo.txt", "exo_sav.txt", "sauve.php");

    # create new zip opbject
    $zip = new ZipArchive();

    # create a temp file & open it
    $tmp_file = tempnam('.','');
    $zip->open($tmp_file, ZipArchive::CREATE);

    # loop through each file
    foreach($files as $file)
    {
      $f = $exo.$file;
      # download file
      $download_file = file_get_contents($f);
      #add it to the zip
      $zip->addFromString($file,$download_file);
    }

    # close zip
    $zip->close();

    # send the file to the browser as a download
    header("Content-disposition: attachment; filename=$nom.zip");
    header('Content-type: application/zip');
    readfile($tmp_file);
  }
  else if (isset($_POST["copy"]) && isset($_POST["dest"]) && isset($_POST["src"]))
  {
    $dest = $_POST["dest"];
    $src = $_POST["src"];
    $src2 = dirname(dirname($src));
    //on détermine le dossier du nouvel exercice
    $exos = glob("$dest/exos/*" , GLOB_ONLYDIR);
    if (count($exos)>0) $exo = chr(ord(basename($exos[count($exos)-1])) + 1);
    else $exo = "A";
    $dest2 = "$dest/exos/$exo";
    //on copie les fichier "classiques"
    if (!file_exists($dest2)) mkdir("$dest2", 0777, true);
    $fics = glob("$src/*");
    for($i=0; $i<count($fics); $i++)
    {
      copy($fics[$i], "$dest2/".basename($fics[$i]));
    }
    
    //et on s'occupe des images et des sons
    preg_match_all("/src=\"([^\"]*)\"/", file_get_contents("$dest2/exo.php"), $matches);
    for ($i=0; $i<count($matches[1]); $i++)
    {
      $img = $matches[1][$i];
      if (file_exists("$dest/$img")) continue;
      if (!file_exists("$src2/$img")) continue;
      copy("$src2/$img", "$dest/$img");
    }
  }
  else if (isset($_POST["fic"]) && isset($_POST["v"])) 
  {
    //on veut juste sauvegarder les infos du livre
    header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
    $fic = $_POST["fic"];
    $v = $_POST["v"];
    file_put_contents($fic, $v);
    //on met à jour le fichier de version
    copy("../VERSION", dirname($fic)."/version");
  }
?>
