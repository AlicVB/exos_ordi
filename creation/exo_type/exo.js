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

function audio_play(e)
{
  var id = e.id;
  var audio = document.getElementById("audio_" + id);
  audio.play();
}

function line_new(corr)
{
  let txt = "<svg class=\"line\" preserveAspectRatio=\"none\" viewbox=\"0 0 100 100\">";
  txt += "<line vector-effect=\"non-scaling-stroke\" x1=\"50\" y1=\"0\" x2=\"50\" y2=\"100\"></line>";
  if (corr) txt += "<polygon points=\"-300 97, 50 100, 400 97\"/>";
  txt += "</svg>";
  document.body.insertAdjacentHTML('beforeend', txt);
  var elems = document.getElementsByClassName("line");
  return elems[elems.length - 1];
}

function line_start(e)
{
  //on récupère le point de départ
  var rect = e.currentTarget.getBoundingClientRect();

  //on crée la ligne
  li = line_new(false);
  li.style.top = (rect.top + rect.height/2) + "px";
  li.style.left = (rect.left + rect.width/2) + "px";
  document.body.addEventListener('mouseup',line_leave,true);
  document.body.addEventListener('mousemove',line_move,true);
  
  //on enregistre
  line_cur = li;
  line_orig = e.currentTarget;
  line_orig_id = e.currentTarget.id;
}
function line_move(event)
{
  if (!line_cur) return;
  var rect = line_orig.getBoundingClientRect();
  x1 = rect.left + (rect.width/2);
  y1 = rect.top + (rect.height/2);
  
  x2 = event.pageX;
  y2 = event.pageY;
  
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    
  var angle = 180 / 3.1415 * Math.acos((y2 - y1) / length);
  if(x2 > x1) angle *= -1;
  
  line_cur.style.height = length + "px";
  line_cur.style.transform = 'rotate(' + angle + 'deg)';
}
function line_remove(event)
{
  let line = event.target.parentNode;
  e1 = document.getElementById(line.getAttribute("l1"));
  e2 = document.getElementById(line.getAttribute("l2"));
  document.body.removeChild(line);
  
  //on enlève le truc de sauvegarde
  if (e1.hasAttribute("linkedto"))
  {
    var ids = e1.getAttribute("linkedto").split("$");
    nids = "";
    for (let i=0; i<ids.length; i++)
    {
      if (ids[i] != e2.id)
      {
        if (nids != "") nids += "$";
        nids += ids[i];
      }
    }
    e1.setAttribute("linkedto", nids);
  }
  else if (e2.hasAttribute("linkedto"))
  {
    var ids = e2.getAttribute("linkedto").split("$");
    nids = "";
    for (let i=0; i<ids.length; i++)
    {
      if (ids[i] != e1.id)
      {
        if (nids != "") nids += "$";
        nids += ids[i];
      }
    }
    e2.setAttribute("linkedto", nids);
  }
  
  //on enlève l'attribut pour le calcul
  if (e1.hasAttribute("lineto"))
  {
    var ids = e1.getAttribute("lineto").split("|");
    nids = "";
    for (let i=0; i<ids.length; i++)
    {
      if (ids[i] != e2.id)
      {
        if (nids != "") nids += "|";
        nids += ids[i];
      }
    }
    e1.setAttribute("lineto", nids);
  }
  else if (e2.hasAttribute("lineto"))
  {
    var ids = e2.getAttribute("lineto").split("|");
    nids = "";
    for (let i=0; i<ids.length; i++)
    {
      if (ids[i] != e1.id)
      {
        if (nids != "") nids += "|";
        nids += ids[i];
      }
    }
    e2.setAttribute("lineto", nids);
  }
  change(e1);
  change(e2);
}
function line_charge(e, v)
{
  var ids = v.split("$");
  for (let i=0; i<ids.length; i++)
  {
    line_relie(e, document.getElementById(ids[i]), null, false);
  }
}
function line_relie(e1, e2, line, corr)
{
  if (!e1 || !e2) return;
  if (!line) line = line_new(corr);

  //on détecte quels côtés on utilise
  var rect1 = e1.getBoundingClientRect();
  var rect2 = e2.getBoundingClientRect();
  x1 = rect1.left + (rect1.width/2);
  y1 = rect1.top + (rect1.height/2);
  x2 = rect2.left + (rect2.width/2);
  y2 = rect2.top + (rect2.height/2);
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  var angle = 180 / 3.1415 * Math.acos((y2 - y1) / length);
  if(x2 > x1) angle *= -1;
  
  //on ajuste les points pour ere du bon côté
  if (angle>=-45 && angle <=45)
  {
    y1 = rect1.bottom;
    y2 = rect2.top;
  }
  else if (angle >45 && angle <=135)
  {
    x1 = rect1.left;
    x2 = rect2.right;
  }
  else if (angle >= 135 || angle <= -135)
  {
    y1 = rect1.top;
    y2 = rect2.bottom;
  }
  else if (angle >= -135 && angle <= -45)
  {
    x1 = rect1.right;
    x2 = rect2.left;
  }
  //et on recalcule
  length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  angle = 180 / 3.1415 * Math.acos((y2 - y1) / length);
  if(x2 > x1) angle *= -1;
  line.style.left = x1 + "px";
  line.style.top = y1 + "px";
  line.style.height = length + "px";
  line.style.transform = 'rotate(' + angle + 'deg)';
  line.setAttribute("l1", e1.id);
  line.setAttribute("l2", e2.id);
  if (corr)
  {
    line.style.stroke = "red";
  }
  else
  {
    // on enregistre la valeur
    if (e2.hasAttribute("lineok"))
    {
      ids = "";
      if (e2.hasAttribute("lineto")) ids = e2.getAttribute("lineto");
      if (ids != "") ids += "|";
      ids += e1.id;
      e2.setAttribute("lineto", ids);
    }
    else if (e1.hasAttribute("lineok"))
    {
      ids = "";
      if (e1.hasAttribute("lineto")) ids = e1.getAttribute("lineto");
      if (ids != "") ids += "|";
      ids += e2.id;
      e1.setAttribute("lineto", ids);
    }
    ids = "";
    if (e1.hasAttribute("linkedto")) ids = e1.getAttribute("linkedto");
    if (ids != "") ids += "$";
    ids += e2.id;
    e1.setAttribute("linkedto", ids);
  }
  line.addEventListener('click',line_remove,true);
  return line;
}

function line_leave(event)
{
  if (!line_cur) return;
  ex = event.clientX;
  ey = event.clientY;
  var elems = document.querySelectorAll("[line]");
  var e = null;
  for (let i=0; i<elems.length; i++)
  {
    el = elems[i];
    rect = el.getBoundingClientRect();
    if (ex >= rect.left && ex <= (rect.left + rect.width) && ey >= rect.top && ey <= (rect.top + rect.height))
    {
      e = el;
      break;
    }
  }
  id = "";
  if (e && e.hasAttribute('line') && e.hasAttribute('itemid')) id = e.getAttribute('itemid')
  ok = false;
  if (e && e.hasAttribute('line') && e.id != line_orig.id && (e.hasAttribute("lineok") != line_orig.hasAttribute("lineok")))
  {
    // on regarde si il y a pas déjà une ligne comme ça
    var el = null;
    var src = null;
    if (e.hasAttribute("lineok"))
    {
      el = e;
      src = line_orig;
    }
    else if (line_orig.hasAttribute("lineok"))
    {
      el = line_orig;
      src = e;
    }
    if (el && src)
    {
      ok = true;
      if (el.hasAttribute("lineto"))
      {
        var ids = el.getAttribute("lineto").split("|");
        for (let i=0; i<ids.length; i++)
        {
          if (ids[i] == src.id)
          {
            ok = false;
            break;
          }
        }
      }
    }
  }
  if (ok)
  {
    line_relie(line_orig, e, line_cur, false);
    change(line_orig);
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

function drag_remove(event)
{
  el = event.target;
  if (!el) return;
  parent = document.getElementById("cible_" + el.id);
  if (!parent) return;
  el.parentNode.removeAttribute("contains");
  change(el.parentNode);
  el.parentNode.removeChild(el);
  el.style.position = "absolute"; 
  parent.appendChild(el);
  el.removeEventListener('click', drag_remove, true);
}

function drag_deplace(e, id)
{
  el = document.getElementById(id);
  if (!el) return;
  var rect = el.getBoundingClientRect();
  el.parentNode.removeChild(el);
  e.setAttribute("contains", el.id);
  el.style.position = "static";
  el.style.width = rect.width + "px";
  el.style.height = rect.height + "px";
  el.addEventListener('click', drag_remove, true);
  e.appendChild(el); 
}

function drag_start(ev)
{
  ev.dataTransfer.setData("text", ev.target.id);
}
function drag_over(ev)
{
  if (ev.target.hasAttribute("tpe") && ev.target.getAttribute("tpe") == "cible" && !ev.target.hasAttribute("contains"))
  {
    ev.preventDefault();
  }
}
function drag_drop(ev)
{
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var el = document.getElementById(data);
  var rect = el.getBoundingClientRect();
  el.style.width = rect.width + "px";
  el.style.height = rect.height + "px";
  el.style.position = "static";
  ev.target.setAttribute("contains", el.id);
  el.addEventListener('click', drag_remove, true);
  ev.target.appendChild(document.getElementById(data));
  change(ev.target);
}

//Actions spécifiques de certains éléments
function multi_change(elem, clic)
{
  // on récupère les options
  r = getrootitem(elem);
  if (!r.hasAttribute('options')) return;
  var opts = r.getAttribute('options').split("|");
  var maj = [];
  var suff = [];
  var barre = [];
  if (r.hasAttribute("maj")) maj = r.getAttribute('maj').split("|");
  if (r.hasAttribute("suff")) suff = r.getAttribute('suff').split("|");
  if (r.hasAttribute("barre")) barre = r.getAttribute('barre').split("|");
  //on fait les changements de couleur
  var ncoul = opts[0];
  var nid = 0;
  for (let i=0; i<opts.length; i++)
  {
    if (elem.style.backgroundColor == opts[i])
    {
      if (clic)
      {
        if (i == opts.length - 1)
        {
          ncoul = "transparent";
          nid = -1;
        }
        else
        {
          ncoul = opts[i+1];
          nid = i+1;
        }
      }
      else nid = i;
      break;
    }
  }
  if (clic)
  {
    elem.style.backgroundColor = ncoul;
    elem.style.boxShadow = "inset 0 0 0 2000px " + ncoul;
  }
  //texte barré
  if (nid < 0 || nid >= barre.length || barre[nid] != "1") elem.style.textDecoration = "none";
  else elem.style.textDecoration = "line-through";
  //majuscules et suffixes
  var inis = elem.getElementsByClassName("multi_ini");
  if (inis && inis.length>0)
  {
    var tx = inis[0].childNodes[0].nodeValue;
    var ntx = tx;
    if (nid>=0 && nid<maj.length && maj[nid] == "1") ntx = tx.substr(0,1).toUpperCase() + tx.substr(1);
    if (nid>=0 && nid<suff.length && suff[nid] != "") ntx = tx + suff[nid];
    elem.childNodes[0].nodeValue = ntx
  }
}

function multi_score(e, tt)
{
  // on récupère les options
  if (!e.hasAttribute('options')) return 0;
  var opts = e.getAttribute('options').split("|");
  
  // on initialise un tableau de score
  var scores = new Array(opts.length);
  var nbjuste = new Array(opts.length);
  var nbjuste_total = 0;
  for (let i=0; i<scores.length; i++)
  {
    scores[i] = 1;
    nbjuste[i] = 0;
  }
  
  // we look at all the subitems
  var elems = getexos(e);
  for (let i=0; i<elems.length; i++)
  {
    elems[i].disabled = true;
    // on récupère la valeur juste
    var juste = "transparent";
    var juste_id = -1;
    var coul = elems[i].style.backgroundColor;
    if (!coul || coul == "") coul = "transparent";
    if (elems[i].hasAttribute('juste'))
    {
      juste_id = parseInt(elems[i].getAttribute('juste')) - 1;
      if (juste_id>=0 && juste_id<opts.length)
      {
        juste = opts[juste_id];
        nbjuste[juste_id] += 1;
        nbjuste_total += 1;
      }
      else juste_id = -1;
    }
    //on vérifie la couleur
    if (coul == juste) continue;
    //on enlève les points
    for (let j=0; j<opts.length; j++)
    {
      if (coul == opts[j]) scores[j] = 0;
      else if (juste == opts[j]) scores[j] = 0;
    }
  }
  
  //we computes all scores
  var s = 0;
  var tot = 0;
  for (let i=0; i<scores.length; i++)
  {
    if (nbjuste[i] > 0 || nbjuste_total == 0)
    {
      // on veut un score entre 0 et 1
      s += Math.min(Math.max(0,scores[i]),1);
      tot += 1;
    }
  }

  // we show the correction if needed
  if (s<tot)
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
  
  // cas particulier ou rien ne doit être coloré => c'est juste ou faux !
  if (nbjuste_total == 0)
  {
    if (s == scores.length) return tt;
    else return 0;
  }
  else return tt*s/tot;
}

function radio_score(e, tt)
{
  s = tt;
  // we look at all the subitems to search for error
  var elems = getexos(e);
  for (let i=0; i<elems.length; i++)
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
    for (let i=0; i<elems.length; i++)
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
  let cc = 0;
  let corr = "0";
  if (e.hasAttribute('options'))
  {
    var opts = e.getAttribute('options').split("|");
    if (opts.length>0) cc = opts[0];
    if (opts.length>2) corr = opts[2];
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
    if (corr == "1")
    {
      let els = e.getElementsByClassName("texte_corr2");
      for (let i=0; i<els.length; i++)
      {
        els[i].style.visibility = "visible";
      }
    }
  }
  return s;
}

function cible_score(e, tt)
{
  if (e.hasAttribute("juste"))
  {
    el = e.firstElementChild;
    if ( el && el.id == e.getAttribute("juste")) return tt;
    else if (tt>0)
    {
      //on affiche la correction
      e.style.border = "2px solid red";
      e.style.borderRadius = "2vh";
      el2 = document.getElementById(e.getAttribute("juste"));
      if (el2)
      {
        let svg = line_relie(el2, e, null, true);
        let elems = svg.getElementsByTagName("polygon");
        if (elems.length>0)
        {
          let li = elems[0];
          li.style.display = "block";
        }
      }
    }
  }
  return 0;
}

function line_score(e, tt)
{
  let s = 0;
  if (e.hasAttribute("lineok"))
  {
    //on cherche l'erreur
    s = 1;
    let id1 = [];
    if (e.hasAttribute("lineto")) id1 = e.getAttribute("lineto").split("|");
    let id2 = e.getAttribute("lineok").split("|");
    //on regarde d'abord si il manque des lignes
    for (let i=0; i<id2.length; i++)
    {
      if (id2[i] != "" && id1.indexOf(id2[i]) == -1)
      {
        s = 0;
        // il faut tracer la ligne qui manque
        line_relie(e, document.getElementById(id2[i]), null, true);
      }
    }
    // on regarde si il y a des lignes en trop
    for (let i=0; i<id1.length; i++)
    {
      if (id2.indexOf(id1[i]) == -1)
      {
        s = 0;
        // il faut barrer la ligne en trop
        let li = line_relie(e, document.getElementById(id1[i]), null, true);
        li.style.strokeDasharray = "2, 10";
        li.style.strokeLinecap = "butt";
        li.style.strokeWidth = "12px";
      }
    }
  }
  return s*tt;
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
  // on construit le fichier de sauvegarde (on commence par créer un objet adhoc
  var sav = {};
  var elems = document.getElementsByClassName('exo');
  for (let i=0; i<elems.length; i++)
  {
    sav[elems[i].id] = encodeURIComponent(getvalue(elems[i]));
  }

  // et on le sauvegarde
  var xhr = new XMLHttpRequest();
  ligne = "user=" + user +"&exoid=" + exoid + "&v=" + JSON.stringify(sav);
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
  for (let i=0; i<6; i++)
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
  
  //on initialise les lignes à relier
  elems = document.querySelectorAll("[line]");
  for (let i=0;i<elems.length;i++)
  {
    elems[i].addEventListener('mousedown',line_start,true);
  }
  //on initialise les icones de sons
  elems = document.querySelectorAll("img.audio");
  for (let i=0;i<elems.length;i++)
  {
    elems[i].src = root + "icons/" + elems[i].getAttribute("src");
  }
  
  // on initialise les items
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var elems = document.getElementsByClassName('exo');
      var sav = null;
      sav = JSON.parse(xhr.responseText);
      if (sav)
      {
        for (let i=0; i<elems.length; i++)
        {
          if (sav.hasOwnProperty(elems[i].id))
            setvalue(elems[i], decodeURIComponent(sav[elems[i].id]));
        }
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
      multi_change(elem, true);
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
  for (let i=0; i<elems.length; i++)
  {
    e = elems[i];
    if (e.hasAttribute('tpe'))
    {
      //on augmente le total des points
      tt = 1;
      if (e.hasAttribute('points')) tt = parseFloat(e.getAttribute('points'));
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
        case "cible":
          s += cible_score(e, tt);
          break;
        case "texte_simple":
        case "image":
        case "rect":
        case "cercle":
        case "ligne":
        case "audio":
          s += line_score(e, tt);
          break;
      }
    }
  }
  
  //on désactive toutes les lignes
  elems = document.getElementsByClassName('line');
  for (let i=0; i<elems.length; i++)
  {
    elems[i].removeEventListener('click',line_remove,true);
  }
  elems = document.querySelectorAll("[line]");
  for (let i=0;i<elems.length;i++)
  {
    elems[i].removeEventListener('mousedown',line_start,true);
  }

  //on ajuste le score par rapport au total
  vals = total.split("|");
  ns = s;
  nt = t;
  if (vals[0] != "-1") nt = parseInt(vals[0]);
  ns = s*nt/t;
  switch (vals[1])
  {
    case "1":
      ns = Math.round(ns);
      break;
    case "0.5":
      ns = Math.round(ns*2)/2;
      break;
    case "0.1":
      ns = Math.round(ns*10)/10;
      break;
    case "0.01":
      ns = Math.round(ns*100)/100;
      break;
  }
  escore.innerHTML = "score : " + ns + "/" + nt;
  np = ns/nt*100;
  // on définit le drapeau, etc...
  for (let i=5; i>=0; i--)
  {
    if (np>=msgs[i].min)
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
      if (v != "") e.style.boxShadow = "inset 0 0 0 2000px " + v;
      multi_change(e, false);
      break;
    case "texte_simple":
    case "image":
    case "rect":
    case "cercle":
    case "ligne":
    case "audio":
      if (v != "") line_charge(e, v);
      break;
    case "cible":
      if (v != "") drag_deplace(e, v);
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
    case "texte_simple":
    case "image":
    case "rect":
    case "cercle":
    case "ligne":
    case "audio":
      if (e.hasAttribute("linkedto")) return e.getAttribute("linkedto");
    case "cible":
      if (e.hasAttribute("contains")) return e.getAttribute("contains");
  }
  return "";
}
