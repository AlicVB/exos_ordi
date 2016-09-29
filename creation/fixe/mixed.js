var infos = {};

var blocs = new Array();  // c'est un tableau qui rescence les données de chaque bloc
var selection = new Array();  // c'est un tableau avec les indices de blocs sélectionnés

var last_id = 0;    // dernier id utilisé

function change(e)
{
}
  
function start()
{
  _mv_ini();
  g_restaurer(true);
  g_restaurer_info(false);
  cr_tab_click(document.getElementById("cr_tab_info"));
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

function file_create_css()
{
  txt = "";
  for (i=0; i<blocs.length; i++)
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
    txt += "width: " + b.width*100/443 + "%; ";
    txt += "height: " + b.height*100/641 + "%; ";
    //bords
    if (b.bord != "hidden")
    {
      txt += "border-style: " + b.bord + "; ";
      txt += "border-color: " + b.bord_coul + "; ";
      txt += "border-width: " + b.bord_size + "px; ";
      txt += "border-radius: " + b.bord_rond + "px; ";
    }
    //fond
    if (b.fond_alpha != 0)
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

function g_exporter()
{
  // on commence le décodage
  var txt = "<style>\n" + file_create_css() + "</style>\n\n";
  txt += document.getElementById("html").value;
  
  var zip = new JSZip();
  zip.file("exo.php", txt);
  for (i=0; i<blocs.length; i++)
  {
    if (blocs[i].tpe == "image")
    {
      if (blocs[i].img) zip.file("img_" + blocs[i].id + "." + blocs[i].img_ext, blocs[i].img);
    }
    
  }
  zip.file("exo.css", file_css());
  zip.file("exo.js", file_js());
  zip.file("charge.php", file_charge());
  zip.file("sauve.php", file_sauve());
  zip.file("exo_sav.txt", JSON.stringify(blocs) + "ǂ" + JSON.stringify(infos));
  
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, "exo.zip");
  });
}

function g_sauver()
{
  txt = JSON.stringify(blocs);
  localStorage.setItem('create_exo_blocs', txt);
}
function g_sauver_info()
{
  txt = JSON.stringify(infos);
  localStorage.setItem('create_exo_infos', txt);
}
function g_restaurer(init)
{
  //on nettoie
  if (init) g_reinit();
  
  //on refait
  b = JSON.parse(localStorage.getItem('create_exo_blocs'));
  if (b) blocs = b;
  last_id = 0;
  for (i=0; i<blocs.length; i++)
  {
    //on ajoute le bloc à la liste
    var option = document.createElement("option");
    option.text = blocs[i].id + " (" + blocs[i].tpe + ")";
    option.value = blocs[i].id;
    e.add(option);
    
    // et au rendu
    rendu_add_bloc(blocs[i]);
    
    if (blocs[i].id > last_id) last_id = blocs[i].id;
  }
}
function g_restaurer_info(init)
{
  if (init) g_reinit();
  i = JSON.parse(localStorage.getItem('create_exo_infos'));
  if (i)
  {
    infos = i;
    document.getElementById("cri_titre").value = infos.titre;
    document.getElementById("cri_coul").value = infos.coul;
    document.getElementById("cri_consigne").value = infos.consigne;
    document.getElementById("cri_total").value = infos.total;
    document.getElementById("cri_arrondi").value = infos.arrondi;
    document.getElementById("cri_essais").value = infos.essais;
    for (j=0; j<6; j++)
    {
      document.getElementById((j+1) + "_cri_a_min").value = infos.a[j].min;
      document.getElementById((j+1) + "_cri_a_coul").value = infos.a[j].coul;
      document.getElementById((j+1) + "_cri_a_re").value = infos.a[j].re;
      document.getElementById((j+1) + "_cri_a_txt").value = infos.a[j].txt;
    }
  }
}

function g_reinit()
{
  //on nettoie
  var e = document.getElementById("cr_selection");
  while(e.length>0)
  {
    e.remove(0);
  }
  rendu_ini();
  blocs = [];
  last_id = 0;
  infos = {};
  infos.a = [{}, {}, {}, {}, {}, {}];
}

function bloc_new(tpe, txt)
{
  bloc = {};
  last_id++;
  bloc.id = last_id;
  bloc.tpe = tpe;
  bloc.txt = txt;
  bloc_ini(bloc);
  switch (tpe)
  {
    case "radio":
      radio_ini(bloc)
      radio_create_html(bloc, txt);
    case "radiobtn":
      radiobtn_ini(bloc)
      radio_create_html(bloc, txt);
    case "check":
      check_ini(bloc)
      radio_create_html(bloc, txt);
      break;
    case "texte":
      texte_ini(bloc);
      texte_create_html(bloc, txt);
      break;
    case "combo":
      combo_ini(bloc);
      combo_create_html(bloc, txt);
      break;
    case "multi":
      multi_ini(bloc);
      multi_create_html(bloc, txt);
      break;
    case "image":
      image_ini(bloc);
      image_create_html(bloc, txt);
      break;
  }
  blocs.push(bloc);
  // on ajoute une entrée à la liste de sélection
  var e = document.getElementById("cr_selection");
  var option = document.createElement("option");
  option.text = last_id + " (" + tpe + ")";
  option.value = last_id
  e.add(option);
  // on ajoute le bloc pour le rendu
  rendu_add_bloc(bloc);
}
// on initialise les valeurs d'options comme il faut
function bloc_ini(bloc)
{
  //polices
  bloc.font_fam = "sans-serif";
  bloc.font_size = "20";
  bloc.font_coul = "#000000";
  bloc.font_g = "false";
  bloc.font_i = "false";
  bloc.font_s = "false";
  bloc.font_b = "false";
  //taille-position
  bloc.left = "5";
  bloc.top = "300";
  bloc.width = "0";
  bloc.height = "0";
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
}

function bloc_mousedown(e)
{
  // on récupère le bloc correspondant
  bloc = bloc_get_from_id(e.id.substr(9));
  
  // si pas ctrl, alors on sélectionne
  document.getElementById("cr_selection").value = bloc.id;
  cr_selection_change();
}

function bloc_get_from_id(id)
{
  for (i=0; i<blocs.length; i++)
  {
    if (blocs[i].id == id) return blocs[i];
  }
}

//on initialise la zone de rendu (uniquement le prénom)
function rendu_ini()
{
  htm = "<span id=\"user\">Prénom : Joséphine</span>\n";
  document.getElementById("cr_rendu").innerHTML = htm;
}

// on ajoute un bloc à la zone de rendu
function rendu_add_bloc(bloc)
{
  // on crée le bloc
  htm = "<div class=\"cr_rendu_bloc ";
  if (bloc.tpe == "image") htm += "mv_rs\" ";
  else htm += "mv\" ";
  htm += "id=\"cr_rendu_" + bloc.id + "\" onmousedown=\"bloc_mousedown(this)\">\n";
  htm += bloc.html;
  htm += "\n</div>\n";
  
  //on l'ajoute
  document.getElementById("cr_rendu").innerHTML += htm;
  
  //on modifie les styles
  b = document.getElementById("cr_rendu_" + bloc.id);
  e = document.getElementById(bloc.id);
  
  //police
  e.style.fontFamily = bloc.font_fam;
  e.style.fontsize = (parseInt(bloc.font_size)*0.65) + "px";
  e.style.color = bloc.font_coul;
  if (bloc.font_g == true) e.style.fontWeight = "bold";
  if (bloc.font_i == true) e.style.fontStyle = "italic";
  if (bloc.font_s == true) e.style.textDecoration = "underline";
  if (bloc.font_b == true) e.style.textDecoration = "line-through";
  //taille-position
  if (bloc.width>0)
  {
    b.style.width = bloc.width + "px";
    e.style.width = "100%";
    if (bloc.height>0)
    {
      b.style.height = bloc.height + "px";
      e.style.height = "100%";
    }
    else
    {
      // on triche un peu pour éviter les trucs bizarres (on initialise à un carré)
      b.style.height = bloc.width + "px";
    }
  }
  b.style.left = bloc.left + "px";
  b.style.top = bloc.top + "px";
  //bordures
  e.style.borderStyle = bloc.bord;
  e.style.borderWidth = bloc.bord_size + "px";
  e.style.borderColor = bloc.bord_coul;
  e.style.borderRadius = bloc.bord_rond + "px";
  //fond
  e.style.backgroundColor = hex2rgba(bloc.fond_coul, bloc.fond_alpha);
  //marges
  e.style.padding = bloc.marges + "px";
}

function rendu_select_bloc(bloc)
{
  var elems = document.getElementsByClassName('cr_rendu_bloc');
  for (i=0; i<elems.length; i++)
  {
    if (elems[i].id.substr(9) == bloc.id)
    {
      elems[i].style.border = "1px dashed red";
    }
    else
    {
      elems[i].style.border = "hidden";
    }
  }
}

function rendu_get_superbloc(bloc)
{
  return document.getElementById("cr_rendu_" + bloc.id);
}

// on met à jour le panels des options, ...
function selection_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
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
  document.getElementById("cr_tp_w").disabled = true;
  document.getElementById("cr_tp_h").disabled = true;
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
  document.getElementById("cr_html").value = bloc.html;
  
  // on masque toutes les options
  var elems = document.getElementsByClassName('cr_coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('cr_texte_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("cr_txt_ini").value = bloc.txt;
  document.getElementById("cr_txt_ini_div").style.display = "none";
  document.getElementById("cr_img_get").style.display = "none";
  
  // on fait les réglages spécifiques
  switch (bloc.tpe)
  {
    case "radio":
      radio_sel_update();
      break;
    case "radiobtn":
      radiobtn_sel_update();
      break;
    case "check":
      check_sel_update();
      break;
    case "texte":
      texte_sel_update();
      break;
    case "combo":
      combo_sel_update();
      break;
    case "multi":
      multi_sel_update();
      break;
    case "image":
      image_sel_update();
      break;
  }
}

function check_new()
{
  //on demande le texte initial
  txt = prompt("cases à cocher\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |*des mamifères$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc_new("check", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
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

function radiobtn_new()
{
  //on demande le texte initial
  txt = prompt("boutons choix\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |$des plantes$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc_new("radiobtn", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
}
function radiobtn_ini(bloc)
{
  bloc.radiobtn_coul1 = "#D1CFCF";
  bloc.radiobtn_coul2 = "#888888";
}
function radiobtn_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>boutons choix</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $<br/>(Les chats sont |$des plantes$des oiseaux*des félins|)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
  var elems = document.getElementsByClassName('cr_coul');
  elems[1].style.display = "block";
  elems[2].style.display = "block";
  document.getElementById("cr_coul1").jscolor.fromString(bloc.radiobtn_coul1);
  document.getElementById("cr_coul2").jscolor.fromString(bloc.radiobtn_coul2);
}

function radio_new()
{
  //on demande le texte initial
  txt = prompt("choix uniques\n\nEncadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $\n(Les chats sont |$des plantes$des oiseaux*des félins|)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc_new("radio", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
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
  htm += "<div class=\"item lignef " + cl + "\" tpe=\"" + bloc.tpe + "\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" ";
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
    for (var k=0; k<v.length; k++)
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
  bloc_new("combo", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
}
function combo_create_html(bloc, txt)
{
  htm = "";
  htm += "<div class=\"item lignef combo\" tpe=\"combo\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\">\n";
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
    for (var k=0; k<v.length; k++)
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
  bloc_new("texte", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
}
function texte_create_html(bloc, txt)
{
  // on récupère les infos de la zone de texte
  l = bloc.texte_l;
  h = bloc.texte_h;
  enter = bloc.texte_e;
  comp = bloc.texte_c;
  
  htm = "";
  htm += "<div class=\"item lignef texte\" tpe=\"texte\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" options=\"";
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
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>zone de texte</b><br/>Encadrer le texte juste par '|' ('#' = tout est juste)<br/>(La souris|a|peur du chat)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
  
  document.getElementById("cr_texte_l").value = bloc.texte_l;
  document.getElementById("cr_texte_h").value = bloc.texte_h;
  document.getElementById("cr_texte_e").value = bloc.texte_e;
  document.getElementById("cr_texte_c").value = bloc.texte_c;
  document.getElementById("cr_texte_div").style.display = "block";
}

function multi_new()
{
  //on demande le texte initial
  txt = prompt("blocs multi-positions\n\nEncadrer les blocs par '|' ; Le blocs à colorer commencent par le numéro de la couleur\n(1Le chat|2mange|les souris.)", "");
  if (!txt) return;
  
  //on crée le nouveau bloc
  bloc_new("multi", txt);
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
}
function multi_create_html(bloc, txt)
{
  htm = "";
  htm += "<div class=\"item ligne2f multi\" tpe=\"multi\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\"";
  opts = "";
  for (i=0; i<bloc.multi_coul.length; i++)
  {
    if (i>0) opts += "|";
    opts += hex2rgb(bloc.multi_coul[i]);
  }
  htm += "options=\"" + opts + "\">\n";
  //on coupe suivant '|'
  var vals = txt.split("|");
  htm2 = "";
  for (i=0; i<vals.length; i++)
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
}
function multi_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>blocs multi-positions</b><br/>Encadrer les blocs par '|' ; Le blocs à colorer commencent par le numéro de la couleur<br/>(1Le chat|2mange|les souris.)";
  document.getElementById("cr_txt_ini_div").style.display = "inline";
  
  document.getElementById("cr_coul_nb").value = bloc.multi_coul.length;
  for (i=0; i<bloc.multi_coul.length; i++)
  {
    tx = "cr_coul" + (i+1);
    document.getElementById(tx).jscolor.fromString(bloc.multi_coul[i]);
  }
  document.getElementById("cr_coul_nb").style.display = "block";
  cr_coul_nb_change(document.getElementById("cr_coul_nb"), false);
}

function image_new()
{
  //on crée le nouveau bloc
  bloc_new("image", "");
  
  //on le sélectionne
  selection = [blocs.length-1];
  document.getElementById("cr_selection").value = last_id;
  cr_selection_change();
}
function image_create_html(bloc, txt)
{
  htm = "";
  htm += "<img class=\"image\" tpe=\"image\" item=\"" + bloc.id + "\" id=\"" + bloc.id + "\" src=\"";
  htm += "<?php echo $exos[$exo]; ?>/img_" + bloc.id + "." + bloc.img_ext;
  htm += "\" id=\"" + bloc.id + "\" />";
  bloc.html = htm;
}
function image_ini(bloc)
{
  // rien à faire
  bloc.img = null;
  bloc.img_ext = "";
  bloc.width = "50";
}
function image_sel_update()
{
  // on récupère le bloc sélectionné
  if (selection.length != 1) return;
  bloc = selection[0];
  
  document.getElementById("cr_expl").innerHTML = "<b>image</b><br/>Sélectionner l'image choisie.<br/>Attention, les images sont \"perdues\" lors de la fermeture de la page (elles devront être rechargées) !";
  document.getElementById("cr_img_get").style.display = "inline";
  
  document.getElementById("cr_tp_w").value = bloc.width;
  document.getElementById("cr_tp_w").disabled = false;
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
  inter.on('resizemove', function (event) {
    var target = event.target;
    bloc = bloc_get_from_id(target.id.substr(9));

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';
    document.getElementById("cr_tp_w").value = event.rect.width;
    document.getElementById("cr_tp_h").value = event.rect.height;
    bloc.width = event.rect.width;
    bloc.height = event.rect.height;

    // translate when resizing from top or left edges
    bloc.left += event.deltaRect.left;
    bloc.top += event.deltaRect.top;
    target.style.left = bloc.left + "px";
    target.style.top = bloc.top + "px";
  });
  
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
}

function _dragMoveListener (event)
{
  for (i=0; i<selection.length; i++)
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
  }
}
function _drag_rs_end(event)
{
  g_sauver();
}
