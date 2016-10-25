function affiche_aide(val)
{
  e = document.getElementById("aide");
  if (val) e.style.visibility = "visible";
  else e.style.visibility = "hidden";
}

function intro_img_load(e)
{
  if (e.offsetHeight > e.offsetWidth)
  {
    e.style.width = "auto";
    e.style.height = "55vh";
  }
  else e.style.width = "55vh";
}

function consigne_play()
{
  document.getElementById("consigne_audio").play();
}

function copy_set_style()
{
  //on récupère la couleur de fond et on décompose
  c = document.body.style.backgroundColor;
  console.log(c);
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
