function cr_tab_click(e)
{
  //si déjà sélectionné, on sort
  if (e.style.backgroundColor == "#6D7BCF") return;
  
  //on s'occuppe des boutons
  if (e.id == "cr_tab_info") f = document.getElementById("cr_tab_create");
  else f = document.getElementById("cr_tab_info");
  
  e.style.backgroundColor = "#6D7BCF";
  e.style.borderWidth = "2px"
  
  f.style.backgroundColor = "transparent";
  f.style.borderWidth = "1px"
  
  //et on cache/masque les panneaux
  if (e.id == "cr_tab_info")
  {
    document.getElementById("cr_pa_create").style.display = "none";
    document.getElementById("cr_pa_info").style.display = "block";
  }
  else
  {
    document.getElementById("cr_pa_info").style.display = "none";
    document.getElementById("cr_pa_create").style.display = "block";
  }
}

function cr_coul_nb_change(e, modif)
{
  var elems = document.getElementsByClassName('cr_coul');
  nb = e.value;
  elems[0].style.display = 'block';
  for (i=1; i<elems.length; i++)
  {
    if (i>nb) elems[i].style.display = 'none';
    else elems[i].style.display = 'block';
  }
  
  //on met à jour le bloc si besoin
  if (modif)
  {
    cr_coul_change(null);
  }
}

function cr_img_get_change(event)
{
  ext = event.target.files[0].name.split(".").pop();
  
  // on récupère le bloc sélectionné
  if (selection.length < 1) return;
  bloc = selection[0];
  if (bloc.tpe != "image") return;
  
  // on met à jour les valeurs
  bloc.img_ext = ext;
  bloc.img = event.target.files[0];
  
  // on modifie le code html en conséquence
  image_create_html(bloc, "");
  document.getElementById("cr_html").value = bloc.html;
  
  // quand l'image aura été chargée, on mettra à jour la taille du cadre autour
  document.getElementById(bloc.id).onload = function () {
        rendu_get_superbloc(bloc).style.height = document.getElementById(bloc.id).getBoundingClientRect().height + "px";        
    };
  // on met à jour le rendu
  document.getElementById(bloc.id).src = URL.createObjectURL(bloc.img);
  //on sauvegarde
  g_sauver();
}

function cr_new_txt_click(e)
{
  // on récupère le bloc sélectionné
  if (selection.length < 1) return;
  bloc = selection[0];
  bloc.txt = document.getElementById("cr_txt_ini").value;
  
  // on modifie le code html
  bloc_create_html(bloc);
  document.getElementById("cr_html").value = bloc.html;
  
  // et on modifie le rendu itou
  rendu_get_superbloc(bloc).innerHTML = bloc.html;
  //on sauvegarde
  g_sauver(); 
}

function cr_coul_change(e)
{
  for (i=0; i<selection.length; i++)
  {
    bloc = selection[i];
    switch (bloc.tpe)
    {
      case "radiobtn":
        // on change les options et le rendu
        bloc.radiobtn_coul1 = "#" + document.getElementById("cr_coul1").jscolor;
        bloc.radiobtn_coul2 = "#" + document.getElementById("cr_coul2").jscolor;
        break;
      case "multi":
        // on change juste les options
        bloc.multi_coul = new Array();
        for (i=0; i<document.getElementById("cr_coul_nb").value; i++)
        {
          bloc.multi_coul.push("#" + document.getElementById("cr_coul" + (i+1)).jscolor);
        }
        break;
      default:
        continue;
    }
    //on change le rendu
    bloc_create_html(bloc);
    document.getElementById("cr_html").value = bloc.html;
    rendu_get_superbloc(bloc).innerHTML = bloc.html;
  }
  //on sauvegarde
  g_sauver();
}

function cr_texte_change(e)
{
  for (i=0; i<selection.length; i++)
  {
    bloc = selection[i];
    if (bloc.tpe != "texte") continue;
    bloc.texte_l = document.getElementById("cr_texte_l").value;
    bloc.texte_h = document.getElementById("cr_texte_h").value;
    bloc.texte_e = document.getElementById("cr_texte_e").value;
    bloc.texte_c = document.getElementById("cr_texte_c").value;
    
    texte_create_html(bloc, document.getElementById("cr_txt_ini").value);
    document.getElementById("cr_html").value = bloc.html;
    
    rendu_get_superbloc(bloc).innerHTML = bloc.html; 
  }
  //on sauvegarde
  g_sauver();
}

function cr_font_fam_change(e)
{
  f = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_fam = f;
    document.getElementById(selection[i].id).style.fontFamily = f;
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_size_change(e)
{
  s1 = e.value;
  s2 = s1*0.65;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_size = s1;
    document.getElementById(selection[i].id).style.fontSize = s2 + "px";
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_coul_change(jscolor)
{
  v = "#" + jscolor;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_coul = v;
    document.getElementById(selection[i].id).style.color = v;
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_g_change(e)
{
  v = e.checked;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_g = v;
    if (v) document.getElementById(selection[i].id).style.fontWeight = "bold";
    else document.getElementById(selection[i].id).style.fontWeight = "normal";
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_i_change(e)
{
  v = e.checked;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_i = v;
    if (v) document.getElementById(selection[i].id).style.fontStyle = "italic";
    else document.getElementById(selection[i].id).style.fontStyle = "normal";
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_s_change(e)
{
  v = e.checked;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_s = v;
    if (v) document.getElementById(selection[i].id).style.textDecoration = "underline";
    else document.getElementById(selection[i].id).style.textDecoration = "none";
  }
  //on sauvegarde
  g_sauver();
}
function cr_font_b_change(e)
{
  v = e.checked;
  for (i=0; i<selection.length; i++)
  {
    selection[i].font_b = v;
    if (v) document.getElementById(selection[i].id).style.textDecoration = "line-through";
    else document.getElementById(selection[i].id).style.textDecoration = "none";
  }
  //on sauvegarde
  g_sauver();
}

function cr_tp_w_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].width = v;
    document.getElementById(selection[i].id).style.width = v + "px";
  }
  //on sauvegarde
  g_sauver();
}
function cr_tp_h_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].height = v;
    document.getElementById(selection[i].id).style.height = v + "px";
  }
  //on sauvegarde
  g_sauver();
}
function cr_tp_t_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].top = v;
    rendu_get_superbloc(selection[i]).style.top = v + "px";
  }
  //on sauvegarde
  g_sauver();
}
function cr_tp_l_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].left = v;
    rendu_get_superbloc(selection[i]).style.left = v + "px";
  }
  //on sauvegarde
  g_sauver();
}

function cr_bord_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].bord = v;
    document.getElementById(selection[i].id).style.borderStyle = v;
  }
  //on sauvegarde
  g_sauver();
}
function cr_bord_coul_change(jscolor)
{
  v = "#" + jscolor;
  for (i=0; i<selection.length; i++)
  {
    selection[i].bord_coul = v;
    document.getElementById(selection[i].id).style.borderColor = v;
  }
  //on sauvegarde
  g_sauver();
}
function cr_bord_size_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].bord_size = v;
    document.getElementById(selection[i].id).style.borderWidth = v + "px";
  }
  //on sauvegarde
  g_sauver();
}
function cr_bord_rond_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].bord_rond = v;
    document.getElementById(selection[i].id).style.borderRadius = v + "px";
  }
  //on sauvegarde
  g_sauver();
}

function cr_fond_coul_change(jscolor)
{
  v = "#" + jscolor;
  for (i=0; i<selection.length; i++)
  {
    selection[i].fond_coul = v;
    document.getElementById(selection[i].id).style.backgroundColor = hex2rgba(v, selection[i].fond_alpha);
  }
  //on sauvegarde
  g_sauver();
}
function cr_fond_alpha_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].fond_alpha = v;
    document.getElementById(selection[i].id).style.backgroundColor = hex2rgba(selection[i].fond_coul, v);
  }
  //on sauvegarde
  g_sauver();
}

function cr_marges_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].marges = v;
    document.getElementById(selection[i].id).style.padding = v + "px";
  }
  //on sauvegarde
  g_sauver();
}

function cr_inter_change(e)
{
  for (i=0; i<selection.length; i++)
  {
    if (e.checked && e.id == "cr_inter_0")
    {
      selection[i].inter = "0";
      selection[i].relie_id = "";
      selection[i].relie_cible_de = "";
    }
    else if (e.checked && e.id == "cr_inter_2")
    {
      selection[i].inter = "2";
      selection[i].relie_id = "";
      selection[i].relie_cible_de = "";
    }
    else if (e.checked && e.id == "cr_inter_1")
    {
      selection[i].inter = "1";
      selection[i].relie_cible_de = "";
    }
    bloc_create_html(selection[i]);
  }
  //on sauvegarde
  g_sauver();
}

function cr_relie_id_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    bloc = selection[i];
    bloc.relie_id = v;
    bloc.relie_cible_de = "";
    bloc_create_html(bloc);
    //on change aussi la cible
    b2 = bloc_get_from_id(v);
    if (b2)
    {
      b2.inter = "1";
      b2.relie_id = "";
      b2.relie_cible_de = bloc.id;
      bloc_create_html(b2);
    }
  }
  //on sauvegarde
  g_sauver();
}

function cr_points_change(e)
{
  v = e.value;
  for (i=0; i<selection.length; i++)
  {
    selection[i].points = v;
    bloc_create_html(selection[i]);
  }
  //on sauvegarde
  g_sauver();
}

function cr_aligne_change(e)
{
  
  l = parseFloat(selection[0].left);
  ch = l + parseFloat(selection[0].width)/2;
  t = parseFloat(selection[0].top);
  cv = t + parseFloat(selection[0].height)/2;
  switch (e.value)
  {
    case "1": //gauche
      for (i=1; i<selection.length; i++)
      {
        selection[i].left = l;
        rendu_get_superbloc(selection[i]).style.left = l + "px";
        document.getElementById("cr_tp_l").value = l;
      }
      break;
    case "2": //centre h
      for (i=1; i<selection.length; i++)
      {
        selection[i].left = ch - parseFloat(selection[i].width)/2;
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "3": //droite
      for (i=1; i<selection.length; i++)
      {
        selection[i].left = l + parseFloat(selection[0].width) - parseFloat(selection[i].width);
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "4": //haut
      for (i=1; i<selection.length; i++)
      {
        selection[i].top = t;
        rendu_get_superbloc(selection[i]).style.top = t + "px";
        document.getElementById("cr_tp_t").value = t;
      }
      break;
    case "5": //centre v
      for (i=1; i<selection.length; i++)
      {
        selection[i].top = cv - parseFloat(selection[i].height)/2;
        rendu_get_superbloc(selection[i]).style.top = selection[i].top + "px";
        document.getElementById("cr_tp_t").value = selection[i].top;
      }
      break;
    case "6": //bas
      for (i=1; i<selection.length; i++)
      {
        selection[i].top = t + parseFloat(selection[0].height) - parseFloat(selection[i].height);
        rendu_get_superbloc(selection[i]).style.top = selection[i].top + "px";
        document.getElementById("cr_tp_t").value = selection[i].top;
      }
      break;
  }
  if (e.value >= 0) g_sauver();
  e.selectedIndex = 0;
}
function _repart_compare_h(a, b)
{
  return (a.left - b.left);
}
function _repart_compare_v(a, b)
{
  return (a.top - b.top);
}
function cr_repart_change(e)
{
  if (e.value == "1")
  {
    //on reordonne la selection en fonction de left
    news = selection.sort(_repart_compare_h);
    //on calcule l'espace moyen entre les blocs
    espaces = 0;
    for (i=0; i<news.length-1; i++)
    {
      espaces += parseFloat(news[i+1].left) - (parseFloat(news[i].left) + parseFloat(news[i].width));
    }
    espace = espaces/(news.length-1);
    for (i=1; i<news.length-1; i++)
    {
      news[i].left = parseFloat(news[i-1].left) + parseFloat(news[i-1].width) + espace;
      rendu_get_superbloc(news[i]).style.left = news[i].left + "px";
      document.getElementById("cr_tp_l").value = news[i].left;
    }
  }
  if (e.value == "2")
  {
    //on reordonne la selection en fonction de left
    news = selection.sort(_repart_compare_v);
    //on calcule l'espace moyen entre les blocs
    espaces = 0;
    for (i=0; i<news.length-1; i++)
    {
      espaces += parseFloat(news[i+1].top) - (parseFloat(news[i].top) + parseFloat(news[i].height));
    }
    espace = espaces/(news.length-1);
    for (i=1; i<news.length-1; i++)
    {
      news[i].top = parseFloat(news[i-1].top) + parseFloat(news[i-1].height) + espace;
      rendu_get_superbloc(news[i]).style.top = news[i].top + "px";
      document.getElementById("cr_tp_t").value = news[i].top;
    }
  }
  if (e.value >= 0) g_sauver();
  e.selectedIndex = 0;
}
function cr_plan_change(e)
{
  
  e.selectedIndex = 0;
}

function cri_titre_change(e)
{
  infos.titre = e.value;
  g_sauver_info();
}
function cri_coul_change(e)
{
  infos.coul = e.value;
  g_sauver_info();
}
function cri_consigne_change(e)
{
  infos.consigne = e.value;
  g_sauver_info();
}
function cri_total_change(e)
{
  infos.total = e.value;
  g_sauver_info();
}
function cri_arrondi_change(e)
{
  infos.arrondi = e.value;
  g_sauver_info();
}
function cri_essais_change(e)
{
  infos.essais = e.value;
  g_sauver_info();
}

function cri_a_min_change(e)
{
  nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].min = e.value;
  g_sauver_info();
}
function cri_a_coul_change(e)
{
  nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].coul = e.value;
  g_sauver_info();
}
function cri_a_re_change(e)
{
  nb = parseInt(e.id.substr(0,1));
  if (e.checked) infos.a[nb-1].re = "1";
  else infos.a[nb-1].re = "0";
  g_sauver_info();
}
function cri_a_txt_change(e)
{
  nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].txt = e.value;
  g_sauver_info();
}
