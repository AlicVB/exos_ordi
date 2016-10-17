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
  for (let i=1; i<elems.length; i++)
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

function cr_img_get_change(e)
{
  //on sauvegarde l'image sélectionnée
  var xhr = new XMLHttpRequest();
  var fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on récupère le bloc sélectionné
      if (selection.length < 1) return;
      bloc = selection[0];
      if (bloc.tpe != "image") return;
  
      let img_name = xhr.responseText;
      if (img_name.startsWith("*"))
      {
        alert(img_name.substr(1));
        document.getElementById("cr_img_select").value = "";
        return;
      }
      //on récupère les chemins
      rpath = "img/" + img_name;
      vpath = exo_dos + "/../../" + rpath;
      
      bloc.img_rpath = rpath;
      bloc.img_vpath = vpath;
      bloc.img_name = img_name;
      
      image_create_html(bloc, "");
      document.getElementById("cr_html").value = bloc.html;
      document.getElementById(bloc.id).onload = function () {
        //on met à jour les infos de hauteur
        var h = document.getElementById(bloc.id).getBoundingClientRect().height;
        rendu_get_superbloc(bloc).style.height = h + "px";
        bloc.height = h;
        document.getElementById("cr_tp_h").value = h;
        };
      // on met à jour le rendu
      document.getElementById(bloc.id).src = vpath;
      // et la liste des images
      var option = document.createElement("option");
      option.text = img_name;
      option.value = img_name;
      document.getElementById("cr_img_select").add(option);
      document.getElementById("cr_img_select").value = img_name;
      //on sauvegarde
      g_sauver();
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveimg&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_img_select_change(e)
{
  var v = document.getElementById("cr_img_select").value;
  if (!v) return;
  if (v == "****")
  {
    document.getElementById("cr_img_get").click();
  }
  else
  {
    if (selection.length < 1) return;
    bloc = selection[0];
    if (bloc.tpe != "image") return;
    //on récupère les chemins
    rpath = "img/" + v;
    vpath = exo_dos + "/../../" + rpath;
    
    bloc.img_rpath = rpath;
    bloc.img_vpath = vpath;
    bloc.img_name = v;
    
    image_create_html(bloc, "");
    document.getElementById("cr_html").value = bloc.html;
    document.getElementById(bloc.id).onload = function () {
      rendu_get_superbloc(bloc).style.height = document.getElementById(bloc.id).getBoundingClientRect().height + "px";        
      };
    // on met à jour le rendu
    document.getElementById(bloc.id).src = vpath;
    g_sauver();
  }
}

function cr_audio_get_change(e)
{
  //on sauvegarde l'image sélectionnée
  var xhr = new XMLHttpRequest();
  var fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on récupère le bloc sélectionné
      if (selection.length < 1) return;
      bloc = selection[0];
      if (bloc.tpe != "audio") return;
  
      let audio_name = xhr.responseText;
      if (audio_name.startsWith("*"))
      {
        alert(audio_name.substr(1));
        document.getElementById("cr_audio_select").value = "";
        return;
      }
      //on récupère les chemins
      bloc.audio_name = "sons/" + audio_name;
      
      audio_create_html(bloc, "");
      document.getElementById("cr_html").value = bloc.html;
      // et la liste des images
      var option = document.createElement("option");
      option.text = audio_name;
      option.value = audio_name;
      document.getElementById("cr_audio_select").add(option);
      document.getElementById("cr_audio_select").value = audio_name;
      //on sauvegarde
      g_sauver();
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveaudio&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_audio_select_change(e)
{
  var v = document.getElementById("cr_audio_select").value;
  if (!v) return;
  if (v == "****")
  {
    document.getElementById("cr_audio_get").click();
  }
  else
  {
    if (selection.length < 1) return;
    bloc = selection[0];
    if (bloc.tpe != "audio") return;
    //on récupère les chemins
    bloc.audio_name = "sons/" + v;
    
    audio_create_html(bloc, "");
    document.getElementById("cr_html").value = bloc.html;
    g_sauver();
  }
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
  for (let i=0; i<selection.length; i++)
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
        for (let i=0; i<document.getElementById("cr_coul_nb").value; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
  {
    selection[i].fond_coul = v;
    if (selection[i].tpe == "cercle")
    {
      document.getElementById("svg_" + selection[i].id).style.fill = hex2rgba(v, selection[i].fond_alpha);
    }
    else document.getElementById(selection[i].id).style.backgroundColor = hex2rgba(v, selection[i].fond_alpha);
  }
  //on sauvegarde
  g_sauver();
}
function cr_fond_alpha_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
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
  for (let i=0; i<selection.length; i++)
  {
    selection[i].marges = v;
    document.getElementById(selection[i].id).style.padding = v + "px";
  }
  //on sauvegarde
  g_sauver();
}

function cr_inter_change(e)
{
  for (let i=0; i<selection.length; i++)
  {
    if (e.checked && e.id == "cr_inter_0")
    {
      selection[i].inter = "0";
      selection[i].points = "0";
      // on enlève le lien "relier" sur l'ancienne cible
      if (selection[i].relie_id != "")
      {
        b2 = bloc_get_from_id(selection[i].relie_id);
        if (b2)
        {
          b2.inter = "0";
          b2.relie_id = "";
          b2.relie_cible_de = "";
          bloc_create_html(b2);
        }
      }
      selection[i].relie_id = "";
      selection[i].relie_cible_de = "";
    }
    else if (e.checked && e.id == "cr_inter_2")
    {
      selection[i].inter = "2";
      selection[i].points = "0";
      // on enlève le lien "relier" sur l'ancienne cible
      if (selection[i].relie_id != "")
      {
        b2 = bloc_get_from_id(selection[i].relie_id);
        if (b2)
        {
          b2.inter = "0";
          b2.relie_id = "";
          b2.relie_cible_de = "";
          bloc_create_html(b2);
        }
      }
      selection[i].relie_id = "";
      selection[i].relie_cible_de = "";
    }
    else if (e.checked && e.id == "cr_inter_1")
    {
      selection[i].inter = "1";
      if (selection[i].points == "0" && selection[i].relie_id != "") selection[i].points = "1";
      selection[i].relie_cible_de = "";
    }
    bloc_create_html(selection[i]);
  }
  selection_update();
  //on sauvegarde
  g_sauver();
}

function cr_relie_id_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    bloc = selection[i];
    bloc.relie_id = v;
    bloc.relie_cible_de = "";
    if (v != "" && bloc.points == "0") bloc.points = "1";
    else if (v == "") bloc.points = "0";
    bloc_create_html(bloc);
    //on change aussi la cible
    b2 = bloc_get_from_id(v);
    if (b2)
    {
      b2.inter = "1";
      b2.relie_id = "";
      b2.relie_cible_de = bloc.id;
      b2.points = "0";
      bloc_create_html(b2);
    }
  }
  selection_update();
  //on sauvegarde
  g_sauver();
}

function cr_points_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
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
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = l;
        rendu_get_superbloc(selection[i]).style.left = l + "px";
        document.getElementById("cr_tp_l").value = l;
      }
      break;
    case "2": //centre h
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = ch - parseFloat(selection[i].width)/2;
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "3": //droite
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = l + parseFloat(selection[0].width) - parseFloat(selection[i].width);
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "4": //haut
      for (let i=1; i<selection.length; i++)
      {
        selection[i].top = t;
        rendu_get_superbloc(selection[i]).style.top = t + "px";
        document.getElementById("cr_tp_t").value = t;
      }
      break;
    case "5": //centre v
      for (let i=1; i<selection.length; i++)
      {
        selection[i].top = cv - parseFloat(selection[i].height)/2;
        rendu_get_superbloc(selection[i]).style.top = selection[i].top + "px";
        document.getElementById("cr_tp_t").value = selection[i].top;
      }
      break;
    case "6": //bas
      for (let i=1; i<selection.length; i++)
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
    for (let i=0; i<news.length-1; i++)
    {
      espaces += parseFloat(news[i+1].left) - (parseFloat(news[i].left) + parseFloat(news[i].width));
    }
    espace = espaces/(news.length-1);
    for (let i=1; i<news.length-1; i++)
    {
      news[i].left = parseFloat(news[i-1].left) + parseFloat(news[i-1].width) + espace;
      rendu_get_superbloc(news[i]).style.left = news[i].left + "px";
      document.getElementById("cr_tp_l").value = news[i].left;
    }
  }
  else if (e.value == "2")
  {
    //on reordonne la selection en fonction de left
    news = selection.sort(_repart_compare_v);
    //on calcule l'espace moyen entre les blocs
    espaces = 0;
    for (let i=0; i<news.length-1; i++)
    {
      espaces += parseFloat(news[i+1].top) - (parseFloat(news[i].top) + parseFloat(news[i].height));
    }
    espace = espaces/(news.length-1);
    for (let i=1; i<news.length-1; i++)
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
  switch (e.value)
  {
    case "1": //premier plan
      for (let i=0; i<selection.length; i++)
      {
        //on met en ordre la liste des blocs
        b = selection[i];
        for (let j=0; j<blocs.length; j++)
        {
          if (b.id == blocs[j].id)
          {
            blocs.splice(j,1);
            break;
          }
        }
        blocs.push(b);
        //on modifie le rendu
        sb = rendu_get_superbloc(b);
        rd = sb.parentNode;
        rd.removeChild(sb);
        rd.appendChild(sb);
      }
      break;
    case "2": //arrière plan
      for (let i=0; i<selection.length; i++)
      {
        //on met en ordre la liste des blocs
        b = selection[i];
        for (let j=0; j<blocs.length; j++)
        {
          if (b.id == blocs[j].id)
          {
            blocs.splice(j,1);
            break;
          }
        }
        blocs.unshift(b);
        //on modifie le rendu
        sb = rendu_get_superbloc(b);
        rd = sb.parentNode;
        rd.removeChild(sb);
        rd.insertBefore(sb, rd.childNodes[1]);
      }
      break;
    case "3": //avancer
      break;
    case "4": //reculer
      break;
  }
  e.selectedIndex = 0;
}
function cr_action_change(e)
{
  if (e.value == "1") //dupliquer
  {
    news = [];
    for (let i=0; i<selection.length; i++)
    {
      nb = JSON.parse(JSON.stringify(selection[i]));
      nb.left += 15;
      nb.top += 15;
      last_id++;
      nb.id = last_id;
      bloc_create_html(nb);
      news.push(nb);
      blocs.push(nb);
      rendu_add_bloc(nb);
    }
    selection = news;
    selection_change();
  }
  else if (e.value == "2")  //supprimer
  {
    for (let i=0; i<selection.length; i++)
    {
      //on suprime les blocs du rendu
      sb = rendu_get_superbloc(selection[i]);
      sb.parentNode.removeChild(sb);
      // on supprime les blocs de la base
      for (let j=0; j<blocs.length; j++)
      {
        if (selection[i].id == blocs[j].id)
        {
          blocs.splice(j,1);
          break;
        }
      }
    }
    selection = [];
    selection_change();
  }
  if (e.value >= 0) g_sauver();
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
  document.getElementById("cr_rendu").style.backgroundColor = infos.coul;
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
