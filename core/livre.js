 /*
    --En-tête officielle pour dire que ce code est sous une licence "libre" (plus d'infos: https://fr.wikipedia.org/wiki/Licence_publique_g%C3%A9n%C3%A9rale_GNU)--
    
    Copyright (C) A.RENAUDIN  Developer

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
*/

"use strict";

function affiche_aide(val)
{
  let e = document.getElementById("aide");
  if (val) e.style.visibility = "visible";
  else e.style.visibility = "hidden";
}

function intro_img_load()
{
  //image affichée en permanence
  let e = document.getElementById("aideimg");
  let rec1 = document.getElementById("details").getBoundingClientRect();
  let rec2 = document.getElementById("basdiv").getBoundingClientRect();
  let reci = e.getBoundingClientRect();
  let w_max = rec1.width;
  let h_max = rec2.top - rec1.bottom;
  if (reci.width/reci.height > w_max/h_max)
  {
    e.style.width = w_max*0.9 + "px";
    e.style.left = (rec1.left + w_max*0.05) + "px";
    e.style.height = w_max*0.9*reci.height/reci.width + "px";
    e.style.top = (rec1.bottom + (h_max - parseFloat(e.style.height))/2) + "px"
  }
  else
  {
    e.style.height = h_max*0.9 + "px";
    e.style.top = (rec1.bottom + h_max*0.05) + "px";
    e.style.width = h_max*0.9*reci.width/reci.height + "px";
    e.style.left = (rec1.left + (w_max - parseFloat(e.style.width))/2) + "px"
  }
  e.style.visibility = "visible";
}

function aide_img_load()
{
  //Attention, il faut regarder si elle doit être affichée en permanence ou non !
  let ic = document.getElementById("aideimg");
  let e = document.getElementById("aide");
  if (ic)
  {
    //image d'aide masquée sauf au survol
    if (e.offsetHeight > e.offsetWidth)
    {
      e.style.width = "auto";
      e.style.height = "55vh";
    }
    else e.style.width = "55vh";
  }
  else
  {
    //image affichée en permanence
    let rec1 = document.getElementById("consigne").getBoundingClientRect();
    let rec2 = document.getElementById("corr").getBoundingClientRect();
    let reci = e.getBoundingClientRect();
    let w_max = rec1.width;
    let h_max = rec2.top - rec1.bottom;
    if (reci.width/reci.height > w_max/h_max)
    {
      e.style.width = w_max*0.9 + "px";
      e.style.left = (rec1.left + w_max*0.05) + "px";
      e.style.height = w_max*0.9*reci.height/reci.width + "px";
      e.style.top = (rec1.bottom + (h_max - parseFloat(e.style.height))/2) + "px"
    }
    else
    {
      e.style.height = h_max*0.9 + "px";
      e.style.top = (rec1.bottom + h_max*0.05) + "px";
      e.style.width = h_max*0.9*reci.width/reci.height + "px";
      e.style.left = (rec1.left + (w_max - parseFloat(e.style.width))/2) + "px"
    }
    e.style.visibility = "visible";
  }
}

function consigne_play()
{
  document.getElementById("consigne_audio").play();
}

function copy_set_style()
{
  //on récupère la couleur de fond et on décompose
  let c = document.getElementById("c1").style.backgroundColor;
  let rgb = c.match(/\d+/g);
  if (rgb.length>2)
  {
    if (0.213 * rgb[0] + 0.715 * rgb[1] + 0.072 * rgb[2] < 255 / 2)
    {
      document.getElementById("bysa").style.color = "white";
      document.getElementById("cc_img").src = document.getElementById("cc_img").src.slice(0, -6) + "cc_inv.svg";
    }
  }
}

function livre_ini(_user, _livreid, _exoid, txt_exo, _root)
{
  //on règle les tailles si besoin, histoire que tout passe bien
  window.addEventListener("resize", page_resize);
  page_resize(null);
  charge(_user, _livreid, _exoid, txt_exo, _root);
  copy_set_style();
}

function page_resize(e)
{
  let vw = document.documentElement.clientWidth;
  let vh = document.documentElement.clientHeight;
  if (vh > vw*685/995)
  {
    //il faut faire quelque chose ! la hauteur est trop grande par rapport à la largeur !
    let nvh = vw*685/995;
    let nvw = nvh*693/980;
    let marginw = vw*10/995/2;
    let marginh = (vh-nvh)/2 - 1;
    document.getElementById("c1").style.width = nvw + "px";
    document.getElementById("c1").style.height = nvh + "px";
    document.getElementById("c1").style.marginLeft = marginw + "px";
    document.getElementById("c1").style.marginTop = marginh + "px";
    document.getElementById("c2").style.width = nvw + "px";
    document.getElementById("c2").style.height = nvh + "px";
    document.getElementById("c2").style.marginRight = marginw + "px";
    document.getElementById("c2").style.marginTop = marginh + "px";
  }
  else
  {
    document.getElementById("c1").style.width = "69.3vh";
    document.getElementById("c1").style.height = "98vh";
    document.getElementById("c1").style.marginLeft = "0.5vw";
    document.getElementById("c1").style.marginTop = "1vh";
    document.getElementById("c2").style.width = "69.3vh";
    document.getElementById("c2").style.height = "98vh";
    document.getElementById("c2").style.marginRight = "0.5vw";
    document.getElementById("c2").style.marginTop = "1vh";
  }
  aide_img_load();
  font_resize();
}
function font_resize()
{
  //et on met les tailles de la partie de droite comme il faut
  let elems = document.getElementById("c1").querySelectorAll("[sss]");
  let rf = (parseFloat(document.getElementById("c1").offsetHeight)-10)/1000;
  let rw = (parseFloat(document.getElementById("c1").offsetWidth)-10)/443;
  for (let i=0; i<elems.length; i++)
  {
    let vv = elems[i].getAttribute("sss").split("|");
    if (vv.length > 0)  // taille police
    {
      let v = parseFloat(vv[0]);
      if (v > 0) elems[i].style.fontSize = v*rf + "px";
    }
    if (vv.length > 1)  // taille bordure
    {
      let v = parseFloat(vv[1]);
      if (v > 0)
      {
        if (elems[i].getAttribute("tpe") == "cercle" || elems[i].getAttribute("tpe") == "ligne")
        {
          elems[i].style.strokeWidth = v*rw + "px";
          if (vv.length > 3 && vv[3] == "dashed")
          {
            elems[i].style.strokeDasharray = (2 + v*rw*2) + " " + (v*rw*2);
          }
          else if (vv.length > 3 && vv[3] == "dotted")
          {
            elems[i].style.strokeDasharray = "0 " + (v*rw*1.5);
          }
        }
        else elems[i].style.borderWidth = v*rw + "px";
        
      }
    }
    if (vv.length > 2)  // taille arrondi
    {
      let v = parseFloat(vv[2]);
      if (v > 0) elems[i].style.borderRadius = v*rw + "px";
    }
  }
  document.getElementById("exotice").style.height = 40*rf + "px";
  document.getElementById("cc_img").style.height = 20*rf + "px";
}

function page_print()
{
  let w = document.getElementById("c1").style.width;
  let h = document.getElementById("c1").style.height;
  document.getElementById("c1").style.width = "148.5mm";
  document.getElementById("c1").style.height = "210mm";
  font_resize();
  window.print();
  document.getElementById("c1").style.width = w;
  document.getElementById("c1").style.height = h;
  font_resize();
}
