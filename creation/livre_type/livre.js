function affiche_aide(val)
{
  e = document.getElementById("aide");
  if (val) e.style.visibility = "visible";
  else e.style.visibility = "hidden";
}

function intro_img_load(e)
{
  //Attention, il faut regarder si elle doit être affichée en permanence ou non !
  let ic = document.getElementById("aideimg");
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
      e.style.width = w_max*0.8 + "px";
      e.style.left = (rec1.left + w_max*0.1) + "px";
      e.style.height = w_max*0.8*reci.height/reci.width + "px";
      e.style.top = (rec1.bottom + (h_max - parseFloat(e.style.height))/2) + "px"
    }
    else
    {
      e.style.height = h_max*0.8 + "px";
      e.style.top = (rec1.bottom + h_max*0.1) + "px";
      e.style.width = h_max*0.8*reci.width/reci.height + "px";
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
  c = document.body.style.backgroundColor;
  var rgb = c.match(/\d+/g);
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
  copy_set_style();

  charge(_user, _livreid, _exoid, txt_exo, _root);
}
