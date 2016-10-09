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
  if (elem.id == "nb_pos")
  {
    if (parseInt(elem.value) >= 2) document.getElementById("div_coul2").style.visibility = "visible";
    else document.getElementById("div_coul2").style.visibility = "hidden";
    if (parseInt(elem.value) >= 3) document.getElementById("div_coul3").style.visibility = "visible";
    else document.getElementById("div_coul3").style.visibility = "hidden";
    if (parseInt(elem.value) >= 4) document.getElementById("div_coul4").style.visibility = "visible";
    else document.getElementById("div_coul4").style.visibility = "hidden";
    if (parseInt(elem.value) >= 5) document.getElementById("div_coul5").style.visibility = "visible";
    else document.getElementById("div_coul5").style.visibility = "hidden";
    
    if (parseInt(elem.value) >= 2) document.getElementById("div_score2").style.visibility = "visible";
    else document.getElementById("div_score2").style.visibility = "hidden";
    if (parseInt(elem.value) >= 3) document.getElementById("div_score3").style.visibility = "visible";
    else document.getElementById("div_score3").style.visibility = "hidden";
    if (parseInt(elem.value) >= 4) document.getElementById("div_score4").style.visibility = "visible";
    else document.getElementById("div_score4").style.visibility = "hidden";
    if (parseInt(elem.value) >= 5) document.getElementById("div_score5").style.visibility = "visible";
    else document.getElementById("div_score5").style.visibility = "hidden";
  }
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
  nb_items = 0;
  for (var i=0; i<lg.length; i++)
  {
    if (lg[i].indexOf("|") > 0) nb_items++; 
  }
  
  // on crée le fichier des options
  opt = document.getElementById("exo_titre").value + "\n";
  opt += document.getElementById("exo_consigne").value + "\n";
  opt += nb_items + "\n";
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
  opt += "\n\n\n\n\n\n\n\n\n\n";
  opt += document.getElementById("nb_pos").value + "\n";
  opt += hex2rgb(document.getElementById("exo_coul1").value) + "|";
  opt += hex2rgb(document.getElementById("exo_coul2").value) + "|";
  opt += hex2rgb(document.getElementById("exo_coul3").value) + "|";
  opt += hex2rgb(document.getElementById("exo_coul4").value) + "|";
  opt += hex2rgb(document.getElementById("exo_coul5").value) + "\n";
  
  // et le fichier html
  htm = "";
  nb_pos = document.getElementById("nb_pos").value;
  coul1 = document.getElementById("exo_coul1").value;
  coul2 = document.getElementById("exo_coul2").value;
  coul3 = document.getElementById("exo_coul3").value;
  coul4 = document.getElementById("exo_coul4").value;
  coul5 = document.getElementById("exo_coul5").value;
  
  for (var i=0; i<lg.length; i++)
  {
    htm += "<p>\n";
    //on coupe suivant '|'
    var vals = lg[i].split("|");
    htm2 = "";
    for (var j=0; j<vals.length; j++)
    {
      val = vals[j];
      c = 0;
      // on regarde si c'est un bloc à cliquer
      if (val.startsWith("1")) c = 1;
      else if (val.startsWith("2")) c = 2;
      else if (val.startsWith("3")) c = 3;
      else if (val.startsWith("4")) c = 4;
      else if (val.startsWith("5")) c = 5;

      if (c > 0) val = val.substr(1);
      // on rajoute les espaces si besoin
      if (j>0 && val.startsWith(" ")==false) val = " " + val;
      if (j<vals.length-1 && val.endsWith(" ")==false && val.endsWith(",")==false) val = val + " ";
      
      htm += "<span itemid=\"" + i + "\" ";
      if (c > 0) htm += "juste=\"" + c + "\" ";
      htm += "class=\"exo\" onclick=\"change(this)\">" + val + "</span>\n";
      
      if (c==0) htm2 += "<span>";
      else if (c==1) htm2 += "<span style=\"background-color: " + coul1 + ";\">";
      else if (c==2) htm2 += "<span style=\"background-color: " + coul2 + ";\">";
      else if (c==3) htm2 += "<span style=\"background-color: " + coul3 + ";\">";
      else if (c==4) htm2 += "<span style=\"background-color: " + coul4 + ";\">";
      else if (c==5) htm2 += "<span style=\"background-color: " + coul5 + ";\">";
      htm2 += val + "</span>\n";
    }
    htm += "<img itemid=\"" + i + "\" class=\"exocim\" />\n";
    htm += "<br />\n";
    htm += "<span itemid=\"" + i + "\" class=\"exocorr\">\n";
    htm += htm2;
    htm += "</span>\n";
    htm += "</p>\n";
  }
  
  var zip = new JSZip();
  zip.file("exo.php", htm);
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
  txt = `span.exo {
  cursor: pointer;
}
span.exo:hover {
  border: 1px solid grey;
}
span.exocorr {
  background-color: #BFBFBF;
  font-style: italic;
  visibility: hidden;
}
img.exocim {
  height: 2.5vh;
  vertical-align: bottom;
}`;

  return txt;
}
function getsauve()
{
  txt = `<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_GET["user"])) ? $_GET["user"] : NULL;
  $exoid = (isset($_GET["exoid"])) ? $_GET["exoid"] : NULL;
  $pos = (isset($_GET["pos"])) ? $_GET["pos"] : NULL;
  $nb = (isset($_GET["nb"])) ? $_GET["nb"] : NULL;
  $v = (isset($_GET["v"])) ? $_GET["v"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "../../sauvegardes/$user/$exoid.txt";
  
    // on crée/charge la liste des valeurs
    $vals = array();
    if (file_exists($fic))
    {
      $vals = explode("\\n", file_get_contents($fic));
    }
    else
    {
      for ($i=0; $i<$nb; $i++)
      {
        $vals[] = '';
      }
    }
    
    // on change juste la ligne qu'il faut
    $vals[$pos] = $v;
    //et on réécrit le tout dans le fichier
    file_put_contents($fic, implode("\\n", $vals));
  }
  ?>`;
  
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
  txt = `//on définit les couleurs
var coul0 = 'transparent';
var coul1 = '';
var coul2 = '';
var coul3 = '';
var coul4 = '';
var coul5 = '';
var nb_pos = 2;

var scores;
var scores_names;
var msgs;
var nb_items;
var livreid;
var exoid;
var user;
var essai_max;
var essai_cur = 0;
var actif = true;
var root;

function sauve(pos, nb, v)
{
  var xhr = new XMLHttpRequest();
  ligne = exoid + "/sauve.php?user=" + user +"&exoid=" + exoid + "&pos=" + pos + "&nb=" + nb + "&v=" + v;
  xhr.open("GET", ligne , true);
  xhr.send(null);
}

function corrige(elem, sauv)
{
  var item = elem.getAttribute('itemid');
  var elems = document.getElementsByClassName('exo');
  var sc = [0, 0, 0, 0, 0]; // scores
  var pos = 0; // position de l'élément en cours dans la liste
  for (var i=0; i<elems.length; i++)
  {
    e = elems[i];
    if (e == elem) pos = i;
    
    // on ne s'occupe des éléments du même item
    if (e.getAttribute('itemid') == item)
    {
      // on récupère la valeur "juste"
      var juste = coul0;
      if (e.hasAttribute('juste'))
      {
        if (e.getAttribute('juste') == 2) juste = coul2;
        else if (e.getAttribute('juste') == 3) juste = coul3;
        else if (e.getAttribute('juste') == 4) juste = coul4;
        else if (e.getAttribute('juste') == 5) juste = coul5;
        else juste = coul1;
      }
      // et on fait en fct de la couleur de l'élément
      if (e.style.backgroundColor == coul1)
      {
        if (juste == coul1) sc[0] += 1;
        else sc[0] -= 1;
      }
      else if (e.style.backgroundColor == coul2)
      {
        if (juste == coul2) sc[1] += 1;
        else sc[1] -= 1;
      }
      else if (e.style.backgroundColor == coul3)
      {
        if (juste == coul3) sc[2] += 1;
        else sc[2] -= 1;
      }
      else if (e.style.backgroundColor == coul4)
      {
        if (juste == coul4) sc[3] += 1;
        else sc[3] -= 1;
      }
      else if (e.style.backgroundColor == coul5)
      {
        if (juste == coul5) sc[4] += 1;
        else sc[4] -= 1;
      }
    }
  }
  
  for (var i=0; i<5; i++)
  {
    scores[i][item] = Math.max(0,sc[i]);
  }
  
  //on sauvegarde si besoin
  if (sauv) sauve(pos, elems.length, elem.style.backgroundColor);
}

function ini_msgs(txt_exo)
{
  msgs = new Array(6);
  // on sépare par lignes
  var vals = txt_exo.split("§");
  
  nb_items = vals[2];
  
  // on récupère celles qui nous interresse
  for (var i=0; i<6; i++)
  {
    msgs[i] = new Array(6); // min;max;flag;couleur;texte;retry
    var v = vals[i+3].split("|");
    msgs[i][0] = v[0];
    msgs[i][1] = v[1];
    msgs[i][4] = v[3];
    msgs[i][5] = v[4];
    if (v[2] == "n")
    {
      msgs[i][2] = root + "icons/flag-black.svg";
      msgs[i][3] = "black";
    }
    else if (v[2] == "r")
    {
      msgs[i][2] = root + "icons/flag-red.svg";
      msgs[i][3] = "red";
    }
    else if (v[2] == "j")
    {
      msgs[i][2] = root + "icons/flag-yellow.svg";
      msgs[i][3] = "#ffff00";
    }
    else if (v[2] == "b")
    {
      msgs[i][2] = root + "icons/flag-blue.svg";
      msgs[i][3] = "#0000ff";
    }
    else if (v[2] == "v")
    {
      msgs[i][2] = root + "icons/flag-green.svg";
      msgs[i][3] = "#00ff00";
    }
    else if (v[2] == "c")
    {
      msgs[i][2] = root + "icons/games-highscores.svg";
      msgs[i][3] = "white";
    }
  }
  scores_names = vals[9].split("|");
  essai_max = vals[10];
  document.body.style.backgroundColor = vals[11];
  nb_pos = parseInt(vals[22]);
  c = vals[23].split("|");
  coul1 = c[0];
  coul2 = c[1];
  coul3 = c[2];
  coul4 = c[3];
  coul5 = c[4];
}

function charge(_user, _livreid, _exoid, txt_exo, _root)
{
  //on initialise les variables
  root = _root;
  exoid = _exoid;
  livreid = _livreid;
  user = _user;
  ini_msgs(txt_exo);
  scores = new Array(5);
  for (var i=0; i<5; i++)
  {
    scores[i] = new Array(parseInt(nb_items));
    for (var j=0; j<nb_items; j++)
    {
      scores[i][j] = 0;
    } 
  }
  
  // on initialise les items
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var elems = document.getElementsByClassName('exo');
      var vals = xhr.responseText.split("\\n");
      for (var i=0; i<elems.length; i++)
      {
        e = elems[i];
        if (vals[i] != "")
        {
          e.style.backgroundColor = vals[i];
        }
        corrige(e,false);
      }
    }
  };
  xhr.open("GET", exoid + "/charge.php?user=" + user + "&exoid=" + exoid, true);
  xhr.send(null);
  
  // on regarde les histoires de compteurs
  xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function() {
    if (xhr2.readyState == 4 && (xhr2.status == 200 || xhr2.status == 0))
    {
      essai_cur = xhr2.responseText;
      if (essai_max > 0 && essai_cur >= essai_max)
      {
        affiche_score(false);
        document.getElementById("eraseimg").style.visibility="hidden";
        document.getElementById("erasea").style.visibility="hidden";
      }
    }
  };
  xhr2.open("GET", "compteur.php?user=" + user + "&exoid=" + exoid, true);
  xhr2.send(null);

}

function change(elem)
{
  if (actif==false) return;
  //on fait les changements de couleur
  var ncoul = coul1;
  if (elem.style.backgroundColor == coul1)
  {
    if (nb_pos > 1) ncoul = coul2;
    else ncoul = coul0;
  }
  else if (elem.style.backgroundColor == coul2)
  {
    if (nb_pos > 2) ncoul = coul3;
    else ncoul = coul0;
  }
  else if (elem.style.backgroundColor == coul3)
  {
    if (nb_pos > 3) ncoul = coul4;
    else ncoul = coul0;
  }
  else if (elem.style.backgroundColor == coul4)
  {
    if (nb_pos > 4) ncoul = coul5;
    else ncoul = coul0;
  }
  else if (elem.style.backgroundColor == coul5) ncoul = coul0;
  
  elem.style.backgroundColor = ncoul;
  // on s'occupe des scores
  corrige(elem, true);
}

function affiche_score(sauve)
{
  if (actif==false) return;
  actif=false;
  // on récupère les éléments de score :
  eflag = document.getElementById("cflag");
  eflagimg= document.getElementById("cflagimg");
  etxt = document.getElementById("ctxt");
  escore = document.getElementById("cscore");
  
  // on construit le texte du score
  var vs = [0, 0, 0, 0, 0];
  var vt = [0, 0, 0, 0, 0];
  var ss = 0;
  var tt = 0;
  for (var j=0; j<nb_pos; j++)
  {
    for (var i=0; i<scores[j].length; i++)
    {
      vt[j]++;
      vs[j] += scores[j][i];
      tt++;
      ss += scores[j][i];
    }
  }
  txt = "";
  for (var i=0; i<nb_pos; i++)
  {
    if (i>0) txt += " -- ";
    txt += scores_names[i] + " : " + vs[i] + "/" + vt[i];
  }
  
  escore.innerHTML = txt;
  
  // on définit le drapeau, etc...
  for (var i=0; i<6; i++)
  {
    if (ss>=msgs[i][0] && ss<=msgs[i][1])
    {
      if (msgs[i][5] == "1") btn = "<br/><a href=\\"javascript:window.location.reload(true)\\" id=\\"rea\\">Réessayer</a>";
      else btn = "";
      etxt.innerHTML = msgs[i][4] + btn;
      etxt.style.borderColor = msgs[i][3];
      eflagimg.src = msgs[i][2];
      break;
    }
  }
  
  // on affiche tous ces éléments
  eflag.style.visibility = "visible";
  etxt.style.visibility = "visible";
  escore.style.visibility = "visible";
  
  //on s'occupe des corrections à afficher
  var elems = document.getElementsByClassName('exocorr');
  for (var i=0; i<elems.length; i++)
  {
    img = elems[i].parentNode.getElementsByClassName('exocim');
    item = elems[i].getAttribute('itemid');
    s=0;
    for (var j=0; j<nb_pos; j++) s += scores[j][item];
    if (s == nb_pos)
    {
      img[0].src = root + "icons/dialog-apply.svg";
    }
    else
    {
      img[0].src = root + "icons/window-close.svg";
      elems[i].style.visibility = "visible";
    }
    
  }
  
  
  if (sauve)
  {
    // on enregistre le sore dans la base générale
    var xhr = new XMLHttpRequest();
    ligne = root + "log_exo.php?user=" + user +"&exoid=" + exoid + "&livreid=" + livreid + "&score=" + ss + "&tot=" + tt;
    xhr.open("GET", ligne , true);
    xhr.send(null);
    
    // et on augmente le compteur d'essais
    var xhr2 = new XMLHttpRequest();
    ligne = "compteur.php?user=" + user +"&exoid=" + exoid + "&livreid=" + livreid + "&action=plus";
    xhr2.open("GET", ligne , true);
    xhr2.send(null);
    
    // et on règle l'affichage de la gomme
    essai_cur++;
    if (essai_max > 0 && essai_cur >= essai_max)
    {
      document.getElementById("eraseimg").style.visibility="hidden";
      document.getElementById("erasea").style.visibility="hidden";
    }
  }
}`;
  
  return txt;
}
