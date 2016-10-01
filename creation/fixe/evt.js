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

function cr_selection_change()
{
  selid = document.getElementById("cr_selection").value;
  bloc = null;
  for (i=0; i<blocs.length; i++)
  {
    if (blocs[i].id == selid)
    {
      bloc = blocs[i];
      break;
    }
  }
  if (!bloc)
  {
    alert("BUG\nbloc " + selid + " introuvable");
    return;
  }
  rendu_select_bloc(bloc);
  selection = [bloc];
  selection_update();
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
  txt = document.getElementById("cr_txt_ini").value;
  
  // on modifie le code html
  switch (bloc.tpe)
  {
    case "radio":
    case "check":
    case "radiobtn":
      radio_create_html(bloc, txt);
      break;
    case "multi":
      multi_create_html(bloc, txt);
      break;
    case "combo":
      combo_create_html(bloc, txt);
      break;
    case "texte":
      texte_create_html(bloc, txt);
      break;
    default:
      return;
  }
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
        radio_create_html(bloc, document.getElementById("cr_txt_ini").value);
        break;
      case "multi":
        // on change juste les options
        bloc.multi_coul = new Array();
        for (i=0; i<document.getElementById("cr_coul_nb").value; i++)
        {
          bloc.multi_coul.push("#" + document.getElementById("cr_coul" + (i+1)).jscolor);
        }
        multi_create_html(bloc, document.getElementById("cr_txt_ini").value);
        break;
      default:
        continue;
    }
    //on change le rendu
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
