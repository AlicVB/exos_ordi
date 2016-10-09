var msgs;
var livreid;
var exoid;
var user;
var essai_max;
var essai_cur = 0;
var actif = true;
var root;
var total;

var line_cur = null;
var line_orig = null;
var line_orig_id = "";

function line_start(e)
{
  //on récupère le point de départ
  var rect = e.getBoundingClientRect();

  //on crée la ligne
  li = document.createElement('div');
  li.className = "line";
  li.style.top = rect.bottom + "px";
  li.style.left = (rect.left + (rect.right - rect.left)/2) + "px";
  document.body.appendChild(li);
  document.body.addEventListener('mouseup',line_leave,true);
  document.body.addEventListener('mousemove',line_move,true);
  
  //on enregistre
  line_cur = li;
  line_orig = e;
  line_orig_id = e.getAttribute('itemid');
}
function line_move(event)
{
  if (!line_cur) return;
  var rect = line_orig.getBoundingClientRect();
  x1 = rect.left + (rect.right - rect.left)/2;
  y1 = rect.bottom;
  
  x2 = event.pageX;
  y2 = event.pageY;
  
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    
  var angle = 180 / 3.1415 * Math.acos((y2 - y1) / length);
  if(x2 > x1) angle *= -1;
  
  line_cur.style.height = length + "px";
  line_cur.style.transform = 'rotate(' + angle + 'deg)';
}

function line_leave(event)
{
  if (!line_cur) return;
  e = event.target;
  id = "";
  if (e.hasAttribute('ok') && e.hasAttribute('itemid')) id = e.getAttribute('itemid')
  if (id == line_orig_id)
  {
    //on trace la ligne bien comme il faut
    var rect = line_orig.getBoundingClientRect();
    x1 = rect.left + (rect.right - rect.left)/2;
    y1 = rect.bottom;
    
    rect = e.getBoundingClientRect();
    x2 = rect.left + (rect.right - rect.left)/2;
    y2 = rect.top;
    
    var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      
    var angle = 180 / 3.1415 * Math.acos((y2 - y1) / length);
    if(x2 > x1) angle *= -1;
    
    line_cur.style.height = length + "px";
    line_cur.style.transform = 'rotate(' + angle + 'deg)';
    // on enregistre la valeur
    if (line_orig.id == e.getAttribute("ok")) e.setAttribute("score", "1");
    else e.setAttribute("score", "0");
  }
  else
  {
    document.body.removeChild(line_cur);
  }
  document.body.removeEventListener('mouseup',line_leave,true);
  document.body.removeEventListener('mousemove',line_move,true);
  line_cur = null;
  line_orig = null;
  line_orig_id = "";
}

//Actions spécifiques de certains éléments
function multi_change(elem)
{
  // on récupère les options
  r = getrootitem(elem);
  if (!r.hasAttribute('options')) return;
  var opts = r.getAttribute('options').split("|");
  
  //on fait les changements de couleur
  var ncoul = opts[0];
  for (i=0; i<opts.length; i++)
  {
    if (elem.style.backgroundColor == opts[i])
    {
      if (i == opts.length - 1) ncoul = "transparent";
      else ncoul = opts[i+1];
      break;
    }
  }
    
  elem.style.backgroundColor = ncoul;
}

function multi_score(e, tt)
{
  // on récupère les options
  if (!e.hasAttribute('options')) return 0;
  var opts = e.getAttribute('options').split("|");
  
  // on initialise un tableau de score
  scores = new Array(opts.length);
  for (var i=0; i<scores.length; i++)
  {
    scores[i] = 0;
  }
  
  // we look at all the subitems
  var elems = getexos(e);
  for (var i=0; i<elems.length; i++)
  {
    elems[i].disabled = true;
    // on récupère la valeur juste
    var juste = "transparent";
    var coul = elems[i].style.backgroundColor;
    if (elems[i].hasAttribute('juste'))
    {
      nb = parseInt(elems[i].getAttribute('juste')) - 1;
      if (nb>=0 && nb<opts.length) juste = opts[nb];
    }
    //on vérifie la couleur
    for (j=0; j<opts.length; j++)
    {
      if (coul == opts[j])
      {
        if (juste == coul) scores[j] += 1;
        else scores[j] -= 1;
      }
    }
  }
  
  //we computes all scores
  s = 0;
  for (var i=0; i<scores.length; i++)
  {
    // on veut un score entre 0 et 1
    s += Math.min(Math.max(0,scores[i]),1);
  }
  
  // we show the correction if needed
  if (s<scores.length)
  {
    elems = e.getElementsByClassName('multi_corr');
    if (elems.length>0) elems[0].style.visibility = 'visible';
    elems = e.getElementsByClassName('multi_cim');
    if (elems.length>0) elems[0].src = root + "icons/window-close.svg";
  }
  else
  {
    elems = e.getElementsByClassName('multi_cim');
    if (elems.length>0) elems[0].src = root + "icons/dialog-apply.svg";
  }
  
  return tt*s/scores.length;
}

function radio_score(e, tt)
{
  s = tt;
  // we look at all the subitems to search for error
  var elems = getexos(e);
  for (var i=0; i<elems.length; i++)
  {
    elems[i].disabled = true;
    if ((elems[i].checked && elems[i].value == "0") || (!elems[i].checked && elems[i].value == "1"))
    {
      s = 0;
      break;
    }
  }
  // we show correction
  if (s == 0)
  {
    for (var i=0; i<elems.length; i++)
    {
      if (elems[i].value == 1)
      {
        ee = elems[i].nextElementSibling;
        ee.style.border = "2px solid red";
        ee.style.borderRadius = "1vh";
      }
    }
  }
  return s;
}

function combo_score(e, tt)
{
  var elems = getexos(e);
  if (elems.length>0)
  {
    elems[0].disabled = true;
    if (elems[0].value == 0)
    {
      ee = elems[0].nextElementSibling;
      ee.style.display = "block";
    }
    return tt*parseInt(elems[0].value);
  }
  return 0;
}

function texte_score(e, tt)
{
  // on récupère les options (type de comparaison)
  cc = 0;
  if (e.hasAttribute('options'))
  {
    var opts = e.getAttribute('options').split("|");
    if (opts.length>0) cc = opts[0];
  }
  
  // on récupère les valeurs
  var elems = getexos(e);
  if (elems.length<1) return 0;
  elems[0].disabled = true;
  v1 = elems[0].value.trim();
  ee = elems[0].nextElementSibling;
  v2 = ee.innerHTML.trim();

  //on compare
  s=0;
  if (v2=="#") s = tt;
  else
  {
    switch (cc)
    {
      case 1: // comparaison sans maj début
        v1 = v1.substr(0,1).toLowerCase() + v1.substr(1);
        v2 = v2.substr(0,1).toLowerCase() + v2.substr(1);
        if (v1==v2) s = tt;
        break; 
      case 2: // case insensitive
        if (v1.toLowerCase() == v2.toLowerCase()) s = tt;
        break; 
      default: // comparaison stricte
        if (v1==v2) s = tt;
        break; 
    }
  }
  if (s==0)
  {
    elems[0].style.border = "2px solid red";
    elems[0].style.borderRadius = "2vh";
  }
  return s;
}

function zone_score(e, tt)
{
  s = tt;
  // we look at all the subitems to search for error
  var elems = getexos(e);
  for (var i=0; i<elems.length; i++)
  {
    elems[i].disabled = true;
    ok = elems[i].getAttribute('ok');
    el = elems[i].firstElementChild;
    if (!el || el.id != ok)
    {
      s = 0;
      elems[i].style.border = "2px solid red";
      elems[i].style.borderRadius = "1vh";
    }
  }
  return s;
}

function line_score(e, tt)
{
  s = 0;
  //we desactivate the source items
  r = getrootitem(e);
  sel = "[itemid=\"" + r.getAttribute('item') + "\"]";
  elems = r.querySelectorAll(sel);
  for (var i=0; i<elems.length; i++)
  {
    elems[i].disabled = true;
  }
  // we look at all the subitems to search for error
  elems = getexos(e);
  for (var i=0; i<elems.length; i++)
  {
    alert(i + " " + elems[i].getAttribute('score'));
    s += parseInt(elems[i].getAttribute('score'));
    if (elems[i].getAttribute('score') == "0")
    {
      elems[i].style.border = "2px solid red";
      elems[i].style.borderRadius = "1vh";
    }
  }
  alert(s + " " + (s*tt/elems.length));
  return s*tt/elems.length;
}

// get the root item of an element (the one with all the details)
function getrootitem(e)
{
  // if it's already a root item
  if (e.hasAttribute('item')) return e;
  //if it's not an subitem
  if (!e.hasAttribute('itemid')) return null;
  
  sel = "[item=\"" + e.getAttribute('itemid') + "\"]";
  return document.querySelector(sel);
}
// get the type of item of an element
function gettype(e)
{
  r = getrootitem(e);
  if (r)
  {
    if (r.hasAttribute('tpe')) return r.getAttribute('tpe');
  }
  return "";
}
// get the exo elemes of a root item
function getexos(e)
{
  r = getrootitem(e);
  sel = ".exo[itemid=\"" + r.getAttribute('item') + "\"]";
  return r.querySelectorAll(sel);
}

function sauve()
{
  // on construit le fichier de sauvegarde
  tx = "";
  var elems = document.getElementsByClassName('exo');
  for (var i=0; i<elems.length; i++)
  {
    if (i>0) tx += "|";
    tx += encodeURIComponent(getvalue(elems[i]));
  }
  
  // et on le sauvegarde
  var xhr = new XMLHttpRequest();
  ligne = "user=" + user +"&exoid=" + exoid + "&v=" + tx;
  xhr.open("POST", exoid + "/sauve.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(ligne);
}

function read_details(txt_exo)
{
  msgs = new Array(6);
  // on sépare par lignes
  var vals = txt_exo.split("§");
  
  // on récupère celles qui nous interresse
  for (var i=0; i<6; i++)
  {
    msgs[i] = {}; // min;max;flag;couleur;texte;retry
    var v = vals[i+3].split("|");
    msgs[i].min = v[0];
    msgs[i].txt = v[2];
    msgs[i].re = v[3];
    if (v[1] == "n")
    {
      msgs[i].icon = root + "icons/flag-black.svg";
      msgs[i].coul = "black";
    }
    else if (v[1] == "r")
    {
      msgs[i].icon = root + "icons/flag-red.svg";
      msgs[i].coul = "red";
    }
    else if (v[1] == "j")
    {
      msgs[i].icon = root + "icons/flag-yellow.svg";
      msgs[i].coul = "#ffff00";
    }
    else if (v[1] == "b")
    {
      msgs[i].icon = root + "icons/flag-blue.svg";
      msgs[i].coul = "#0000ff";
    }
    else if (v[1] == "v")
    {
      msgs[i].icon = root + "icons/flag-green.svg";
      msgs[i].coul = "#00ff00";
    }
    else if (v[1] == "c")
    {
      msgs[i].icon = root + "icons/games-highscores.svg";
      msgs[i].coul = "white";
    }
  }
  total = vals[2];
  essai_max = vals[9];
  document.body.style.backgroundColor = vals[10];
}

function charge(_user, _livreid, _exoid, txt_exo, _root)
{
  //on initialise les variables
  root = _root;
  exoid = _exoid;
  livreid = _livreid;
  user = _user;
  
  // on initialise les messages
  read_details(txt_exo);
  
  //on initialise les drag-drop
  var drake = dragula();
  drake.containers.push(document.getElementsByClassName('mv_src')[0]);
  elems = document.getElementsByClassName('mv_dest');
  for (i=0;i<elems.length;i++)
  {
    drake.containers.push(elems[i]);
  }
  
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
        setvalue(elems[i], decodeURIComponent(vals[i]));
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
  //suivant les éléments, on peut avoir des choses à faire...
  switch (gettype(elem))
  {
    case "multi":
      multi_change(elem);
      break;
  }
  
  // on sauvegarde
  sauve();
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
  
  // on calcule le score et on affiche les corrections
  s = 0;
  t = 0;
  var elems = document.getElementsByClassName('item');
  for (var i=0; i<elems.length; i++)
  {
    e = elems[i];
    if (e.hasAttribute('tpe'))
    {
      //on augmente le total des points
      tt = 1;
      if (e.hasAttribute('points')) tt = e.getAttribute('points');
      t += tt;
      //on augmente le score
      switch (e.getAttribute('tpe'))
      {
        case "texte":
          s += texte_score(e, tt);
          break;
        case "radio":
        case "radiobtn":
        case "check":
          s += radio_score(e, tt);
          break;
        case "multi":
          s += multi_score(e, tt);
          break;
        case "combo":
          s += combo_score(e, tt);
          break;
        case "zone":
          s += zone_score(e, tt);
          break;
        case "line":
          s += line_score(e, tt);
          break;
      }
    }
  }
  
  //on ajuste le score par rapport au total
  vals = total.split("|");
  ns = s;
  nt = t;
  if (vals[0] != "-1")
  {
    nt = parseInt(vals[0]);
    ns = s*nt/t;
    switch (vals[1])
    {
      case 1:
        ns = Math.round(ns);
        break;
      case 0.5:
        ns = Math.round(ns*2)/2;
        break;
      case 0.1:
        ns = Math.round(ns*10)/10;
        break;
      case 0.01:
        ns = Math.round(ns*100)/100;
        break;
    }
  }
  escore.innerHTML = "score : " + ns + "/" + nt;
  
  // on définit le drapeau, etc...
  for (var i=5; i>=0; i--)
  {
    if (ns>=msgs[i].min)
    {
      if (msgs[i].re == "1") btn = "<br/><a href=\"javascript:window.location.reload(true)\" id=\"rea\">Réessayer</a>";
      else btn = "";
      etxt.innerHTML = msgs[i].txt + btn;
      etxt.style.borderColor = msgs[i].coul;
      eflagimg.src = msgs[i].icon;
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
    ligne = root + "log_exo.php?user=" + user +"&exoid=" + exoid + "&livreid=" + livreid + "&score=" + ns + "&tot=" + nt;
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

// set a saved value to an element
function setvalue(e, v)
{
  switch (gettype(e))
  {
    case "combo":
      e.selectedIndex = parseInt(v);
      break;
    case "radio":
    case "radiobtn":
    case "check":
      e.checked = (v == "true");
      break;
    case "texte":
      e.value = v;
      break;
    case "multi":
      e.style.backgroundColor = v;
      break;
  }
}
// get the text value of an element (to be saved)
function getvalue(e)
{
  switch (gettype(e))
  {
    case "combo":
      return (e.selectedIndex);
    case "radio":
    case "radiobtn":
    case "check":
      return (e.checked);
    case "texte":
      return (e.value);
    case "multi":
      return (e.style.backgroundColor);
  }
  return "";
}
