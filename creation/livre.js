function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
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
  txt = document.getElementById("ititre").value;
  txt += "\n" + document.getElementById("icoul").value;
  txt += "\n" + document.getElementById("iaut").value;
  if (document.getElementById("iimg")) txt += "\n" + document.getElementById("iimg").src;
  else txt += "\n";
  txt += "\n\n\n\n\n\n\n\n";
  txt += document.getElementById("idetails").value;
  
  var xhr = new XMLHttpRequest();
  ligne = "fic=" + fic + "&v=" + txt;
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
