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
}
