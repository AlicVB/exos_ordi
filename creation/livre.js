function iimg_load(e)
{
  //on veut que l'image rentre dans un carré de 300x300
  if (e.offsetWidth>e.offsetHeight) e.style.width = "300px";
  else e.style.height = "300px";
}
