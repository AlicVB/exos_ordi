var score;
var score_name;
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
  ligne = exoid + "/sauve.php?user=" + user +"&exoid=" + exoid + "&v=" + v;
  xhr.open("GET", ligne , true);
  xhr.send(null);
}

function corrige(elem, sauv)
{
  var item = elem.getAttribute('itemid');
  var elems = document.getElementsByClassName('exo');
  var sc = 1; // score
  var txt = ""; // liste des valeurs des éléments (cochés ou non)
  for (var i=0; i<elems.length; i++)
  {
    e = elems[i];
    if (e.checked) txt += "1|";
    else txt += "0|";
    
    // on ne s'occupe des éléments du même item
    if (e.getAttribute('itemid') == item)
    {
      // si erreur, alors on met le score à 0
      if ((e.value == "0" && e.checked) || (e.value == "1" && e.checked == false))
      {
        sc = 0;
      }
    }
  }

  score[parseInt(item)] = sc;

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
  score = new Array(parseInt(nb_items));
  for (var i=0; i<nb_items; i++)
  {
    score[i] = 0;
  }  
  
  // on initialise les items
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var elems = document.getElementsByClassName('exo');
      var vals = xhr.responseText.split("|");
      for (var i=0; i<elems.length; i++)
      {
        e = elems[i];
        e.checked = (vals[i] == "1");
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
  for (var i=0; i<score.length; i++)
  {
    t++;
    s += score[i];
  }
  
  txt = score_name + " : " + s + "/" + t;
  escore.innerHTML = txt;
  
  // on définit le drapeau, etc...
  for (var i=0; i<6; i++)
  {
    if (s>=msgs[i][0] && s<=msgs[i][1])
    {
      if (msgs[i][5] == "1") btn = "<br/><a href=\"javascript:window.location.reload(true)\" id=\"rea\">Réessayer</a>";
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
  var elems = document.getElementsByClassName('exo');
  for (var i=0; i<elems.length; i++)
  {
    // on "disable" l'élément
    elems[i].disabled = true;
    if (elems[i].value == "1")
    {
      item = elems[i].getAttribute('itemid');
      if (score[item] == 0)
      {
        e = elems[i].nextElementSibling;
        e.style.border = "2px solid red";
        e.style.borderRadius = "1vh";
      }
    }
  }  
  
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
    }
  }
}