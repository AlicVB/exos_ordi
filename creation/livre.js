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

"use strict";

function readCookie(name) {
	let nameEQ = name + "=";
	let ca = document.cookie.split(';');
	for(let i=0;i < ca.length;i++) {
		let c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function iimg_load(e)
{
  //on veut que l'image rentre dans un carré de 300x300
  if (e.offsetWidth>e.offsetHeight) e.style.width = "300px";
  else e.style.height = "300px";
}

function infos_img_change(e)
{
  e.form.submit();
}

function infos_change(fic)
{
  //on construit la chaine totale à mettre dans le fichier livre.txt
  let txt = document.getElementById("ititre").value;
  txt += "\n" + document.getElementById("icoul").value;
  txt += "\n" + document.getElementById("iaut").value;
  if (document.getElementById("iimg")) txt += "\n" + document.getElementById("iimg").src;
  else txt += "\n";
  txt += "\n\n\n\n\n\n\n\n";
  txt += document.getElementById("idetails").value;
  
  let xhr = new XMLHttpRequest();
  let ligne = "fic=" + fic + "&v=" + txt;
  xhr.open("POST", "livre_sauve.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(ligne);
  
  //on sauvegarde aussi en local le nom de l'auteur
  document.cookie = "auteur=" + document.getElementById("iaut").value + "; expires=Sun, 28 Feb 8888 00:00:00 UTC";
}

function start(aut)
{
  if (aut == "")
  {
    let rep = readCookie("auteur");
    if (rep) document.getElementById("iaut").value = rep;
  }
}

function add_select(e, dos)
{
  if (e.value != "")
  {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
      {
        // on met les bonnes valeurs aux bons endroits
        window.location.reload(true);
      }
    };
    let ligne = "copy=&dest=" + dos + "&src=" + e.value;
    xhr.open("POST", "livre_sauve.php" , true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(ligne);
  }
}
