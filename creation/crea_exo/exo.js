var blocs = new Array();  // c'est un tableau qui rescence les données de chaque bloc
var selection = new Array();  // c'est un tableau avec les indices de blocs sélectionnés

var last_id = 0;    // dernier id utilisé

var exo_dos = ""  //chemin vers le dossier de l'exercice

var record = {};  //objet contenant tout ce qu'il faut pour enregistrer

var rendu = {}; //objet contenant la taille actuelle intérieure du rendu

function change(e)
{
}
function rendu_autosize(e)
{
  let bodystyle = window.getComputedStyle(document.body);
  let vw = document.documentElement.clientWidth - - parseInt(bodystyle.marginLeft) - parseInt(bodystyle.marginRight);
  let vh = document.documentElement.clientHeight - parseInt(bodystyle.marginTop) - parseInt(bodystyle.marginBottom);
  let wmax = vw-60-450-32;
  let r = document.getElementById("cr_rendu");
  if (vh > wmax*641/453)
  {
    console.log(wmax);
    r.style.height = wmax*641/453 + "px";
    r.style.width = wmax + "px";
  }
  else
  {
    r.style.height = vh + "px";
    r.style.width = vh*453/641 + "px";
  }
  rendu.height = parseFloat(r.style.height);
  rendu.width = parseFloat(r.style.width);
  document.getElementById("cr_opt").style.height = (vh-10) + "px";
  if (document.getElementById("exotice"))
  {
    document.getElementById("exotice").style.height = 40*rendu.height/1000 + "px";
    document.getElementById("user").style.fontSize = 20*rendu.height/1000 + "px";
  }
  for (let i=0; i<blocs.length; i++)
  {
    rendu_add_bloc(blocs[i]);
  }
}
function start(dos)
{
  //on redimmensionne le rendu
  window.addEventListener("resize", rendu_autosize);
  rendu_autosize(null);
  //si pas de nom d'exo dans l'url, il faut le rajouter ! (pour refresh...)
  if (window.location.href.substr(-1,1) == "=")
  {
    history.replaceState('ajout exo', document.title, window.location.href + dos.split("/").pop());
  }
  exo_dos = dos;
  _mv_ini();
  g_restaurer(true);

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
    txt += "color: unset; text-shadow: 0 0 " + b.font_coul + "; ";
    if (b.font_g == "true") txt += "font-weight: bold; ";
    if (b.font_i == "true") txt += "font-style: italic; ";
    if (b.font_s == "true") txt += "text-decoration: underline; ";
    if (b.font_b == "true") txt += "text-decoration: line-through; ";
    if (b.align == "1") txt += "text-align: left; ";
    else if (b.align == "2") txt += "text-align: center; ";
    else if (b.align == "3") txt += "text-align: right; ";
    //position-taille
    txt += "position: absolute; ";
    txt += "left: " + b.left*100/443 + "%; ";
    txt += "top: " + b.top*100/631 + "%; ";
    if (b.size == "manuel" || b.size == "ratio" || b.tpe == "ligne")
    {
      if (b.tpe == "cible")
      {
        txt += "min-width: " + b.width*100/443 + "%; ";
        txt += "min-height: " + b.height*100/631 + "%; ";
      }
      else
      {
        txt += "width: " + b.width*100/443 + "%; ";
        txt += "height: " + b.height*100/631 + "%; ";
      }
    }
    if (b.tpe == "ligne")
    {
      txt += "transform-origin: top left; ";
      txt += "width: 3px; ";
      txt += "height: " + b.height*100/631 + "%; ";
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
      txt += "background-color: unset; box-shadow: inset 0 0 0 2000px " + hex2rgba(b.fond_coul, b.fond_alpha) + "; ";
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

function file_sauve(fic, txt)
{
  let xhr = new XMLHttpRequest();
  ligne = "io=sauve&fic=" + fic + "&v=" + encodeURIComponent(txt);
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
  let txt = JSON.stringify(blocs);
  file_sauve(exo_dos + "/exo_sav.txt", txt);
  let pos = sessionStorage.getItem(exo_dos + "hist_pos");
  if (!pos) pos = -1;
  pos++;
  if (pos > 20)
  {
    //il faut supprimmer ceux du début
    sessionStorage.removeItem(exo_dos + "hist_" + (pos-20));
  }
  sessionStorage.setItem(exo_dos + "hist_" + pos, txt);
  sessionStorage.setItem(exo_dos + "hist_pos", pos);
}

function g_restaurer_hist(delta)
{
  let pos = sessionStorage.getItem(exo_dos + "hist_pos");
  if (!pos) pos = -1;
  pos = parseInt(pos) + delta;
  let txt = sessionStorage.getItem(exo_dos + "hist_" + pos);
  if (!txt || txt == "") return;
  sessionStorage.setItem(exo_dos + "hist_pos", pos);
  //on nettoie
  rendu_ini();
  blocs = [];
  selection = [];
  document.getElementById("cr_bloc_liste").options.length = 1;
  last_id = 0;
  selection_change();
  // on met les bonnes valeurs aux bons endroits
  var b = null;
  b = JSON.parse(txt);
  if (b) blocs = b;
  for (let i=0; i<blocs.length; i++)
  {
    // dans la liste
    let option = document.createElement("option");
    option.text = blocs[i].id + " (" + blocs[i].tpe + ")";
    option.value = blocs[i].id;
    document.getElementById("cr_bloc_liste").add(option);
    // et au rendu
    rendu_add_bloc(blocs[i]);
    if (blocs[i].id > last_id) last_id = blocs[i].id;
  }
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
        // on ajoute le bloc à la liste déroulante
        let option = document.createElement("option");
        option.text = blocs[i].id + " (" + blocs[i].tpe + ")";
        option.value = blocs[i].id;
        document.getElementById("cr_bloc_liste").add(option);
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
      let tosave = false;
      if (rep.length > 3 && rep.substr(0,4) == "****")
      {
        tosave = true;
        rep = rep.substr(4);
      }
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
          let vv = vals[i+3].split("|");
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
        if (vals.length>12) infos.show_bilan = vals[12];
        if (vals.length>13)
        {
          let vv = vals[13].split("|");
          if (vv.length>1)
          {
            infos.image = vv[0];
            infos.image_hover = vv[1];
          }
        }
      }
      if (tosave) g_sauver_info();
      infos_change();
    }
  };
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("io=charge&fic=" + exo_dos + "/exo.txt");
}

function g_reinit()
{
  //on nettoie
  rendu_ini();
  blocs = [];
  selection = [];
  last_id = 0;
  document.getElementById("cr_bloc_liste").options.length = 1;
  selection_change();
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
  // et dans la liste
  let option = document.createElement("option");
  option.text = bloc.id + " (" + bloc.tpe + ")";
  option.value = bloc.id;
  document.getElementById("cr_bloc_liste").add(option);
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
  bloc.align = "2";
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
  infos.show_bilan = "1";
  infos.image = "";
  infos.image_hover = "0";
}

//on initialise la zone de rendu (uniquement le prénom)
function rendu_ini()
{
  let htm = "<span fs=\"20\" id=\"user\">Prénom : Exemple-Prénom</span>\n";
  htm += "<img id=\"exotice\" src=\"../../exotice.svg\" />";
  document.getElementById("cr_rendu").innerHTML = htm;
  document.getElementById("exotice").style.height = 40*rendu.height/1000 + "px";
  document.getElementById("user").style.fontSize = 20*rendu.height/1000 + "px";
}

// on ajoute un bloc à la zone de rendu
function rendu_add_bloc(bloc)
{
  // 2 cas : soit le bloc est déjà dans le rendu (modif) soit il faut l'ajouter
  if (document.getElementById("cr_rendu_" + bloc.id))
  {
    var htm = bloc.html + "\n<div class=\"couverture\"></div>";
    document.getElementById("cr_rendu_" + bloc.id).innerHTML = htm;
  }
  else
  {
    // on crée le bloc
    var htm = "<div class=\"cr_rendu_bloc ";
    if (bloc.size == "ratio") htm += "mv_rs\" ";
    else if (bloc.size == "manuel") htm += "mv_rsl\" ";
    else htm += "mv\" ";
    htm += "id=\"cr_rendu_" + bloc.id + "\" onmousedown=\"bloc_mousedown(this, event)\" title=\"" + bloc.tpe + " (id=" + bloc.id + ")\">\n";
    htm += bloc.html;
    htm += "\n<div class=\"couverture\"></div></div>\n";
    
    //on l'ajoute
    document.getElementById("cr_rendu").innerHTML += htm;
  }

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
  let b = document.getElementById("cr_rendu_" + bloc.id);
  let e = document.getElementById(bloc.id);

  //police
  e.style.fontFamily = bloc.font_fam;
  e.style.fontSize = (parseFloat(bloc.font_size)*rendu.height/1000) + "px";
  e.style.color = bloc.font_coul;
  if (bloc.font_g == true) e.style.fontWeight = "bold";
  if (bloc.font_i == true) e.style.fontStyle = "italic";
  if (bloc.font_s == true) e.style.textDecoration = "underline";
  if (bloc.font_b == true) e.style.textDecoration = "line-through";
  //taille-position
  //pour les texte simples, on commence par initialiser les valeurs de tailles au texte
  if (bloc.tpe == "texte_simple" || bloc.tpe == "rect" || bloc.tpe == "ligne")
  {
    if (bloc.width == 0) bloc.width = Math.max(15, e.offsetWidth + 4)*rendu.width/443;
    if (bloc.height == 0) bloc.height = Math.max(10, e.offsetHeight)*rendu.height/631;
    b.style.width = bloc.width*100/443 + "%";
    e.parentNode.style.width = "100%";
    b.style.height = bloc.height*100/631 + "%";
    e.parentNode.style.height = "100%";
    e.style.width = "100%";
    e.style.height = "100%";
  }
  else if (bloc.tpe == "cercle")
  {
    e.style.width = bloc.width*100/443 + "%";
    e.style.height = bloc.height*100/631 + "%";
  }
  else if (bloc.size == "ratio")
  {
    b.style.width = bloc.width*100/443 + "%";
    e.style.width = "100%";
    // on triche un peu pour éviter les trucs bizarres (on initialise à un carré)
    if (bloc.height == "0") b.style.height = bloc.width*100/631 + "%";
    else b.style.height = bloc.height*100/631 + "%";
  }
  else if (bloc.size == "manuel")
  {
    b.style.width = bloc.width*100/443 + "%";
    e.style.width = "100%";
    b.style.height = bloc.height*100/631 + "%";
    e.style.height = "100%";
  }
  else
  {
    // le bloc est en ligne, on connait donc ses vraies dimensions
    bloc.width = e.offsetWidth*443/rendu.width;
    bloc.height = e.offsetHeight*631/rendu.height;
  }
  b.style.left = bloc.left*100/443 + "%";
  b.style.top = bloc.top*100/631 + "%";
  if (bloc.tpe == "ligne") b.style.transformOrigin = "top left";
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
    e.style.borderWidth = bloc.bord_size*rendu.width/443 + "px";
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
  //on enlève les carrés existants
  var c1 = document.getElementById("extrema_1");
  var c2 = document.getElementById("extrema_2");
  if (c1) c1.parentNode.removeChild(c1);
  if (c2) c2.parentNode.removeChild(c2);
  if (selection.length == 1 && selection[0].tpe == "ligne")
  {
    var b = selection[0];
    var c1 = "<div class=\"extrema mv\" id=\"extrema_1\" extrema=\"1\" ligne_id=\"" + b.id + "\" style=\"left: " + (b.left*rendu.width/443-4) + "px;top: " + (b.top*rendu.height/631-4) + "px;\"></div>";
    var c2 = "<div class=\"extrema mv\" id=\"extrema_2\" extrema=\"2\" ligne_id=\"" + b.id + "\" style=\"left: " + (b.x2*rendu.width/443-4) + "px;top: " + (b.y2*rendu.height/631-4) + "px;\"></div>";
    document.getElementById("cr_rendu").innerHTML += c1 + c2;
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
  rendu_select_blocs();
  
  // on s'occupe de la liste déroulante
  for (let j=0; j<document.getElementById("cr_bloc_liste").options.length; j++)
  {
    if (document.getElementById("cr_bloc_liste").options[j].value == "#")
    {
      document.getElementById("cr_bloc_liste").remove(j);
      break;
    }
  }
  if (selection.length == 1) document.getElementById("cr_bloc_liste").value = selection[0].id;
  else if (selection.length == 0) document.getElementById("cr_bloc_liste").value = "";
  else
  {
    let option = document.createElement("option");
    option.text = "multiple";
    option.value = "#";
    document.getElementById("cr_bloc_liste").add(option);
    document.getElementById("cr_bloc_liste").value = "#";
  }

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
  document.getElementById("cr_expl").innerHTML = "";
  
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
  document.getElementById("cr_font_g").checked = (bloc.font_g == "true");
  document.getElementById("cr_font_i").checked = (bloc.font_i == "true");
  document.getElementById("cr_font_s").checked = (bloc.font_s == "true");
  document.getElementById("cr_font_b").checked = (bloc.font_b == "true");
  document.getElementById("cr_align_l").checked = (bloc.align == "1");
  document.getElementById("cr_align_c").checked = (bloc.align == "2");
  document.getElementById("cr_align_r").checked = (bloc.align == "3");
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
  document.getElementById("cr_txt_ini_div").style.display = "block";
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
    document.getElementById("cr_txt_ini_div").style.display = "block";
  }
  //on regarde si la sélection est homogène
  if (selection.length>0 && selection_is_homogene("radiobtn"))
  {
    var elems = document.getElementsByClassName('cr_coul');
    elems[1].style.display = "block";
    elems[2].style.display = "block";
    document.getElementById("cr_coul1_barre").style.display = "none";
    document.getElementById("cr_coul1_maj").style.display = "none";
    document.getElementById("cr_coul1_suff").style.display = "none";
    document.getElementById("cr_coul1_suff_txt").style.display = "none";
    document.getElementById("cr_coul2_barre").style.display = "none";
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
  document.getElementById("cr_txt_ini_div").style.display = "block";
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
  htm += "<div fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item lignef " + cl + "\" tpe=\"" + bloc.tpe + "\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
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
  htm += "<div fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item lignef combo\" tpe=\"combo\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  if (vals.length>1)
  {
    // le choix
    htm += "  <div>\n";
    htm += "    <select id=\"combo_" + bloc.id + "\" itemid=\"" + bloc.id + "\" class=\"exo\" onchange=\"change(this)\">\n";
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
  document.getElementById("cr_txt_ini_div").style.display = "block";
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
  let corr = "texte_corr";
  if (bloc.texte_corr == "1") corr += "2";
  
  htm = "";
  htm += "<div fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item lignef texte\" tpe=\"texte\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" options=\"";
  htm += comp + "|" + enter + "|" + bloc.texte_corr + "\" >\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  if (vals.length>0 && vals[0].substr(-1) == " ") vals[0] = vals[0].slice(0,-1) + "&nbsp;";
  if (vals.length>2 && vals[2].substr(0,1) == " ") vals[2] = "&nbsp;" + vals[2].substr(1) ;
  if (l == 0) htm += "  <div style=\"width: 100%;\">\n"
  if (vals.length>0) htm += "  <div>" + vals[0] + "<div class=\"" + corr + "\">&nbsp;</div></div>\n";
  if (vals.length>1)
  {
    htm += "  <div>\n";
    if (h > 1) htm += "   <textarea rows=\"" + h + "\" ";
    else htm += "   <input type=\"text\" ";
    htm += "class=\"exo\" id=\"texte_" + bloc.id + "\" itemid=\"" + bloc.id + "\" onKeyUp=\"change(this)\" ";
    if (l==0) htm += "style=\"box-sizing: border-box; width:100%;\">";
    else if (h>1) htm += "cols=\"" + l + "\">";
    else htm += "size=\"" + l + "\">";
    if (h>1) htm += "</textarea>";
    htm += "\n    <div class=\"" + corr + "\">" + vals[1] + "</div>\n";
    htm += "  </div>\n";
  }
  if (vals.length>2) htm += "  <div>" + vals[2] + "<div class=\"" + corr + "\">&nbsp;</div></div>\n";
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
  bloc.texte_corr = "0";
}
function texte_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    document.getElementById("cr_expl").innerHTML = "<b>zone de texte</b><br/>Encadrer le texte juste par '|' ('#' = tout est juste)<br/>(La souris|a|peur du chat)";
    document.getElementById("cr_txt_ini_div").style.display = "block";
  }
  if (selection.length > 0 && selection_is_homogene("texte"))
  {
    bloc = selection[0];
    document.getElementById("cr_texte_l").value = bloc.texte_l;
    document.getElementById("cr_texte_h").value = bloc.texte_h;
    document.getElementById("cr_texte_e").value = bloc.texte_e;
    document.getElementById("cr_texte_c").value = bloc.texte_c;
    document.getElementById("cr_texte_corr").checked = (bloc.texte_corr == "1");
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
  htm += "<div fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item ligne2f multi\" tpe=\"multi\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\"";
  var opts = "";
  var maj = "";
  var suff = "";
  var barre = "";
  for (let i=0; i<bloc.multi_coul.length; i++)
  {
    if (i>0)
    {
      opts += "|";
      maj += "|";
      suff += "|";
      barre += "|";
    }
    opts += hex2rgb(bloc.multi_coul[i]);
    maj += bloc.multi_maj[i];
    suff += bloc.multi_suff[i];
    barre += bloc.multi_barre[i];
  }
  htm += " options=\"" + opts + "\" maj=\"" + maj + "\" suff=\"" + suff + "\" barre=\"" + barre + "\">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  htm2 = "";
  for (let i=0; i<vals.length; i++)
  {
    if (vals[i].length>0)
    {
      tx = vals[i];
      htm += "  <span id=\"multi_" + bloc.id + "_" + i + "\" class=\"exo\" itemid=\"" + bloc.id + "\" onclick=\"change(this)\" ";
      htm2 += "    <span ";
      let idjuste = parseInt(tx.substr(0,1));
      let tx2 = tx;
      if (idjuste < 6)
      {
        htm += "juste=\"" + idjuste + "\" ";
        htm2 += "style=\"background-color: " + bloc.multi_coul[idjuste - 1] + ";";
        if (bloc.multi_barre[idjuste - 1] == "1") htm2 += "text-decoration: line-through;";
        htm2 += "\" ";
        tx = tx.substr(1);
        tx2 = tx;
        if (bloc.multi_maj[idjuste - 1] == "1") tx2 = tx.substr(0,1).toUpperCase() + tx.substr(1);
        if (bloc.multi_suff[idjuste - 1] != "") tx2 = tx + bloc.multi_suff[idjuste - 1];
      }
      htm += ">" + tx + "<span class=\"multi_ini\">" + tx +"</span></span>\n";
      htm2 += ">" + tx2 + "</span>\n";
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
  bloc.multi_barre = ["0", "0"];
}
function multi_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length == 1)
  {
    bloc = selection[0];
    document.getElementById("cr_expl").innerHTML = "<b>blocs multi-positions</b><br/>Encadrer les blocs par '|' ; Les blocs à colorer commencent par le numéro de la couleur<br/>(1Le chat|2mange|les souris.)";
    document.getElementById("cr_txt_ini_div").style.display = "block";
  }
  
  if (selection.length > 0 && selection_is_homogene("multi"))
  {
    bloc = selection[0];
    document.getElementById("cr_coul_nb").value = bloc.multi_coul.length;
    for (let i=0; i<bloc.multi_coul.length; i++)
    {
      tx = "cr_coul" + (i+1);
      document.getElementById(tx).jscolor.fromString(bloc.multi_coul[i]);
      document.getElementById(tx + "_barre").checked = (bloc.multi_barre[i] == "1");
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
  //on crée le nouveau bloc
  bloc = bloc_new("cible", "");
  
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
  
  htm = "<div ondragover=\"drag_over(event)\" ondrop=\"drag_drop(event)\" fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item lignef cible exo\" tpe=\"cible\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" juste=\"" + txt + "\" points=\"" + bloc.points + "\">\n";
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
  
  document.getElementById("cr_expl").innerHTML = "<b>zone cible</b><br/>Identifiant des objets qui peuvent être posés<br/>séparer les identifiant par '|'";
  document.getElementById("cr_txt_ini_div").style.display = "block";
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
  if (bloc.inter == 2) htm += " id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <img ";
  if (bloc.inter == 2) htm += "draggable=true ondragstart=\"drag_start(event)\" ";
  else htm += "ondragstart=\"return false;\" ";
  htm += "fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item exo image\" tpe=\"image\" item=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "*") htm += "lineok=\"" + bloc.relie_id + "\" ";
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
    document.getElementById("cr_img_get_div").style.display = "block";
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
  if (bloc.inter == 2) htm += " id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <div ";
  if (bloc.inter == 2) htm += "draggable=true ondragstart=\"drag_start(event)\" ";
  htm += "fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item lignef texte_simple exo\" tpe=\"texte_simple\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "*") htm += "lineok=\"" + bloc.relie_id + "\" ";
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
    document.getElementById("cr_txt_ini_div").style.display = "block";
  }
  
  if (selection.length > 0 && selection_is_homogene(selection[0].tpe)) selection_update_interactions();
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
  if (bloc.inter == 2) htm += " id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <img ";
  if (bloc.inter == 2) htm += "draggable=true ondragstart=\"drag_start(event)\" ";
  htm += "fs=\"" + bloc.font_size + "\" bs=\"" + bloc.bord_size + "\" class=\"item exo audio\" tpe=\"audio\" item=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "*") htm += "lineok=\"" + bloc.relie_id + "\" ";
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
  if (bloc.inter == 2) htm += " id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <svg ";
  if (bloc.inter == 2) htm += "draggable=true ondragstart=\"drag_start(event)\" ";
  htm += "preserveAspectRatio=\"none\" viewbox=\"0 0 100 100\" class=\"item lignef svg exo\" tpe=\"cercle\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "*") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += ">\n";
  var rr = 50
  if (bloc.bord != "hidden") rr -= parseFloat(bloc.bord_size)/2;
  htm += "<ellipse vector-effect=\"non-scaling-stroke\" cx=\"50\" cy=\"50\" rx=\"" + rr + "\" ry=\"" + rr + "\" id=\"svg_" + bloc.id + "\" />";
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
function ligne_calc(bloc, x1, y1, x2, y2)
{
  bloc.left = x1;
  bloc.top = y1;
  bloc.x2 = x2;
  bloc.y2 = y2;
  bloc.height = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    
  var angle = 180 / 3.1415 * Math.acos((y2 - y1) / bloc.height);
  if(x2 > x1) angle *= -1;
  bloc.rotation = angle;
}
function ligne_create_html(bloc, txt)
{
  //on calcule tous les paramètres
  htm = "<div";
  if (bloc.inter == 2) htm += " id=\"cible_" + bloc.id + "\"";
  htm += ">\n  <svg ";
  if (bloc.inter == 2) htm += "draggable=true ondragstart=\"drag_start(event)\" ";
  htm += "class=\"item lignef svg exo\" preserveAspectRatio=\"none\" viewbox=\"0 0 100 100\" tpe=\"ligne\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" points=\"" + bloc.points + "\" ";
  if (bloc.inter == 1)
  {
    htm += "line=\"1\" ";
    if (bloc.relie_id != "*") htm += "lineok=\"" + bloc.relie_id + "\" ";
  }
  htm += ">\n";
  htm += "<line vector-effect=\"non-scaling-stroke\" x1=\"50\" y1=\"0\" x2=\"50\" y2=\"100\" id=\"svg_" + bloc.id + "\" />";
  htm += "</svg>\n</div>\n";
  
  bloc.html = htm;
}
function ligne_ini(bloc)
{
  // rien à faire
  bloc.points = "0";
  bloc.size = "auto";
  bloc.x2 = bloc.left + 50;
  bloc.y2 = bloc.top + 50;
  bloc.width = 3;
  bloc.height = 70.71;
  bloc.rotation = -45;
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
    margin: 5,
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
    margin: 5,
    edges: { left: true, right: true, bottom: true, top: true }
  });
  inter3.on('resizemove', _drag_rsl_resize);
}

function _dragMoveListener (event)
{
  let dx = event.dx*443/rendu.width;
  let dy = event.dy*631/rendu.height;
  if ((event.target.id == "extrema_1" || event.target.id == "extrema_2") && selection.length > 0)
  {
    bloc = selection[0];
    //on déplace l'extrema
    event.target.style.top = parseFloat(event.target.style.top) + event.dy + "px";
    event.target.style.left = parseFloat(event.target.style.left) + event.dx + "px";
    //on modifie la ligne comme il faut
    if (event.target.id == "extrema_1")
    {
      ligne_calc(bloc, bloc.left + dx, bloc.top + dy, bloc.x2, bloc.y2);
    }
    else
    {
      ligne_calc(bloc, bloc.left, bloc.top, bloc.x2 + dx, bloc.y2 + dy);
    }
    // on modifie le style de la ligne en conséquence
    var sb = rendu_get_superbloc(bloc);
    sb.style.left = bloc.left*100/443 + "%";
    sb.style.top = bloc.top*100/631 + "%";
    sb.style.height = bloc.height*100/631 + "%";
    sb.style.transform = "rotate(" + bloc.rotation + "deg)";
    ligne_create_html(bloc, "");
  }
  else
  {
    for (let i=0; i<selection.length; i++)
    {
      bloc = selection[i];
      
      bloc.top = parseFloat(bloc.top) + dy;
      bloc.left = parseFloat(bloc.left) + dx;
      var sb = rendu_get_superbloc(bloc);
      sb.style.top = bloc.top*100/631 + "%";
      sb.style.left = bloc.left*100/443 + "%";
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
          elems[j].style.left = parseFloat(elems[j].style.left) + event.dx + "px";
          elems[j].style.top = parseFloat(elems[j].style.top) + event.dy + "px";
        }
        bloc.x2 += dx;
        bloc.y2 += dy;
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
  if (event.rect.width > 15) bloc.width = event.rect.width*443/rendu.width;
  if (event.rect.height > 15) bloc.height = event.rect.height*631/rendu.height;
  if (bloc.tpe == "cercle")
  {
    document.getElementById(bloc.id).style.width  = bloc.width*100/443 + '%';
    document.getElementById(bloc.id).style.height = bloc.height*100/631 + '%';
  }
  else
  {
    target.style.width  = bloc.width*100/443 + '%';
    target.style.height = bloc.height*100/631 + '%';
  }
  document.getElementById("cr_tp_w").value = bloc.width;
  document.getElementById("cr_tp_h").value = bloc.height;
  
  // translate when resizing from top or left edges
  bloc.left += parseFloat(event.deltaRect.left)*443/rendu.width;
  bloc.top += parseFloat(event.deltaRect.top)*631/rendu.height;
  target.style.left = bloc.left*100/443 + "%";
  target.style.top = bloc.top*100/631 + "%";
}
