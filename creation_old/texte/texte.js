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
  document.getElementById("exo_consigne").value = "Sélectionne la bonne réponse.";
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
  nb_items = 0;
  for (var i=0; i<lg.length; i++)
  {
    v = lg[i].split("|");
    nb = (v.length - 1) / 2;
    nb_items += nb; 
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
  opt += document.getElementById("exo_score").value + "\n";
  opt += document.getElementById("exo_nb").value + "\n";
  opt += hex2rgb(document.getElementById("exo_coul").value) + "\n";
  
  // et le fichier html
  htm = "";
  item = 0;
  for (var i=0; i<lg.length; i++)
  {
    htm += "<p>\n";
    if (lg[i].trim() == "") htm += "&nbsp;"
    //on coupe suivant '|'
    var vals = lg[i].split("|");
    j = 0;
    while (j<vals.length)
    {
      if (j%2 == 0)
      {
        // le texte
        htm += vals[j];
      }
      else
      {
        // la zone de texte
        if (vals[j].length >= 4)
        {
          l = parseInt(vals[j].substr(0,1));
          h = parseInt(vals[j].substr(1,1));
          enter = parseInt(vals[j].substr(2,1));
          pts = parseInt(vals[j].substr(3,1));
          tx = vals[j].substr(4);
          if (l==0) htm += "<br/>";
          if (h>1) htm += "<textarea rows=\"" + h + "\" ";
          else htm += "<input type=\"text\" ";
          htm += "class=\"exo\" itemid=\"" + item + "\" points=\"" + pts + "\" onKeyUp=\"change(this)\" ";
          if (l==0) htm += "style=\"box-sizing: border-box; width:100%;\">";
          else htm += "style=\"width:" + l*2 + "vh;\">";
          if (h>1) htm += "</textarea>";
          htm += "<span class=\"corr\">" + tx + "</span>";
          item++;
        }
      }
      j++;
    }
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
  txt = `span.corr {
  display: none;
}`;

  return txt;
}

function getsauve()
{
  txt = `<?php
  header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 
  $user = (isset($_POST["user"])) ? $_POST["user"] : NULL;
  $exoid = (isset($_POST["exoid"])) ? $_POST["exoid"] : NULL;
  $v = (isset($_POST["v"])) ? $_POST["v"] : NULL;
  
  if ($user && $exoid) 
  {
    // nom du fichier de sauvegarde
    $exoid = basename($exoid);
    $fic = "../../sauvegardes/$user/$exoid.txt";
    //et on réécrit le tout dans le fichier
    file_put_contents($fic, $v);
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
  txt = `var score_name;
var msgs;
var nb_items;
var livreid;
var exoid;
var user;
var essai_max;
var essai_cur = 0;
var actif = true;
var root;

function sauve(v)
{
  var xhr = new XMLHttpRequest();
  ligne = "user=" + user +"&exoid=" + exoid + "&v=" + v;
  xhr.open("POST", exoid + "/sauve.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(ligne);
}

function corrige(elem, sauv)
{
  var elems = document.getElementsByClassName('exo');
  var txt = ""; // liste des valeurs des éléments (cochés ou non)
  for (var i=0; i<elems.length; i++)
  {
    e = elems[i];
    txt += encodeURIComponent(e.value) + "|";
  }

  //on sauvegarde si besoin
  if (sauv) sauve(txt.slice(0,-1));
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
  score_name = vals[9];
  essai_max = vals[10];
  document.body.style.backgroundColor = vals[11];
}

function charge(_user, _livreid, _exoid, txt_exo, _root)
{
  //on initialise les variables
  root = _root;
  exoid = _exoid;
  livreid = _livreid;
  user = _user;
  ini_msgs(txt_exo);  
  
  // on initialise les items
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var elems = document.getElementsByClassName('exo');
      var vals = xhr.responseText.split("|");
      for (var i=0; i<elems.length && i<vals.length; i++)
      {
        e = elems[i];
        e.value = decodeURIComponent(vals[i]);
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
  s = 0;
  t = 0;
  var elems = document.getElementsByClassName('exo');
  for (var i=0; i<elems.length; i++)
  {
    pts = parseInt(elems[i].getAttribute('points'));
    if (pts > 0)
    {
      tx1 = elems[i].value;
      tx2 = elems[i].nextElementSibling.innerHTML;
      if (tx1 == tx2 || tx2 == "#") s += pts;
      else
      {
        //on affiche le tour rouge de correction
        elems[i].style.border = "2px solid red";
        elems[i].style.borderRadius = "2vh";
      }
      t += pts;
    }
    elems[i].disabled = true;
  }
  
  txt = score_name + " : " + s + "/" + t;
  escore.innerHTML = txt;
  
  // on définit le drapeau, etc...
  for (var i=0; i<6; i++)
  {
    if (s>=msgs[i][0] && s<=msgs[i][1])
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
  
  if (sauve)
  {
    // on enregistre le sore dans la base générale
    var xhr = new XMLHttpRequest();
    ligne = root + "log_exo.php?user=" + user +"&exoid=" + exoid + "&livreid=" + livreid + "&score=" + s + "&tot=" + t;
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
      document.getElementById("rea").style.visibility="hidden";
    }
  }
}`;
  
  return txt;
}
