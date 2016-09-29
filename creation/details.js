function txt_code(txt)
{
  return txt.replace(/\n/g, "§").replace(/;/g, "ø");
}
function txt_decode(txt)
{
  return txt.replace(/§/g, "\n").replace(/ø/g, ";");
}
function charge_cookies(txt, sav)
{
  var cc = txt.split(";");
  for (var i=0; i<cc.length; i++)
  {
    // on lit le cookie
    j = cc[i].indexOf("=");
    if (j>0)
    {
      id = cc[i].substr(0,j).trim();
      v = txt_decode(cc[i].substr(j+1).trim());
      document.getElementById(id).value = v;
      if (sav) change(document.getElementById(id));
    }
  }
}
function charge()
{
  // on initialise les valeurs complexes
  document.getElementById("exo_consigne").value = "Clique 1 fois sur les <span style=\"background-color: #00ff00;\">sujets.</span><br/>Clique 2 fois sur les <span style=\"background-color: #ff0000;\">verbes.</span>";
  document.getElementById('recharger').addEventListener('change', recharger, false);
  
  // on charge les cookies
  charge_cookies(document.cookie, false);
}
function erase()
{
  var txt = document.cookie;
  var cc = txt.split(";");
  for (var i=0; i<cc.length; i++)
  {
    // on lit le cookie
    j = cc[i].indexOf("=");
    if (j>0)
    {
      id = cc[i].substr(0,j).trim();
      document.cookie = id + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
  location.reload(true);
}
function change(elem)
{
  var d = new Date();
  d.setTime(d.getTime() + 8640000000);
  var expires = "expires="+ d.toUTCString();
  document.cookie = elem.id + "=" + txt_code(elem.value) + "; " + expires;
}
function hex2rgb(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
function recharger(evt)
{
  var f = document.getElementById('recharger').files[0]
  if (f)
  {
    var reader = new FileReader();
    reader.onload = function(e) {
      charge_cookies(reader.result, true);
    }
    reader.readAsText(f);
  }
}
function sauvegarder()
{
  // on commence le décodage
  var txt = document.getElementById("texte").value;
  var lg = txt.split("\n");
  
  // on crée le fichier des options
  opt = document.getElementById("exo_titre").value + "\n";
  opt += document.getElementById("exo_consigne").value + "\n";
  opt += document.getElementById("exo_total").value + "|";
  opt += document.getElementById("exo_arrondi").value + "\n";
  opt += document.getElementById("a1_min").value + "|";
  opt += document.getElementById("a1_max").value + "|";
  opt += document.getElementById("a1_coul").value + "|";
  opt += document.getElementById("a1_txt").value + "|";
  if (document.getElementById("a1_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("a2_min").value + "|";
  opt += document.getElementById("a2_max").value + "|";
  opt += document.getElementById("a2_coul").value + "|";
  opt += document.getElementById("a2_txt").value + "|";
  if (document.getElementById("a2_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("a3_min").value + "|";
  opt += document.getElementById("a3_max").value + "|";
  opt += document.getElementById("a3_coul").value + "|";
  opt += document.getElementById("a3_txt").value + "|";
  if (document.getElementById("a3_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("a4_min").value + "|";
  opt += document.getElementById("a4_max").value + "|";
  opt += document.getElementById("a4_coul").value + "|";
  opt += document.getElementById("a4_txt").value + "|";
  if (document.getElementById("a4_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("a5_min").value + "|";
  opt += document.getElementById("a5_max").value + "|";
  opt += document.getElementById("a5_coul").value + "|";
  opt += document.getElementById("a5_txt").value + "|";
  if (document.getElementById("a5_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("a6_min").value + "|";
  opt += document.getElementById("a6_max").value + "|";
  opt += document.getElementById("a6_coul").value + "|";
  opt += document.getElementById("a6_txt").value + "|";
  if (document.getElementById("a6_re").checked) opt += "1\n";
  else opt += "0\n";
  opt += document.getElementById("exo_score1").value + "|";
  opt += document.getElementById("exo_score2").value + "|";
  opt += document.getElementById("exo_score3").value + "|";
  opt += document.getElementById("exo_score4").value + "|";
  opt += document.getElementById("exo_score5").value + "\n";
  opt += document.getElementById("exo_nb").value + "\n";
  opt += hex2rgb(document.getElementById("exo_coul").value) + "\n";
  
  var zip = new JSZip();
  zip.file("exo.txt", opt);
  zip.file("exo.sav.txt", document.cookie);
  zip.file("exo.js", getjs());
  zip.file("exo.css", getcss());
  zip.file("sauve.php", getsauve());
  zip.file("charge.php", getcharge());

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, "exo.zip");
  });
}

function getcss()
{
  txt = ``;

  return txt;
}
function getsauve()
{
  txt = ``;
  
  return txt;
}
function getcharge()
{
  txt = `<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "../../sauvegardes/$user/$exoid.txt";
    
    // si pas de fichier, on sort
    if (file_exists($fic) == false) exit;
  
    // sinon, on lit le fichier ligne par ligne
    echo file_get_contents($fic);
  }
  ?>`;
  
  return txt;
}





function getjs()
{
  txt = ``;
  
  return txt;
}
