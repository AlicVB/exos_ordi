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

  // ces routines servent à mettre à jour les fichiers txt, php et autre entre les versions
  // il est destiné à être utilisé via un include et un appel de la fonction MAJ(dos) où dos est le dossier du livre ou de l'exercice
  //
  // note : si les fichiers "core" (exo.js, exo.css, ...) sont présent dans le dossier, il n'y a pas de mise à jour, car c'est sans doute des fichiers spécifiques
  function _V_get_fic()
  {
    $f = "";
    if (file_exists("VERSION")) $f = "VERSION";
    else if (file_exists("../VERSION")) $f = "../VERSION";
    else if (file_exists("../../VERSION")) $f = "../../VERSION";
    else if (file_exists("../../../VERSION")) $f = "../../../VERSION";
    else if (file_exists("../../../../VERSION")) $f = "../../../../VERSION";
    else if (file_exists("../../../../../VERSION")) $f = "../../../../../VERSION";
    return $f;
  }
  function VERSION()
  {
    $f = _V_get_fic();
    if ($f == "") return "??????";

    $v = explode("\n", file_get_contents("$f"));
    $v1 = (int)($v[0]/100000);
    $v2 = (int)(($v[0]%100000)/1000);
    $v3 = (int)(($v[0]%100000)%1000);
    if (count($v)>1) return $v1.".".$v2.".".$v3."_".$v[1];
    else return $v1.".".$v2.".".$v3;
  }

  function MAJ($dos)
  {
    // exemples de versions : 0.4.32 = 4032 || 3.6.214 = 306214
    // si pas de fichier version, on sort !
    if (!file_exists("$dos/version")) return;
    $FV = _V_get_fic();
    if ($FV == "") return;
    
    // on récupère les versions
    $v1 = explode("\n", file_get_contents("$dos/version"))[0];
    $v2 = explode("\n", file_get_contents("$FV"))[0];
    if ($v1 >= $v2) return;
    
    // on regarde si c'est un livre ou un exo
    $type = "";
    if (file_exists("$dos/livre.txt")) $type = "livre";
    else if (file_exists("$dos/exo.txt")) $type = "exo";
    if ($type == "") return;
    
    // if ($type == "livre" && $v1 < .....) $v1 = _MAJ_livre_xxxxx($dos);
    // if ($type == "exo" && $v1 < .....) $v1 = _MAJ_exo_xxxxx($dos);
  }

  /* function _MAJ_livre_4021($dos)
   * {
   *  //tout plein de trucs
   *  //
   *  //
   *  if (file_exists("$dos/version")) file_puts_contents("$dos/version", "4021");
   *  return 4021;
   * }
   * 
   * */
?>
