var infos = {};

var blocs = new Array();  // c'est un tableau qui rescence les données de chaque bloc
var selection = new Array();  // c'est un tableau avec les indices de blocs sélectionnés

var last_id = 0;    // dernier id utilisé

var exo_dos = ""  //chemin vers le dossier de l'exercice

var record = {};  //objet contenant tout ce qu'il faut pour enregistrer


function change(e)
{
}

function start(dos)
{
  //si pas de nom d'exo dans l'url, il faut le rajouter ! (pour refresh...)
  if (window.location.href.substr(-1,1) == "=")
  {
    history.replaceState('ajout exo', document.title, window.location.href + dos.split("/").pop());
  }
  exo_dos = dos;
  _mv_ini();
  g_restaurer(true);
  g_restaurer_info(false);
  cr_tab_click(document.getElementById("cr_tab_info"));
  document.addEventListener("keydown", cr_keydown);
  
  //enregistrement
  record.chunks = [];
  record.stream = null;
  record.recorder = null;
  record.promise = null;
  record.blob = null;
}

function hex2rgb(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
function hex2rgba(hex, alpha)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return "rgba(" + r + ", " + g + ", " + b + ", " + (alpha/100) + ")";
}

function record_ini(e)
{
  var pre = e.id.substr(0,2);
  //on gère l'affichage
  document.getElementById(pre + "_record_start").style.display = "inline";
  document.getElementById(pre + "_record_save").style.display = "none";
  document.getElementById(pre + "_record_delete").style.display = "none";
  document.getElementById(pre + "_record_start").setAttribute("etat", "0");
  document.getElementById(pre + "_record_start").style.backgroundColor = "#D8D8D8";
  document.getElementById(pre + "_record_start").src = "icons/media-record.svg";
  document.getElementById(pre + "_record_div").style.display = "inline-block";

  if (record.promise) return; //on a déjà initialiser !
  
  record.promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
  record.promise.then(function(_str) {record.stream = _str; });
  record.promise.catch(function(err) { console.log(err.name + ": " + err.message); });
}
function record_start(el)
{
  var pre = el.id.substr(0,2);
  document.getElementById(pre + "_record_start").setAttribute("etat", "1");
  document.getElementById(pre + "_record_start").style.backgroundColor = "red";
  document.getElementById(pre + "_record_start").src = "icons/media-playback-stop.svg";
  record.recorder = new MediaRecorder(record.stream);
  record.recorder.ondataavailable = function(e) {record.chunks.push(e.data);};
  record.recorder.onstop = function(e) {record_fin(e, el);};
  
  record.recorder.start();
  console.log("recorder started : " + record.recorder.state);
}
function record_stop(e)
{
  var pre = e.id.substr(0,2);
  record.recorder.stop();
  console.log("recorder stopped " + record.recorder.state);
  document.getElementById(pre + "_record_start").setAttribute("etat", "2");
  document.getElementById(pre + "_record_start").style.backgroundColor = "#D8D8D8";
  document.getElementById(pre + "_record_start").src = "icons/media-playback-start.svg";
  document.getElementById(pre + "_record_save").style.display = "inline";
  document.getElementById(pre + "_record_delete").style.display = "inline";
}
function record_fin(e, el)
{
  var pre = el.id.substr(0,2);
  record.blob = new Blob(record.chunks, { 'type' : 'audio/ogg; codecs=opus' });
  var audioURL = window.URL.createObjectURL(record.blob);
  document.getElementById(pre + "_record_audio").src = audioURL;
}

function file_create_css()
{
  txt = "";
  for (let i=0; i<blocs.length; i++)
  {
    b = blocs[i];
    txt += "[id=\"" + b.id + "\"] {";
    //police
    txt += "font-family: \"" + b.font_fam + "\"; ";
    txt += "font-size: " + (b.font_size/10) + "vh; ";
    txt += "color: " + b.font_coul + "; ";
    if (b.font_g == "true") txt += "font-weight: bold; ";
    if (b.font_i == "true") txt += "font-style: italic; ";
    if (b.font_s == "true") txt += "text-decoration: underline; ";
    if (b.font_b == "true") txt += "text-decoration: line-throught; ";
    //position-taille
    txt += "position: absolute; ";
    txt += "left: " + b.left*100/443 + "%; ";
    txt += "top: " + b.top*100/641 + "%; ";
    if (b.size == "manuel" || b.size == "ratio" || b.tpe == "ligne")
    {
      if (b.tpe == "cible")
      {
        txt += "min-width: " + b.width*100/443 + "%; ";
        txt += "min-height: " + b.height*100/641 + "%; ";
      }
      else
      {
        txt += "width: " + b.width*100/443 + "%; ";
        txt += "height: " + b.height*100/641 + "%; ";
      }
    }
    if (b.rotation != "0") txt += "transform: rotate(" + b.rotation + "deg); ";
    //bords
    if (b.bord != "hidden")
    {
      if (b.tpe == "cercle" || b.tpe == "ligne")
      {
        switch (b.bord)
        {
          case "dashed":
            txt += "stroke-dasharray: " + (2 + parseFloat(b.bord_size)*2) + " " + (parseFloat(b.bord_size)*2) + "; ";
            break;
          case "dotted":
            txt += "stroke-dasharray: 0 " + (parseFloat(b.bord_size)*1.5) + "; ";
            break;
        }
        txt += "stroke-width: " + b.bord_size + "px; ";
        txt += "stroke: " + b.bord_coul + "; ";
      }
      else
      {
        txt += "border-style: " + b.bord + "; ";
        txt += "border-color: " + b.bord_coul + "; ";
        txt += "border-width: " + b.bord_size + "px; ";
        txt += "border-radius: " + b.bord_rond + "px; ";
      }
    }
    //fond
    if (b.tpe == "cercle")
    {
      txt += "fill: " + hex2rgba(b.fond_coul, b.fond_alpha) + "; ";
    }
    else if (b.fond_alpha != 0)
    {
      txt += "background-color: " + hex2rgba(b.fond_coul, b.fond_alpha) + "; ";
    }
    //marges
    if (b.marges > 0)
    {
      txt += "padding: " + b.marges + "px; ";
    }
    txt += "}\n";
  }
  return txt;
}

function file_create_infos()
{
  txt = infos.titre + "\n";
  txt += infos.consigne.replace(/(?:\r\n|\r|\n)/g, '<br />') + "\n";
  txt += infos.total + "|" + infos.arrondi + "\n";
  for(i=0; i<6; i++)
  {
    txt += infos.a[i].min + "|" + infos.a[i].coul + "|";
    txt += infos.a[i].txt.replace(/(?:\r\n|\r|\n)/g, '<br />') + "|";
    txt += infos.a[i].re;
    txt += "\n";
  }
  txt += infos.essais + "\n";
  txt += infos.coul + "\n";
  txt += infos.audio_name + "\n";
  
  return txt;
}
function file_sauve(fic, txt)
{
  let xhr = new XMLHttpRequest();
  ligne = "io=sauve&fic=" + fic + "&v=" + txt;
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(ligne);
}
function g_exporter()
{
  // on commence le décodage
  txt = "<style>\n" + file_create_css() + "</style>\n\n";
  for (let i=0; i<blocs.length; i++)
  {
    txt += blocs[i].html + "\n";
  }
  file_sauve(exo_dos + "/exo.php", txt);
  alert("Exercice créé !");
}

function g_sauver()
{
  file_sauve(exo_dos + "/exo_sav.txt", JSON.stringify(blocs));
}
function g_sauver_info()
{
  file_sauve(exo_dos + "/exo.txt", file_create_infos());
}
function g_restaurer(init)
{
  //on nettoie
  if (init) g_reinit();

  //on récupère les infos dans le fichier ad'hoc
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var rep = xhr.responseText;
      var b = null;
      if (rep != "") b = JSON.parse(rep);
      if (b) blocs = b;
      last_id = 0;
      for (let i=0; i<blocs.length; i++)
      {
        // et au rendu
        rendu_add_bloc(blocs[i]);
        if (blocs[i].id > last_id) last_id = blocs[i].id;
      }
    }
  };
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("io=charge&fic=" + exo_dos + "/exo_sav.txt");
}
function g_restaurer_info(init)
{
  //on nettoie
  if (init) g_reinit();
  
  //on récupère les infos dans le fichier ad'hoc
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      var vals = [];
      var rep = xhr.responseText;
      if (rep != "") vals = rep.split("\n");
      else g_sauver_info();
      if (vals.length>10)
      {
        infos.titre = vals[0];
        infos.consigne = vals[1];
        vv = vals[2].split("|");
        if (vv.length>1)
        {
          infos.total = vv[0];
          infos.arrondi = vv[1];
        }
        for (let i=0; i<6; i++)
        {
          vv = vals[i+3].split("|");
          if (vv.length>3)
          {
            infos.a[i].min = vv[0];
            infos.a[i].coul = vv[1];
            infos.a[i].txt = vv[2].replace(/<br \/>/g, "\n");
            infos.a[i].re = vv[3];
          }
        }
        infos.essais = vals[9];
        infos.coul = vals[10];
        if (vals.length>11) infos.audio_name = vals[11];
      }
      infos_change();
    }
  };
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("io=charge&fic=" + exo_dos + "/exo.txt");
}

function infos_change()
{
  document.getElementById("cri_titre").value = infos.titre;
  document.getElementById("cri_coul").value = infos.coul;
  document.getElementById("cr_rendu").style.backgroundColor = infos.coul;
  document.getElementById("cri_consigne").value = infos.consigne;
  document.getElementById("cri_total").value = infos.total;
  document.getElementById("cri_arrondi").value = infos.arrondi;
  document.getElementById("cri_essais").value = infos.essais;
  for (let j=0; j<6; j++)
  {
    document.getElementById((j+1) + "_cri_a_min").value = infos.a[j].min;
    document.getElementById((j+1) + "_cri_a_coul").value = infos.a[j].coul;
    document.getElementById((j+1) + "_cri_a_re").checked = (infos.a[j].re == "1");
    document.getElementById((j+1) + "_cri_a_txt").value = infos.a[j].txt;
  }
}

function g_reinit()
{
  //on nettoie
  rendu_ini();
  blocs = [];
  selection = [];
  last_id = 0;
  infos_ini();
  selection_change();
  infos_change();
}

function bloc_new(tpe, txt)
{
  bloc = {};
  last_id++;
  bloc.id = last_id;
  bloc.tpe = tpe;
  bloc.txt = txt;
  bloc_ini(bloc);
  
  window[tpe + "_ini"](bloc);

  bloc_create_html(bloc);
  blocs.push(bloc);
  // on ajoute le bloc pour le rendu
  rendu_add_bloc(bloc);
  return bloc;
}
// on initialise les valeurs d'options comme il faut
function bloc_ini(bloc)
{
  //polices
  bloc.font_fam = "sans-serif";
  bloc.font_size = "25";
  bloc.font_coul = "#000000";
  bloc.font_g = "false";
  bloc.font_i = "false";
  bloc.font_s = "false";
  bloc.font_b = "false";
  //taille-position
  bloc.left = 5;
  bloc.top = 300;
  bloc.width = 0;
  bloc.height = 0;
  bloc.size = "auto";
  bloc.rotation = 0;
  //bordures
  bloc.bord = "hidden";
  bloc.bord_size = "1";
  bloc.bord_coul = "#000000";
  bloc.bord_rond = "0";
  //fond
  bloc.fond_coul = "#ffffff";
  bloc.fond_alpha = "0";
  //marges
  bloc.marges = "2";
  //points
  bloc.points = "1";
  //interactions
  bloc.inter = "0";
  bloc.relie_id = "";
  bloc.relie_cible_de = "";
  //autre
  bloc.html = "";
  bloc.css = "";
}

function bloc_mousedown(elem, event)
{
  //d'abord on enlève le focus ailleurs
  if (document.activeElement) document.activeElement.blur();
  
  if (event.target && event.target.id == "cr_rendu")
  {
    // on déselectionne tout
    selection = [];
    selection_change();
    return;
  }
  if (elem.id == "cr_rendu") return;
  
  // on récupère le bloc correspondant
  bloc = bloc_get_from_id(elem.id.substr(9));
  
  //on regarde si il est déjà sélectionné
  deja = -1;
  for (let i=0; i<selection.length; i++)
  {
    if (selection[i].id == bloc.id)
    {
      deja = i;
      break;
    }
  }
  if (event.ctrlKey || event.shiftKey)
  {
    // si elem est déjà sélectionné, on le déselectionne
    //sinon, on l'ajoute à la sélection
    if (deja>=0) selection.splice(deja,1);
    else selection.push(bloc);
    selection_change();
  }
  else
  {
    // si pas ctrl et pas sélectionné, alors on sélectionne
    if (deja == -1)
    {
      selection = [bloc];
      selection_change();
    }
  }
}

function bloc_get_from_id(id)
{
  for (let i=0; i<blocs.length; i++)
  {
    if (blocs[i].id == id) return blocs[i];
  }
}

function bloc_create_html(bloc)
{
  window[bloc.tpe + "_create_html"](bloc, bloc.txt);
}

function infos_ini()
{
  infos = {};
  infos.titre = "exercice";
  infos.coul = "#ffffff";
  infos.consigne = "";
  infos.total = "-1";
  infos.arrondi = "1";
  infos.essais = "1";
  infos.a = [{}, {}, {}, {}, {}, {}];
  infos.a[0].min = "0";
  infos.a[1].min = "20";
  infos.a[2].min = "40";
  infos.a[3].min = "60";
  infos.a[4].min = "80";
  infos.a[5].min = "99";
  infos.a[0].coul = "n";
  infos.a[1].coul = "r";
  infos.a[2].coul = "j";
  infos.a[3].coul = "b";
  infos.a[4].coul = "v";
  infos.a[5].coul = "c";
  infos.a[0].re = "0";
  infos.a[1].re = "0";
  infos.a[2].re = "0";
  infos.a[3].re = "0";
  infos.a[4].re = "0";
  infos.a[5].re = "0";
  infos.a[0].txt = "OH !\nTu n'as pas compris la consigne ou la règle !\nDemande de l'aide à quelqu'un\net passe à la suite...";
  infos.a[1].txt = "Tu as encore fait trop d'erreurs !\nDemande de l'aide à quelqu'un\net passe à la suite...";
  infos.a[2].txt = "Tu as encore fait trop d'erreurs !\nRelis la règle\net passe à la suite...";
  infos.a[3].txt = "Tu commences à comprendre,\nmais il reste encore des erreurs !\Passe à la suite...";
  infos.a[4].txt = "BIEN !\nTu n'as presque plus d'erreurs.\Sauras-tu faire encore mieux\nau prochain exercice ?";
  infos.a[5].txt = "BRAVO !\nSeras-tu capable de faire aussi bien\nau prochain exercice ?";
  infos.audio_name = "";
}

//on initialise la zone de rendu (uniquement le prénom)
function rendu_ini()
{
  htm = "<span id=\"user\">Prénom : Exemple-Prénom</span>\n";
  document.getElementById("cr_rendu").innerHTML = htm;
}

// on ajoute un bloc à la zone de rendu
function rendu_add_bloc(bloc)
{
  // on crée le bloc
  htm = "<div class=\"cr_rendu_bloc ";
  if (bloc.size == "ratio") htm += "mv_rs\" ";
  else if (bloc.size == "manuel") htm += "mv_rsl\" ";
  else htm += "mv\" ";
  htm += "id=\"cr_rendu_" + bloc.id + "\" onmousedown=\"bloc_mousedown(this, event)\">\n";
  htm += bloc.html;
  htm += "\n<div class=\"couverture\"></div></div>\n";
  
  //on l'ajoute
  document.getElementById("cr_rendu").innerHTML += htm;
  
  //si c'est une image, on règle les chemins
  if (bloc.tpe == "image")
  {
    document.getElementById(bloc.id).src = bloc.img_vpath;
  }
  //si c'est un son, on règle les chemins
  if (bloc.tpe == "audio")
  {
    document.getElementById(bloc.id).src = "../../icons/audacity.svg";
  }
  
  //on modifie les styles
  b = document.getElementById("cr_rendu_" + bloc.id);
  e = document.getElementById(bloc.id);
  
  //police
  e.style.fontFamily = bloc.font_fam;
  e.style.fontSize = (parseInt(bloc.font_size)*0.65) + "px";
  e.style.color = bloc.font_coul;
  if (bloc.font_g == true) e.style.fontWeight = "bold";
  if (bloc.font_i == true) e.style.fontStyle = "italic";
  if (bloc.font_s == true) e.style.textDecoration = "underline";
  if (bloc.font_b == true) e.style.textDecoration = "line-through";
  //taille-position
  //pour les texte simples, on commence par initialiser les valeurs de tailles au texte
  if (bloc.tpe == "texte_simple" || bloc.tpe == "rect")
  {
    if (bloc.width == 0) bloc.width = Math.max(15, e.offsetWidth + 4);
    if (bloc.height == 0) bloc.height = Math.max(10, e.offsetHeight);
    b.style.width = bloc.width + "px";
    e.parentNode.style.width = "100%";
    b.style.height = bloc.height + "px";
    e.parentNode.style.height = "100%";
    e.style.width = "100%";
    e.style.height = "100%";
  }
  else if (bloc.tpe == "cercle" || bloc.tpe == "ligne")
  {
    e.style.width = bloc.width + "px";
    e.style.height = bloc.height + "px";
  }
  else if (bloc.size == "ratio")
  {
    b.style.width = bloc.width + "px";
    e.style.width = "100%";
    // on triche un peu pour éviter les trucs bizarres (on initialise à un carré)
    if (bloc.height == "0") b.style.height = bloc.width + "px";
    else b.style.height = bloc.height + "px";
  }
  else if (bloc.size == "manuel")
  {
    b.style.width = bloc.width + "px";
    e.style.width = "100%";
    b.style.height = bloc.height + "px";
    e.style.height = "100%";
  }
  else
  {
    // le bloc est en ligne, on connait donc ses vraies dimensions
    bloc.width = e.offsetWidth;
    bloc.height = e.offsetHeight;
  }
  b.style.left = bloc.left + "px";
  b.style.top = bloc.top + "px";
  if (bloc.rotation != "0") b.style.transform = "rotate(" + bloc.rotation + "deg)";
  if (bloc.tpe == "cercle" || bloc.tpe == "ligne")
  {
    var svg = document.getElementById("svg_" + bloc.id);
    svg.style.fill = hex2rgba(bloc.fond_coul, bloc.fond_alpha);
    switch (bloc.bord)
    {
      case "dashed":
        svg.style.strokeDasharray = (2 + parseFloat(bloc.bord_size)*2) + " " + (parseFloat(bloc.bord_size)*2);
        break;
      case "dotted":
        svg.style.strokeDasharray = "0 " + (parseFloat(bloc.bord_size)*1.5);
        break;
    }
    if (bloc.bord != "hidden")
    {
      svg.style.strokeWidth = bloc.bord_size + "px";
      svg.style.stroke = bloc.bord_coul;
    }
  }
  else
  {
    //bordures
    e.style.borderStyle = bloc.bord;
    e.style.borderWidth = bloc.bord_size + "px";
    e.style.borderColor = bloc.bord_coul;
    e.style.borderRadius = bloc.bord_rond + "px";
    //fond
    e.style.backgroundColor = hex2rgba(bloc.fond_coul, bloc.fond_alpha);
  }
  //marges
  e.style.padding = bloc.marges + "px";
}

function rendu_select_blocs()
{
  // on enlève toutes les bordures
  var elems = document.getElementsByClassName('cr_rendu_bloc');
  for (let i=0; i<elems.length; i++)
  {
    elems[i].style.border = "hidden";
  }
  // on rajoute celles sélectionnées
  for (let i=0; i<selection.length; i++)
  {
    rendu_get_superbloc(selection[i]).style.border = "1px dashed red";
  }
  //et les carrés pour la ligne
  if (selection.length == 1 && selection[0].tpe == "ligne")
  {
    var b = selection[0];
    var c1 = "<div class=\"extrema mv\" id=\"extrema_1\" extrema=\"1\" ligne_id=\"" + b.id + "\" style=\"left: " + (b.left+b.x1-4) + "px;top: " + (b.top+b.y1-4) + "px;\"></div>";
    var c2 = "<div class=\"extrema mv\" id=\"extrema_2\" extrema=\"2\" ligne_id=\"" + b.id + "\" style=\"left: " + (b.left+b.x2-4) + "px;top: " + (b.top+b.y2-4) + "px;\"></div>";
    document.getElementById("cr_rendu").innerHTML += c1 + c2;
  }
  else
  {
    //on enlève les carrés existants
    var c1 = document.getElementById("extrema_1");
    var c2 = document.getElementById("extrema_2");
    if (c1) c1.parentNode.removeChild(c1);
    if (c2) c2.parentNode.removeChild(c2);
  }
}

function rendu_get_superbloc(bloc)
{
  return document.getElementById("cr_rendu_" + bloc.id);
}

function selection_is_homogene(tpe)
{
  for (let i=0; i<selection.length; i++)
  {
    if (selection[i].tpe != tpe) return false;
  }
  return true;
}
function selection_change()
{
  txt = "";
  for (let j=0; j<selection.length; j++)
  {
    if (j>0) txt += " + ";
    txt += selection[j].id + "(" + selection[j].tpe + ")";
  }
  rendu_select_blocs();
  document.getElementById("cr_selection").innerHTML = txt;

  selection_update();
}

// on met à jour le panels des options, ...
function selection_update()
{
  // désactivations gloables
  // on masque toutes les options
  var elems = document.getElementsByClassName('cr_coul');
  for (let i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("cr_texte_div").style.display = 'none';

  document.getElementById("cr_txt_ini_div").style.display = "none";
  document.getElementById("cr_img_get_div").style.display = "none";
  document.getElementById("cr_audio_get_div").style.display = "none";
  document.getElementById("cr_aligne").disabled = true;
  document.getElementById("cr_repart").disabled = true;
  document.getElementById("cr_plan").disabled = true;
  document.getElementById("cr_action").disabled = true;
  document.getElementById("cr_expl").innerHTML = "&nbsp;";
  
  if (selection.length == 0)
  {
    bloc = {};
    bloc.id = "-1";
    bloc.tpe = "";
    bloc.txt = "";
    bloc_ini(bloc);
  }
  else bloc = selection[0];
  
  // on règles les options générales
  // police
  document.getElementById("cr_font_fam").value = bloc.font_fam;
  document.getElementById("cr_font_size").value = bloc.font_size;
  document.getElementById("cr_font_coul").jscolor.fromString(bloc.font_coul);
  document.getElementById("cr_font_g").value = (bloc.font_g == "true");
  document.getElementById("cr_font_i").value = (bloc.font_i == "true");
  document.getElementById("cr_font_s").value = (bloc.font_s == "true");
  document.getElementById("cr_font_b").value = (bloc.font_b == "true");
  //taille-position
  document.getElementById("cr_tp_l").value = bloc.left;
  document.getElementById("cr_tp_t").value = bloc.top;
  document.getElementById("cr_tp_w").value = bloc.width;
  document.getElementById("cr_tp_h").value = bloc.height;
  document.getElementById("cr_tp_r").value = bloc.rotation;
  
  //bordures
  document.getElementById("cr_bord").value = bloc.bord;
  document.getElementById("cr_bord_size").value = bloc.bord_size;
  document.getElementById("cr_bord_coul").jscolor.fromString(bloc.bord_coul);
  document.getElementById("cr_bord_rond").value = bloc.bord_rond;
  //fond
  document.getElementById("cr_fond_coul").jscolor.fromString(bloc.fond_coul);
  document.getElementById("cr_fond_alpha").value = bloc.fond_alpha;
  //marges
  document.getElementById("cr_marges").value = bloc.marges;
  
  //code html
  if (selection.length == 1) document.getElementById("cr_html").value = bloc.html;
  else document.getElementById("cr_html").value = "";
  
  document.getElementById("cr_txt_ini").value = bloc.txt;
  
  //les interactions
  document.getElementById("cr_inter_0").disabled = true;
  document.getElementById("cr_inter_1").disabled = true;
  document.getElementById("cr_inter_2").disabled = true;
  document.getElementById("cr_relie_id").disabled = true;
  document.getElementById("cr_points").disabled = false;
  document.getElementById("cr_points").value = bloc.points;

  //on enabled tous les éléments classiques. Charge aux code specifiques de les désactiver
  var elems = document.getElementsByClassName('cr_');
  for (let i=0; i<elems.length; i++)
  {
    elems[i].disabled = false;
  }
  if (!selection_is_homogene(bloc.tpe) || bloc.size == "auto")
  {
    document.getElementById("cr_tp_w").disabled = true;
    document.getElementById("cr_tp_h").disabled = true;
  }
  else if (bloc.size == "ratio")
  {
    document.getElementById("cr_tp_h").disabled = true;
  }
  
  // on fait les réglages spécifiques
  for (let i=0; i<selection.length; i++)
  {
    window[selection[i].tpe + "_sel_update"]();
  }
  
  // on s'occupe aussi des controles sous le rendu
  if (selection.length > 0)
  {
    document.getElementById("cr_plan").disabled = false;
    document.getElementById("cr_action").disabled = false;
  }
  if (selection.length > 1) document.getElementById("cr_aligne").disabled = false;
  if (selection.length > 2) document.getElementById("cr_repart").disabled = false;
}

function selection_update_interactions()
{
  if (selection.length == 0) return;
  bloc = selection[0];
  //interactions
  document.getElementById("cr_inter_0").disabled = false;
  document.getElementById("cr_inter_1").disabled = false;
  document.getElementById("cr_inter_2").disabled = false;
  
  switch (bloc.inter)
  {
    case "0":
      document.getElementById("cr_inter_0").checked = true;
      break;
    case "1":
      document.getElementById("cr_inter_1").checked = true;
      if (selection.length == 1) document.getElementById("cr_relie_id").disabled = false;
      document.getElementById("cr_points").disabled = false;
      break;
    case "2":
      document.getElementById("cr_inter_2").checked = true;
      break;
  }
  if (bloc.relie_cible_de != "")
  {
    // ça veut dire que le réglage a été fait ailleurs
    document.getElementById("cr_relie_id").value = bloc.relie_cible_de;
    document.getElementById("cr_inter_0").disabled = true;
    document.getElementById("cr_inter_1").disabled = true;
    document.getElementById("cr_inter_2").disabled = true;
    document.getElementById("cr_relie_id").disabled = true;
    document.getElementById("cr_points").disabled = true;
  }
  else document.getElementById("cr_relie_id").value = bloc.relie_id;
}

function check_new()
{
  //on demande le texte initial
  txt = prompt("cases à cocher\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |*des mamifères$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("check", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function check_ini(bloc)
{
  // rien de sécial à faire !
}
function check_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>cases à cocher</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $<br/>(Les chats sont |*des mamifères$des oiseaux*des félins|)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
}
function check_create_html(bloc, txt)
{
  radio_create_html(bloc, txt);
}
function radiobtn_new()
{
  //on demande le texte initial
  txt = prompt("boutons choix\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |$des plantes$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("radiobtn", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function radiobtn_ini(bloc)
{
  bloc.radiobtn_coul1 = "#D1CFCF";
  bloc.radiobtn_coul2 = "#888888";
}
function radiobtn_sel_update()
{
  // on affiche le texte de création
  if (selection.length == 1)
  {
    bloc = selection[0];
    
    document.getElementById("cr_expl").innerHTML = "<b>boutons choix</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $<br/>(Les chats sont |$des plantes$des oiseaux*des félins|)";
    document.getElementById("cr_txt_ini_div").style.display = "inline";
  }
  //on regarde si la sélection est homogène
  if (selection.length>0 && selection_is_homogene("radiobtn"))
  {
    var elems = document.getElementsByClassName('cr_coul');
    elems[1].style.display = "block";
    elems[2].style.display = "block";
    document.getElementById("cr_coul1_maj").style.display = "none";
    document.getElementById("cr_coul1_suff").style.display = "none";
    document.getElementById("cr_coul1_suff_txt").style.display = "none";
    document.getElementById("cr_coul2_maj").style.display = "none";
    document.getElementById("cr_coul2_suff").style.display = "none";
    document.getElementById("cr_coul2_suff_txt").style.display = "none";
    document.getElementById("cr_coul1").jscolor.fromString(selection[0].radiobtn_coul1);
    document.getElementById("cr_coul2").jscolor.fromString(selection[0].radiobtn_coul2);
  }
}
function radiobtn_create_html(bloc, txt)
{
  radio_create_html(bloc, txt);
}
function radio_new()
{
  //on demande le texte initial
  txt = prompt("choix uniques\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |$des plantes$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("radio", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function radio_ini(bloc)
{
  // rien de sécial à faire !
}
function radio_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>choix unique</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $<br/>(Les chats sont |$des plantes$des oiseaux*des félins|)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
}
function radio_create_html(bloc, txt)
{
  // ça marche aussi pour les radiobtn et les check
  tp = "radio";
  cl = bloc.tpe;
  if (bloc.tpe == "check")
  {
    tp = "checkbox";
    cl = "radio";
  }

  htm = "";
  if (bloc.tpe == "radiobtn")
  {
    htm += "<style>[id=\"" + bloc.id + "\"] label {background-color: " + bloc.radiobtn_coul1;
    htm += ";} [id=\"" + bloc.id + "\"] input[type=\"radio\"]:checked + label {background-color: " + bloc.radiobtn_coul2 + ";}</style>\n";
  }
  htm += "<div class=\"item lignef " + cl + "\" tpe=\"" + bloc.tpe + "\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.tpe == "radiobtn") htm += "options=\"" + bloc.radiobtn_coul1 + "|" + bloc.radiobtn_coul2 + "\" ";
  htm += ">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  item = 0;
  if (vals.length>1)
  {
    // le choix
    htm += "  <form>\n";
    v = vals[1].replace(/\*/g,"|*").replace(/\$/g,"|$").split("|");
    for (let k=0; k<v.length; k++)
    {
      if (v[k].startsWith("*"))
      {
        if (k>1) htm += "    <br/>\n";
        htm += "    <input type=\"" + tp + "\" itemid=\"" + bloc.id + "\" class=\"exo\" onclick=\"change(this)\" value=\"1\" id=\"rb" + bloc.id + "_" + item + "\" ";
        if (tp == "radio") htm += "name=\"" + bloc.id + "\"";
        htm += ">\n";
        htm += "    <label for=\"rb" + bloc.id + "_" + item + "\">" + v[k].substr(1) + "</label>\n";
      }
      else if (v[k].startsWith("$"))
      {
        if (k>1) htm += "   <br/>\n";
        htm += "    <input type=\"" + tp + "\" itemid=\"" + bloc.id + "\" class=\"exo\" onclick=\"change(this)\" value=\"0\" id=\"rb" + bloc.id + "_" + item + "\" ";
        if (tp == "radio") htm += "name=\"" + bloc.id + "\"";
        htm += ">\n";
        htm += "    <label for=\"rb" + bloc.id + "_" + item + "\">" + v[k].substr(1) + "</label>\n";
      }
      item++;
    }
    htm += "  </form>\n";
  }
  if (vals.length>2) htm += "  <div>" + vals[2] + "</div>\n";
  htm += "</div>\n";
  
  bloc.html = htm;
}

function combo_new()
{
  //on demande le texte initial
  txt = prompt("liste déroulante\n\nEncadrer les choix par '|' ; Le texte juste commence par * Les autres par $\n(Les chats sont |$des arbres$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("combo", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function combo_create_html(bloc, txt)
{
  htm = "";
  htm += "<div class=\"item lignef combo\" tpe=\"combo\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  if (vals.length>1)
  {
    // le choix
    htm += "  <div>\n";
    htm += "    <select itemid=\"" + bloc.id + "\" class=\"exo\" onchange=\"change(this)\">\n";
    htm += "      <option value=\"0\">--</option>\n";
    v = vals[1].replace(/\*/g,"|*").replace(/\$/g,"|$").split("|");
    juste = "";
    for (let k=0; k<v.length; k++)
    {
      if (v[k].startsWith("*"))
      {
        htm += "      <option value=\"1\">" + v[k].substr(1) + "</option>\n";
        juste = v[k].substr(1);
      }
      else if (v[k].startsWith("$"))
      {
        htm += "      <option value=\"0\">" + v[k].substr(1) + "</option>\n";
      }
    }
    htm += "    </select>\n";
    htm += "    <div class=\"combo_corr\">" + juste + "</div>\n";
    htm += "  </div>\n";
  }
  if (vals.length>2) htm += "  <div>" + vals[2] + "</div>\n";
  htm += "</div>\n";
  
  bloc.html = htm;
}
function combo_ini(bloc)
{
  // rien de sécial à faire !
}
function combo_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>liste déroulante</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $<br/>(Les chats sont |$des arbres$des oiseaux*des félins|)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
}

function texte_new()
{
  //on demande le texte initial
  txt = prompt("zone de texte\n\nEncadrer le texte juste par '|' ('#' = tout est juste)\n(La souris|a|peur du chat)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("texte", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function texte_create_html(bloc, txt)
{
  // on récupère les infos de la zone de texte
  l = bloc.texte_l;
  h = bloc.texte_h;
  enter = bloc.texte_e;
  comp = bloc.texte_c;
  
  htm = "";
  htm += "<div class=\"item lignef texte\" tpe=\"texte\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" options=\"";
  htm += comp + "|" + enter + "\" >\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  
  if (l == 0) htm += "  <div style=\"width: 100%;\">\n"
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  if (vals.length>1)
  {
    htm += "  <div>\n";
    if (h > 1) htm += "   <textarea rows=\"" + h + "\" ";
    else htm += "   <input type=\"text\" ";
    htm += "class=\"exo\" itemid=\"" + bloc.id + "\" onKeyUp=\"change(this)\" ";
    if (l==0) htm += "style=\"box-sizing: border-box; width:100%;\">";
    else if (h>1) htm += "cols=\"" + l + "\">";
    else htm += "size=\"" + l + "\">";
    if (h>1) htm += "</textarea>";
    htm += "\n    <div class=\"texte_corr\">" + vals[1] + "</div>\n";
    htm += "  </div>\n";
  }
  if (vals.length>2) htm += "  <div>" + vals[2] + "</div>\n";
  if (l == 0) htm += "  </div>\n";
  htm += "</div>\n";
  
  bloc.html = htm;
}
function texte_ini(bloc)
{
  bloc.texte_l = "10";
  bloc.texte_h = "1";
  bloc.texte_e = "0";
  bloc.texte_c = "0";
}
function texte_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    document.getElementById("cr_expl").innerHTML = "<b>zone de texte</b><br/>Encadrer le texte juste par '|' ('#' = tout est juste)<br/>(La souris|a|peur du chat)";
    document.getElementById("cr_txt_ini_div").style.display = "inline";
  }
  if (selection.length > 0 && selection_is_homogene("texte"))
  {
    bloc = selection[0];
    document.getElementById("cr_texte_l").value = bloc.texte_l;
    document.getElementById("cr_texte_h").value = bloc.texte_h;
    document.getElementById("cr_texte_e").value = bloc.texte_e;
    document.getElementById("cr_texte_c").value = bloc.texte_c;
    document.getElementById("cr_texte_div").style.display = "block";
  }
}

function multi_new()
{
  //on demande le texte initial
  txt = prompt("blocs multi-positions\n\nEncadrer les blocs par '|' ; Les blocs à colorer commencent par le numéro de la couleur\n(1Le chat|2mange|les souris.)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("multi", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function multi_create_html(bloc, txt)
{
  var htm = "";
  htm += "<div class=\"item ligne2f multi\" tpe=\"multi\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\"";
  var opts = "";
  var maj = "";
  var suff = "";
  for (let i=0; i<bloc.multi_coul.length; i++)
  {
    if (i>0)
    {
      opts += "|";
      maj += "|";
      suff += "|";
    }
    opts += hex2rgb(bloc.multi_coul[i]);
    maj += bloc.multi_maj[i];
    suff += bloc.multi_suff[i];
  }
  htm += "options=\"" + opts + "\" maj=\"" + maj + "\" suff=\"" + suff + "\">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  htm2 = "";
  for (let i=0; i<vals.length; i++)
  {
    if (vals[i].length>0)
    {
      tx = vals[i];
      htm += "  <span class=\"exo\" itemid=\"" + bloc.id + "\" onclick=\"change(this)\" ";
      htm2 += "    <span ";
      if (parseInt(tx.substr(0,1)) < 6)
      {
        htm += "juste=\"" + parseInt(tx.substr(0,1)) + "\" ";
        htm2 += "style=\"background-color: " + bloc.multi_coul[parseInt(tx.substr(0,1)) - 1] + ";\" ";
        tx = tx.substr(1);
      }
      htm += ">" + tx + "</span>\n";
      htm2 += ">" + tx + "</span>\n";
    }
  }
  htm += "  <img class=\"multi_cim\" />\n";
  htm += "  <br/>\n";
  htm += "  <span class=\"multi_corr\" itemid=\"" + bloc.id + "\">\n";
  htm += htm2;
  htm += "  </span>\n";
  htm += "</div>\n";
  
  bloc.html = htm;
}
function multi_ini(bloc)
{
  bloc.multi_coul = ["#00ff00", "#ff0000"];
  bloc.multi_maj = ["0", "0"];
  bloc.multi_suff = ["", ""];
}
function multi_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    document.getElementById("cr_expl").innerHTML = "<b>blocs multi-positions</b><br/>Encadrer les blocs par '|' ; Les blocs à colorer commencent par le numéro de la couleur<br/>(1Le chat|2mange|les souris.)";
    document.getElementById("cr_txt_ini_div").style.display = "inline";
  }
  
  if (selection.length > 0 && selection_is_homogene("multi"))
  {
    bloc = selection[0];
    document.getElementById("cr_coul_nb").value = bloc.multi_coul.length;
    for (let i=0; i<bloc.multi_coul.length; i++)
    {
      tx = "cr_coul" + (i+1);
      document.getElementById(tx).jscolor.fromString(bloc.multi_coul[i]);
      document.getElementById(tx + "_maj").checked = (bloc.multi_maj[i] == "1");
      document.getElementById(tx + "_suff").checked = (bloc.multi_suff[i] != "");
      document.getElementById(tx + "_suff_txt").value = bloc.multi_suff[i];
    }
    document.getElementById("cr_coul_nb").style.display = "block";
    cr_coul_nb_change(document.getElementById("cr_coul_nb"), false);
  }
}

function cible_new()
{
  //on demande le texte initial
  txt = prompt("zone cible\n\nIdentifiant des objet qui peuvent être posés\nséparer les identifiant par '|'", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc = bloc_new("cible", txt);
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function cible_create_html(bloc, txt)
{
  // on récupère les infos de la zone de texte
  l = bloc.texte_l;
  h = bloc.texte_h;
  enter = bloc.texte_e;
  comp = bloc.texte_c;
  
  htm = "<div class=\"item lignef cible exo\" tpe=\"cible\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" juste=\"" + txt + "\" points=\"" + bloc.points + "\">\n";
  htm += "</div>\n";
  
  bloc.html = htm;
}
function cible_ini(bloc)
{
  bloc.width = "50";
  bloc.height = "50";
  bloc.size = "manuel";
  bloc.fond_coul = "#6B6B6B";
  bloc.fond_alpha = "20";
  bloc.marges = 0;
}
function cible_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>zone cible</b><br/>Identifiant des objet qui peuvent être posés<br/>séparer les identifiant par '|'";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
  //pas de texte...
  document.getElementById("cr_font_fam").disabled = true;
  document.getElementById("cr_font_size").disabled = true;
  document.getElementById("cr_font_g").disabled = true;
  document.getElementById("cr_font_i").disabled = true;
  document.getElementById("cr_font_s").disabled = true;
  document.getElementById("cr_font_b").disabled = true;
  document.getElementById("cr_font_coul").disabled = true;
}

function image_new()
{
  //on crée le nouveau bloc
  bloc = bloc_new("image", "");
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function image_create_html(bloc, txt)
{
  htm = "";
  htm += "<div";
  if (bloc.inter == 2) htm += " class=\"mv_src\" id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <img class=\"item exo image\" tpe=\"image\" item=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += "src=\"" + bloc.img_rpath;
  htm += "\" id=\"" + bloc.id + "\" />\n</div>";
  bloc.html = htm;
}
function image_ini(bloc)
{
  // rien à faire
  bloc.img_rpath = "";
  bloc.img_vpath = "";
  bloc.img_name = "";
  bloc.width = "50";
  bloc.size = "ratio";
  bloc.points = "0";
  bloc.marges = 0;
}
function image_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    
    document.getElementById("cr_img_select").value = bloc.img_name;
    
    document.getElementById("cr_expl").innerHTML = "<b>image</b><br/>Sélectionner l'image choisie.";
    document.getElementById("cr_img_get_div").style.display = "inline";
  }
  if (selection.length > 0 && selection_is_homogene("image")) selection_update_interactions();
  //pas de texte...
  document.getElementById("cr_font_fam").disabled = true;
  document.getElementById("cr_font_size").disabled = true;
  document.getElementById("cr_font_g").disabled = true;
  document.getElementById("cr_font_i").disabled = true;
  document.getElementById("cr_font_s").disabled = true;
  document.getElementById("cr_font_b").disabled = true;
  document.getElementById("cr_font_coul").disabled = true;
}

function texte_simple_new(vide)
{
  //on demande le texte initial
  var txt = "";
  if (!vide) txt = prompt("texte\n\nTexte à insérer", "");
  if (!txt )
  {
    //forcer charactère espace pour éviter cadre vide
    txt = "";
  }
  
  //on crée le nouveau bloc
  if (vide) bloc = bloc_new("rect", txt);
  else bloc = bloc_new("texte_simple", txt);
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function texte_simple_create_html(bloc, txt)
{
  htm = "<div";
  if (bloc.inter == 2) htm += " class=\"mv_src\" id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <div class=\"item lignef texte_simple exo\" tpe=\"texte_simple\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += ">\n";
  htm += txt.replace(/(?:\r\n|\r|\n)/g, '<br />');
  htm += "</div>\n</div>\n";
  
  bloc.html = htm;
}
function texte_simple_ini(bloc)
{
  // rien à faire
  bloc.points = "0";
  bloc.size = "manuel";
  if (bloc.tpe == "rect")
  {
    bloc.width = 40;
    bloc.height = 40;
    bloc.fond_coul = "#4AC1D8";
    bloc.fond_alpha = "100";
    bloc.marges = 0;
  }
}
function texte_simple_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    document.getElementById("cr_expl").innerHTML = "<b>texte simple</b><br/>Entrer le texte";
    document.getElementById("cr_txt_ini_div").style.display = "inline";
  }
  
  if (selection.length > 0 && selection_is_homogene("texte_simple")) selection_update_interactions();
}

function rect_create_html(bloc, txt)
{
  texte_simple_create_html(bloc, txt);
}
function rect_ini(bloc)
{
  texte_simple_ini(bloc);
}
function rect_sel_update()
{
  texte_simple_sel_update();
}

function audio_new()
{
  //on crée le nouveau bloc
  bloc = bloc_new("audio", "");
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function audio_create_html(bloc, txt)
{
  htm = "";
  htm += "<div";
  if (bloc.inter == 2) htm += " class=\"mv_src\" id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <img class=\"item exo audio\" tpe=\"audio\" item=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += "src=\"audacity.svg\" onclick=\"audio_play(this)\"";
  htm += " id=\"" + bloc.id + "\" />\n";
  htm += "<audio class=\"audio_src\" id=\"audio_" + bloc.id + "\" src=\"" + bloc.audio_name + "\"></audio>";
  htm += "</div>";
  bloc.html = htm;
}
function audio_ini(bloc)
{
  bloc.audio_name = "";
  bloc.width = "32";
  bloc.height = "32";
  bloc.size = "ratio";
  bloc.points = "0";
  bloc.marges = 0;
}
function audio_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    
    document.getElementById("cr_audio_select").value = bloc.audio_name.substr(5);
    
    document.getElementById("cr_expl").innerHTML = "<b>audio</b><br/>Sélectionner un fichier sonore.";
    document.getElementById("cr_audio_get_div").style.display = "flex";
  }
  if (selection.length > 0 && selection_is_homogene("audio")) selection_update_interactions();
  //pas de texte...
  document.getElementById("cr_font_fam").disabled = true;
  document.getElementById("cr_font_size").disabled = true;
  document.getElementById("cr_font_g").disabled = true;
  document.getElementById("cr_font_i").disabled = true;
  document.getElementById("cr_font_s").disabled = true;
  document.getElementById("cr_font_b").disabled = true;
  document.getElementById("cr_font_coul").disabled = true;
}

function cercle_new()
{
  //on crée le nouveau bloc
  bloc = bloc_new("cercle", "");
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function cercle_create_html(bloc, txt)
{
  //on calcule tous les paramètres
  
  htm = "<div";
  if (bloc.inter == 2) htm += " class=\"mv_src\" id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <svg preserveAspectRatio=\"none\" viewbox=\"0 0 100 100\" class=\"item lignef svg exo\" tpe=\"cercle\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += ">\n";
  var rr = 50
  if (bloc.bord != "hidden") rr -= parseFloat(bloc.bord_size)/2;
  htm += "<ellipse cx=\"50\" cy=\"50\" rx=\"" + rr + "\" ry=\"" + rr + "\" id=\"svg_" + bloc.id + "\" />";
  htm += "</svg>\n</div>\n";
  
  bloc.html = htm;
}
function cercle_ini(bloc)
{
  // rien à faire
  bloc.points = "0";
  bloc.size = "manuel";
  bloc.height = 40;
  bloc.width = 40;
  bloc.fond_coul = "#4AC1D8";
  bloc.fond_alpha = "100";
  bloc.marges = 0;
}
function cercle_sel_update()
{
  if (selection.length > 0 && selection_is_homogene("cercle")) selection_update_interactions();
  //pas de texte...
  document.getElementById("cr_font_fam").disabled = true;
  document.getElementById("cr_font_size").disabled = true;
  document.getElementById("cr_font_g").disabled = true;
  document.getElementById("cr_font_i").disabled = true;
  document.getElementById("cr_font_s").disabled = true;
  document.getElementById("cr_font_b").disabled = true;
  document.getElementById("cr_font_coul").disabled = true;
  //coins arrondis
  document.getElementById("cr_bord_rond").disabled = true;
}

function ligne_new()
{
  //on crée le nouveau bloc
  bloc = bloc_new("ligne", "");
  
  //on le sélectionne
  selection = [bloc];
  selection_change();
}
function ligne_adapt_vals(bloc, x1, y1, x2, y2)
{
  //on cherche les extrems en x et y
  var ep = Math.ceil(parseFloat(bloc.bord_size)/2);
  var nx1, nx2, nxy1, ny2;
  var rep = false;
  if (x1<x2)
  {
    bloc.left += x1 - ep;
    nx1 = x1;
    ny1 = y1;
    nx2 = x2;
    ny2 = y2;
  }
  else
  {
    rep = true;
    bloc.left += x2 - ep;
    nx1 = x2;
    ny1 = y2;
    nx2 = x1;
    ny2 = y1;
  }
  bloc.width = nx2-nx1 + parseFloat(bloc.bord_size);
  bloc.x1 = ep;
  bloc.x2 = nx2-nx1 + ep;
  if (ny1<ny2)
  {
    bloc.top += ny1 - ep;
    bloc.height = ny2-ny1 + parseFloat(bloc.bord_size);
    bloc.y1 = ep;
    bloc.y2 = ny2-ny1 + ep;
  }
  else
  {
    bloc.top += ny2 - ep;
    bloc.height = ny1-ny2 + parseFloat(bloc.bord_size);
    bloc.y2 = ep;
    bloc.y1 = ny1-ny2 + ep;
  }
  return rep;
}
function ligne_create_html(bloc, txt)
{
  //on calcule tous les paramètres
  
  htm = "<div";
  if (bloc.inter == 2) htm += " class=\"mv_src\" id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <svg class=\"item lignef svg exo\" tpe=\"ligne\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += ">\n";
  htm += "<line x1=\"" + bloc.x1 + "\" y1=\"" + bloc.y1 +"\" x2=\"" + bloc.x2 + "\" y2=\"" + bloc.y2 + "\" id=\"svg_" + bloc.id + "\" />";
  htm += "</svg>\n</div>\n";
  
  bloc.html = htm;
}
function ligne_ini(bloc)
{
  // rien à faire
  bloc.points = "0";
  bloc.size = "auto";
  bloc.x1 = 2;
  bloc.y1 = 2;
  bloc.x2 = 82;
  bloc.y2 = 12;
  bloc.width = 84;
  bloc.height = 14;
  bloc.bord_coul = "#4AC1D8";
  bloc.bord = "solid";
  bloc.bord_size = 4;
  bloc.marges = 0;
}
function ligne_sel_update()
{
  if (selection.length > 0 && selection_is_homogene("ligne")) selection_update_interactions();
  //pas de texte...
  document.getElementById("cr_font_fam").disabled = true;
  document.getElementById("cr_font_size").disabled = true;
  document.getElementById("cr_font_g").disabled = true;
  document.getElementById("cr_font_i").disabled = true;
  document.getElementById("cr_font_s").disabled = true;
  document.getElementById("cr_font_b").disabled = true;
  document.getElementById("cr_font_coul").disabled = true;
  //coins arrondis
  document.getElementById("cr_bord_rond").disabled = true;
  //fond
  document.getElementById("cr_fond_coul").disabled = true;
  document.getElementById("cr_fond_alpha").disabled = true;
}

function _mv_ini()
{
  inter = interact('.mv_rs');
  inter.draggable({
    onmove: _dragMoveListener,
    onend: _drag_rs_end,
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }}
  });
  inter.resizable({
    preserveAspectRatio: true,
    onend: _drag_rs_end,
    edges: { left: true, right: true, bottom: true, top: true }
  });
  inter.on('resizemove', _drag_rsl_resize);
  
  inter2 = interact('.mv');
  inter2.draggable({
    onmove: _dragMoveListener,
    onend: _drag_rs_end,
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }}
  });
  
  inter3 = interact('.mv_rsl');
  inter3.draggable({
    onmove: _dragMoveListener,
    onend: _drag_rs_end,
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }}
  });
  inter3.resizable({
    preserveAspectRatio: false,
    onend: _drag_rs_end,
    edges: { left: true, right: true, bottom: true, top: true }
  });
  inter3.on('resizemove', _drag_rsl_resize);
}

function _dragMoveListener (event)
{
  if ((event.target.id == "extrema_1" || event.target.id == "extrema_2") && selection.length > 0)
  {
    bloc = selection[0];
    //on déplace l'extrema
    event.target.style.top = parseFloat(event.target.style.top) + event.dy + "px";
    event.target.style.left = parseFloat(event.target.style.left) + event.dx + "px";
    //on modifie la ligne comme il faut
    var inv = false;
    if (event.target.getAttribute('extrema') == "1")
    {
      inv = ligne_adapt_vals(bloc, bloc.x1 + event.dx, bloc.y1 + event.dy, bloc.x2, bloc.y2);
    }
    else
    {
      inv = ligne_adapt_vals(bloc, bloc.x1, bloc.y1, bloc.x2 + event.dx, bloc.y2 + event.dy);
    }
    if (inv)
    {
      //les extrema sont inversés, il faut donc le traduire sur les carrés
      var elems = document.getElementsByClassName("extrema");
      for (let i=0; i<elems.length; i++)
      {
        if (elems[i].getAttribute("extrema") == "1") elems[i].setAttribute("extrema", "2");
        else elems[i].setAttribute("extrema", "1");
      }
    }
    // on modifie le style de la ligne en conséquence
    var svg = document.getElementById("svg_" + bloc.id);
    var b = document.getElementById(bloc.id);
    var sb = rendu_get_superbloc(bloc);
    sb.style.left = bloc.left + "px";
    sb.style.top = bloc.top + "px";
    b.style.width = bloc.width + "px";
    b.style.height = bloc.height + "px";
    svg.setAttribute("x1", bloc.x1);
    svg.setAttribute("y1", bloc.y1);
    svg.setAttribute("x2", bloc.x2);
    svg.setAttribute("y2", bloc.y2);
    ligne_create_html(bloc, "");
  }
  else
  {
    for (let i=0; i<selection.length; i++)
    {
      bloc = selection[i];
      
      bloc.top = parseFloat(bloc.top) + event.dy;
      bloc.left = parseFloat(bloc.left) + event.dx;
      var sb = rendu_get_superbloc(bloc);
      sb.style.top = bloc.top + "px";
      sb.style.left = bloc.left + "px";
      if (i==0) // on affiche juste les valeurs du premier élément
      {
        document.getElementById("cr_tp_l").value = bloc.left;
        document.getElementById("cr_tp_t").value = bloc.top;
      }
      if (i==0 && bloc.tpe == "ligne")
      {
        var elems = document.getElementsByClassName("extrema");
        for (let j=0; j<elems.length; j++)
        {
          if (elems[j].getAttribute("extrema") == "1")
          {
            elems[j].style.left = bloc.left + bloc.x1 - 4 + "px";
            elems[j].style.top = bloc.top + bloc.y1 - 4 + "px";
          }
          else
          {
            elems[j].style.left = bloc.left + bloc.x2 - 4 + "px";
            elems[j].style.top = bloc.top + bloc.y2 - 4 + "px";
          }
        }
      }
    }
  }
}
function _drag_rs_end(event)
{
  selection_update();
  g_sauver();
}
function _drag_rsl_resize(event)
{
  var target = event.target;
  bloc = bloc_get_from_id(target.id.substr(9));

  // update the element's style
  if (event.rect.width > 15) bloc.width = event.rect.width;
  if (event.rect.height > 15) bloc.height = event.rect.height;
  if (bloc.tpe == "cercle")
  {
    document.getElementById(bloc.id).style.width  = bloc.width + 'px';
    document.getElementById(bloc.id).style.height = bloc.height + 'px';
  }
  else
  {
    target.style.width  = bloc.width + 'px';
    target.style.height = bloc.height + 'px';
  }
  document.getElementById("cr_tp_w").value = bloc.width;
  document.getElementById("cr_tp_h").value = bloc.height;
  
  // translate when resizing from top or left edges
  bloc.left += parseFloat(event.deltaRect.left);
  bloc.top += parseFloat(event.deltaRect.top);
  target.style.left = bloc.left + "px";
  target.style.top = bloc.top + "px";
}
