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
    e.style.removeAttribute("width");
    e.style.height = "55vh";
  }
  else e.style.width = "55vh";
}
