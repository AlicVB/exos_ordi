<?php
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
  if (isset($_POST["fic"]) && isset($_POST["v"])) 
  {
    //on veut juste sauvegarder les infos du livre
    header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
    $fic = $_POST["fic"];
    $v = $_POST["v"];
    file_put_contents($fic, $v);
  }
?>
