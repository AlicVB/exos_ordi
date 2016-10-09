tpe = "radio";
id = 0;
var imgs = new Array();
var imgs_ext = new Array();

function apply()
{
  tx = "<span id=\"user\">Prénom : Joséphine</span>\n";
  tx += document.getElementById('html').value;
  document.getElementById('c').innerHTML = tx;
  
  //et on s'occupe des images
  sel = "[item][tpe=\"image\"]";
  var elems = document.querySelectorAll(sel);
  for (i=0; i<elems.length; i++)
  {
    //on récupère la source
    src = elems[i].src.split("/").pop()
    if (src.length > 4)
    {
      src_nb = parseInt(src.substr(4));
      if (src_nb < imgs.length)
      {
        elems[i].src = URL.createObjectURL(imgs[src_nb]);
      }
    }
  }
}
function change(e)
{
}
var loadImg = function(event) {
    imgs_ext.push(event.target.files[0].name.split(".").pop());
    imgs.push(event.target.files[0]);
    create_div();
  };
  
function redim()
{
  e = document.getElementById("html");
  ht = window.innerHeight;
  e.style.height = (ht - e.offsetTop - 15) + "px";
}

function hex2rgb(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function sauvegarder()
{
  // on commence le décodage
  var txt = document.getElementById("html").value;
  
  var zip = new JSZip();
  zip.file("exo.php", txt);
  for (i=0; i<imgs.length; i++)
  {
    zip.file("img_" + i + "." + imgs_ext[i], imgs[i]);
  }

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      // see FileSaver.js
      saveAs(content, "exo.zip");
  });
}

function create_div()
{
  tx = document.getElementById("html").value;
  //on cherche un id libre
  while (tx.search("item=\""+id+"\"") >=0)
  {
    id++;
  }
  txt = "";
  switch (tpe)
  {
    case "radio":
    case "radiobtn":
    case "check":
      txt = radio_txt();
      break;
    case "texte":
      txt = texte_txt();
      break;
    case "combo":
      txt = combo_txt();
      break;
    case "multi":
      txt = multi_txt();
      break;
    case "image":
      txt = image_txt();
      break;
  }
  
  document.getElementById("html").value += "\n" + txt;
  apply();
  id++;
}

function coulchange()
{
  var elems = document.getElementsByClassName('coul');
  nb = document.getElementById("nb_pos").value;
  for (i=1; i<elems.length; i++)
  {
    if (i>nb) elems[i].style.display = 'none';
    else elems[i].style.display = 'inline-block';
  }
}

function radio_new()
{
  tpe = "radio";
  //on cache tous les éléments multipos
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>radio</b><br/>Encadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $ (Les chats sont |*des mamifères$des oiseaux*des félins|)";
}
function radiobtn_new()
{
  tpe = "radiobtn";
  //on cache tous les éléments multipos sauf 2 couleurs
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    if (i ==0 || i>2) elems[i].style.display = 'none';
    else elems[i].style.display = 'inline-block';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>radio boutons</b><br/>Encadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $ (Les chats sont |*des mamifères$des oiseaux*des félins|)";
}
function check_new()
{
  tpe = "check";
  //on cache tous les éléments multipos
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>cases à cocher</b><br/>Encadrer les choix par '|' ; Le texte à cocher commence par * Les autres par $ (Les chats sont |*des mamifères$des oiseaux*des félins|)";
}
function combo_new()
{
  tpe = "combo";
  //on cache tous les éléments multipos
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>liste déroulante</b><br/>Encadrer les choix par '|' ; Le texte juste commence par * Les autres par $ (Les chats sont |*des mamifères$des oiseaux*des félins|)";
}
function multi_new()
{
  tpe = "multi";
  //on affiche les éléments multipos
  var elems = document.getElementsByClassName('coul');
  elems[0].style.display = 'inline-block';
  coulchange();
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>blocs multi-positions</b><br/>Encadrer les blocs par '|' ; Le blocs à colorer commencent par le numéro de la couleur (1Le chat|2mange|les souris.)";
}
function texte_new()
{
  tpe = "texte";
  //on cache tous les éléments multipos
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'inline-block';
  }
  document.getElementById("etxt").style.display = "inline-block";
  document.getElementById("exo_img_get").style.display = "none";
  redim();
  //on reset le texte
  document.getElementById("etxt").value = "";
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>zone de texte</b><br/>Encadrer le texte juste par '|' ('#' = tout est juste) (La souris|a|peur du chat)";
}
function image_new()
{
  tpe = "image";
  //on cache tous les éléments multipos
  var elems = document.getElementsByClassName('coul');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  elems = document.getElementsByClassName('exo_tx_div');
  for (i=0; i<elems.length; i++)
  {
    elems[i].style.display = 'none';
  }
  document.getElementById("etxt").style.display = "none";
  document.getElementById("exo_img_get").style.display = "inline-block";
  redim();
  // on met les détails comme il faut
  document.getElementById("eexpl").innerHTML = "<b>image</b><br/>Ajouter une image de type jpg, png, svg, ...";
}

function radio_txt()
{
  // ça marche aussi pour les radiobtn et les check
  tp = "radio";
  cl = tpe;
  if (tpe == "check")
  {
    tp = "checkbox";
    cl = "radio";
  }

  htm = "";
  if (tpe == "radiobtn")
  {
    htm += "<style>#rb" + id + " label {background-color: " + document.getElementById("exo_coul1").value;
    htm += ";} #rb" + id + " input[type=\"radio\"]:checked + label {background-color: " + document.getElementById("exo_coul2").value + ";}</style>\n";
  }
  htm += "<div class=\"item ligne " + cl + "\" tpe=\"" + tpe + "\" item=\"" + id + "\" id=\"rb" + id + "\" ";
  if (tpe == "radiobtn") htm += "options=\"" + hex2rgb(document.getElementById("exo_coul1").value) + "|" + hex2rgb(document.getElementById("exo_coul2").value) + "\" ";
  htm += ">\n";
  //on coupe suivant '|'
  var vals = document.getElementById("etxt").value.split("|");
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
        htm += "    <input type=\"" + tp + "\" itemid=\"" + id + "\" class=\"exo\" onclick=\"change(this)\" value=\"1\" id=\"rb" + id + "_" + item + "\" ";
        if (tp == "radio") htm += "name=\"" + id + "\"";
        htm += ">\n";
        htm += "    <label for=\"rb" + id + "_" + item + "\">" + v[k].substr(1) + "</label>\n";
      }
      else if (v[k].startsWith("$"))
      {
        if (k>1) htm += "   <br/>\n";
        htm += "    <input type=\"" + tp + "\" itemid=\"" + id + "\" class=\"exo\" onclick=\"change(this)\" value=\"0\" id=\"rb" + id + "_" + item + "\" ";
        if (tp == "radio") htm += "name=\"" + id + "\"";
        htm += ">\n";
        htm += "    <label for=\"rb" + id + "_" + item + "\">" + v[k].substr(1) + "</label>\n";
      }
      item++;
    }
    htm += "  </form>\n";
  }
  if (vals.length>2) htm += "  <div>" + vals[2] + "</div>\n";
  htm += "</div>\n";
  
  return htm;
}

function combo_txt()
{
  htm = "";
  htm += "<div class=\"item ligne combo\" tpe=\"combo\" item=\"" + id + "\">\n";
  //on coupe suivant '|'
  var vals = document.getElementById("etxt").value.split("|");
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  if (vals.length>1)
  {
    // le choix
    htm += "  <div>\n";
    htm += "    <select itemid=\"" + id + "\" class=\"exo\" onchange=\"change(this)\">\n";
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
  
  return htm;
}

function texte_txt()
{
  // on récupère les infos de la zone de texte
  l = document.getElementById("exo_txl").value;
  h = document.getElementById("exo_txh").value;
  enter = document.getElementById("exo_txe").value;
  comp = document.getElementById("exo_txc").value;
  
  htm = "";
  htm += "<div class=\"item ligne texte\" tpe=\"texte\" item=\"" + id + "\" options=\"";
  htm += comp + "|" + enter + "\" >\n";
  //on coupe suivant '|'
  var vals = document.getElementById("etxt").value.split("|");
  
  if (l == 0) htm += "  <div style=\"width: 100%;\">\n"
  if (vals.length>0) htm += "  <div>" + vals[0] + "</div>\n";
  if (vals.length>1)
  {
    htm += "  <div>\n";
    if (h > 1) htm += "   <textarea rows=\"" + h + "\" ";
    else htm += "   <input type=\"text\" ";
    htm += "class=\"exo\" itemid=\"" + id + "\" onKeyUp=\"change(this)\" ";
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
  
  return htm;
}

function multi_txt()
{
  htm = "";
  htm += "<div class=\"item ligne2 multi\" tpe=\"multi\" item=\"" + id + "\" ";
  opts = "";
  for (i=0; i<parseInt(document.getElementById("nb_pos").value); i++)
  {
    if (i>0) opts += "|";
    tx = "exo_coul" + (i+1);
    opts += hex2rgb(document.getElementById(tx).value);
  }
  htm += "options=\"" + opts + "\">\n";
  //on coupe suivant '|'
  var vals = document.getElementById("etxt").value.split("|");
  htm2 = "";
  for (i=0; i<vals.length; i++)
  {
    if (vals[i].length>0)
    {
      tx = vals[i];
      htm += "  <span class=\"exo\" itemid=\"" + id + "\" onclick=\"change(this)\" ";
      htm2 += "    <span ";
      if (parseInt(tx.substr(0,1)) < 6)
      {
        htm += "juste=\"" + parseInt(tx.substr(0,1)) + "\" ";
        htm2 += "style=\"background-color: " + document.getElementById("exo_coul" + parseInt(tx.substr(0,1))).value + ";\" ";
        tx = tx.substr(1);
      }
      htm += ">" + tx + "</span>\n";
      htm2 += ">" + tx + "</span>\n";
    }
  }
  htm += "  <img class=\"multi_cim\" />\n";
  htm += "  <br/>\n";
  htm += "  <span class=\"multi_corr\" itemid=\"" + id + "\">\n";
  htm += htm2;
  htm += "  </span>\n";
  htm += "</div>\n";
  
  return htm;
}

function image_txt()
{
  nb = imgs.length - 1;
  if (nb<0) return "";
  htm = "<img tpe=\"image\" item=\"" + id + "\" src=\"<?php echo $exos[$exo]; ?>/img_" + nb + "." + imgs_ext[nb] + "\" style=\"width:10%;\" />";
  return htm;
}
