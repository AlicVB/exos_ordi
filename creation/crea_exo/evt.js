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

function cr_keydown(event)
{
  if (event.target != document.body) return;
  //console.log(event.keyCode);
  var r = document.getElementById("cr_rendu")
  var mv = 5;
  if (event.ctrlKey || event.shiftKey) mv = 20;
  switch (event.keyCode)
  {
    case 37: //flèche gauche
      for (let i=0; i<selection.length; i++)
      {
        selection[i].left = Math.max(0, parseFloat(selection[i].left) - mv);
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
      }
      break;
    case 38: //flèche haut
      for (let i=0; i<selection.length; i++)
      {
        selection[i].top = Math.max(0, parseFloat(selection[i].top) - mv);
        rendu_get_superbloc(selection[i]).style.top = selection[i].top + "px";
      }
      break;
    case 39: //flèche droite
      for (let i=0; i<selection.length; i++)
      {
        selection[i].left = Math.min(r.offsetWidth - 10 - selection[i].width, parseFloat(selection[i].left) + mv);
        rendu_get_superbloc(selection[i]).style.left = selection[i].left + "px";
      }
      break;
    case 40: //flèche bas
      for (let i=0; i<selection.length; i++)
      {
        selection[i].top = Math.min(r.offsetHeight - 10 - selection[i].height, parseFloat(selection[i].top) + mv);
        rendu_get_superbloc(selection[i]).style.top = selection[i].top + "px";
      }
      break;
    case 46: //suppr
    case 8:  //retour arrière
      var e = {};
      e.value = "2";
      cr_action_change(e);
      break;
    case 67: //C
      var e = {};
      e.value = "1";
      cr_action_change(e);
      break;
    case 89: //Y
      g_restaurer_hist(1);
      return;
      break;
    case 90: //Z
      g_restaurer_hist(-1);
      return;
      break;
    default:
      return;
  }
  selection_update();
  g_sauver();
}

function cr_coul_nb_change(e, modif)
{
  var elems = document.getElementsByClassName('cr_coul');
  nb = e.value;
  elems[0].style.display = 'block';
  for (let i=1; i<elems.length; i++)
  {
    if (i>nb) elems[i].style.display = 'none';
    else
    {
      elems[i].style.display = 'block';
      document.getElementById("cr_coul" + i + "_barre").style.display = "inline";
      document.getElementById("cr_coul" + i + "_maj").style.display = "inline";
      document.getElementById("cr_coul" + i + "_suff").style.display = "inline";
      document.getElementById("cr_coul" + i + "_suff_txt").style.display = "inline";
    }
  }
  
  //on met à jour le bloc si besoin
  if (modif)
  {
    cr_coul_change(null);
  }
}

function cr_img_get_change(e)
{
  var pre = e.id.substr(0,2);
  //on sauvegarde l'image sélectionnée
  var xhr = new XMLHttpRequest();
  var fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let img_name = xhr.responseText;
      if (img_name.startsWith("*"))
      {
        alert(img_name.substr(1));
        document.getElementById(pre + "_img_select").value = "";
        return;
      }
      
      // et la liste des images
      var option = document.createElement("option");
      option.text = img_name;
      option.value = img_name;
      document.getElementById(pre + "_img_select").add(option);
      document.getElementById(pre + "_img_select").value = img_name;
      
      if (pre == "cr")
      {
        // on récupère le bloc sélectionné
        if (selection.length < 1) return;
        bloc = selection[0];
        if (bloc.tpe != "image") return;
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
        //on sauvegarde
        g_sauver();
      }
      else if (pre == "ci")
      {
        infos.image = img_name;
        g_sauver_info();
      }      
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveimg&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_img_select_change(e)
{
  var pre = e.id.substr(0,2);
  
  var v = e.value;
  if (!v) return;
  if (v == "****")
  {
    document.getElementById(pre + "_img_get").click();
  }
  else if (pre == "cr")
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
      //on met à jour les infos de hauteur
      var h = document.getElementById(bloc.id).getBoundingClientRect().height;
      rendu_get_superbloc(bloc).style.height = h*100/rendu.height + "%";
      bloc.height = h/rendu.height*631;
      document.getElementById("cr_tp_h").value = h/rendu.height*631;       
      };
    // on met à jour le rendu
    document.getElementById(bloc.id).src = vpath;
    g_sauver();
  }
  else if (pre == "ci")
  {
    infos.image = v;
    g_sauver_info();
  }
}

function cr_audio_get_change(e)
{
  var pre = e.id.substr(0,2);
  //on sauvegarde l'image sélectionnée
  var xhr = new XMLHttpRequest();
  var fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let audio_name = xhr.responseText;
      if (audio_name.startsWith("*"))
      {
        alert(audio_name.substr(1));
        document.getElementById(pre + "_audio_select").value = "";
        return;
      }
      // et la liste des images
      var option = document.createElement("option");
      option.text = audio_name;
      option.value = audio_name;
      document.getElementById(pre + "_audio_select").add(option);
      document.getElementById(pre + "_audio_select").value = audio_name;
      if (pre == "cr")
      {
        // on récupère le bloc sélectionné
        if (selection.length < 1) return;
        bloc = selection[0];
        if (bloc.tpe != "audio") return;
        //on récupère les chemins
        bloc.audio_name = "sons/" + audio_name;
        
        audio_create_html(bloc, "");
        document.getElementById("cr_html").value = bloc.html;
        //on sauvegarde
        g_sauver();
      }
      else if (pre == "ci")
      {
        infos.audio_name = "sons/" + audio_name;
        g_sauver_info();
      }
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveaudio&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_audio_select_change(e)
{
  var pre = e.id.substr(0,2);
  var v = e.value;
  document.getElementById(pre + "_record_div").style.display = "none";
  if (!v) v = "";
  if (v == "******") //enregistrer
  {
    record_ini(e);
  }
  else if (v == "****") //parcourir
  {
    document.getElementById(pre + "_audio_get").click();
  }
  else if (pre == "cr")
  {
    if (selection.length < 1) return;
    bloc = selection[0];
    if (bloc.tpe != "audio") return;
    //on récupère les chemins
    if (v != "") bloc.audio_name = "sons/" + v;
    else bloc.audio_name = "";
    
    audio_create_html(bloc, "");
    document.getElementById("cr_html").value = bloc.html;
    g_sauver();
  }
  else if (pre == "ci")
  {
    if (v != "") infos.audio_name = "sons/" + v;
    else infos.audio_name = "";
    g_sauver_info();
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
  rendu_add_bloc(bloc);
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
        bloc.multi_coul = [];
        bloc.multi_maj = [];
        bloc.multi_suff = [];
        bloc.multi_barre = [];
        for (let i=0; i<document.getElementById("cr_coul_nb").value; i++)
        {
          bloc.multi_coul.push("#" + document.getElementById("cr_coul" + (i+1)).jscolor);
          if (document.getElementById("cr_coul" + (i+1) + "_barre").checked) bloc.multi_barre.push(1);
          else bloc.multi_barre.push(0);
          if (document.getElementById("cr_coul" + (i+1) + "_maj").checked) bloc.multi_maj.push(1);
          else bloc.multi_maj.push(0);
          if (document.getElementById("cr_coul" + (i+1) + "_suff").checked)
          {
            document.getElementById("cr_coul" + (i+1) + "_suff_txt").disabled = false;
            bloc.multi_suff.push(document.getElementById("cr_coul" + (i+1) + "_suff_txt").value);
          }
          else
          {
            document.getElementById("cr_coul" + (i+1) + "_suff_txt").disabled = true;
            bloc.multi_suff.push("");
          }
        }
        break;
      default:
        continue;
    }
    //on change le rendu
    bloc_create_html(bloc);
    document.getElementById("cr_html").value = bloc.html;
    rendu_add_bloc(bloc);
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
    if (document.getElementById("cr_texte_corr").checked) bloc.texte_corr = "1";
    else bloc.texte_corr = "0";
    
    texte_create_html(bloc, document.getElementById("cr_txt_ini").value);
    document.getElementById("cr_html").value = bloc.html;
    
    rendu_add_bloc(bloc); 
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
  s2 = s1*rendu.height/1000;
  for (let i=0; i<selection.length; i++)
  {
    selection[i].font_size = s1;
    document.getElementById(selection[i].id).style.fontSize = s2 + "px";
    bloc_create_html(selection[i]);
  }
  selection_update();
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
function cr_align_change(e)
{
  let v = "0";
  if (e.id == "cr_align_l") v = "1";
  else if (e.id == "cr_align_c") v = "2";
  else if (e.id == "cr_align_r") v = "3";
  else return;
  for (let i=0; i<selection.length; i++)
  {
    selection[i].align = v;
    if (v == "1") document.getElementById(selection[i].id).style.textAlign = "left";
    else if (v == "2") document.getElementById(selection[i].id).style.textAlign = "center";
    else if (v == "3") document.getElementById(selection[i].id).style.textAlign = "right";
  }
  g_sauver();
}

function cr_tp_w_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    if (bloc.size == "ratio")
    {
      selection[i].height = selection[i].height*v/selection[i].width;
      selection[i].width = v;      
      rendu_get_superbloc(selection[i]).style.width = v*100/443 + "%";
      rendu_get_superbloc(selection[i]).style.height = selection[i].height*100/631 + "%";
    }
    else if (bloc.size == "manuel")
    {
      selection[i].width = v;
      rendu_get_superbloc(selection[i]).style.width = v*100/443 + "%";
    }
  }
  //on sauvegarde
  g_sauver();
}
function cr_tp_h_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    if (bloc.size == "ratio")
    {
      selection[i].width = selection[i].width*v/selection[i].height;
      selection[i].height = v;      
      rendu_get_superbloc(selection[i]).style.height = v*100/631 + "%";
      rendu_get_superbloc(selection[i]).style.width = selection[i].width*100/443 + "%";
    }
    else if (bloc.size == "manuel")
    {
      selection[i].height = v;
      rendu_get_superbloc(selection[i]).style.height = v*100/631 + "%";
    }
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
    rendu_get_superbloc(selection[i]).style.top = v*100/631 + "%";
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
    rendu_get_superbloc(selection[i]).style.left = v*100/443 + "%";
  }
  //on sauvegarde
  g_sauver();
}
function cr_tp_r_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    selection[i].rotation = v;
    rendu_get_superbloc(selection[i]).style.transform = "rotate(" + v + "deg)";
  }
  //on sauvegarde
  g_sauver();
}

function cr_bord_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    if (selection[i].tpe == "cercle" || bloc.tpe == "ligne")
    {
      if (v == "double" || (v == "hidden" && bloc.tpe == "ligne"))
      {
        //non géré, retour à l'ancienne valeur
        selection_update();
        return;
      }
      svg = document.getElementById("svg_" + selection[i].id);
      svg.style.stroke = selection[i].bord_coul;
      svg.style.removeProperty("stroke-dasharray");
      switch (v)
      {
        case "dashed":
          svg.style.strokeDasharray = (2 + parseFloat(selection[i].bord_size)*rendu.width/443*2) + " " + (parseFloat(selection[i].bord_size)*rendu.width/443*2);
          break;
        case "dotted":
          svg.style.strokeDasharray = "0 " + (parseFloat(selection[i].bord_size)*rendu.width/443*1.5);
          break;
        case "hidden":
          svg.style.removeProperty("stroke");
          break;
      }
      if (bloc.tpe == "cercle")
      {
        //on modifie le rayon pour prendre en compte la bordure
        var w = 0;
        if (selection[i].bord != "hidden") w = selection[i].bord_size;
        svg.setAttribute("rx", 50 - parseFloat(w)/2);
        svg.setAttribute("ry", 50 - parseFloat(w)/2);
      }
      bloc_create_html(selection[i]);
    }
    else document.getElementById(selection[i].id).style.borderStyle = v;
    selection[i].bord = v;
  }
  selection_update();
  //on sauvegarde
  g_sauver();
}
function cr_bord_coul_change(jscolor)
{
  v = "#" + jscolor;
  for (let i=0; i<selection.length; i++)
  {
    selection[i].bord_coul = v;
    if (selection[i].tpe == "cercle" || bloc.tpe == "ligne")
    {
      svg = document.getElementById("svg_" + selection[i].id);
      if (selection[i].bord != "hidden") svg.style.stroke = v;
    }
    else document.getElementById(selection[i].id).style.borderColor = v;
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
    if (selection[i].tpe == "cercle" || bloc.tpe == "ligne")
    {
      svg = document.getElementById("svg_" + selection[i].id);
      svg.style.strokeWidth = v*rendu.width/443 + "px";
      if (bloc.tpe == "cercle")
      {
        //on modifie le rayon pour prendre en compte la bordure
        var w = 0;
        if (selection[i].bord != "hidden") w = selection[i].bord_size;
        svg.setAttribute("rx", 50 - parseFloat(w)/2);
        svg.setAttribute("ry", 50 - parseFloat(w)/2);
      }
      switch (selection[i].bord)
      {
        case "dashed":
          svg.style.strokeDasharray = (2 + v*rendu.width/443*2) + " " + (v*rendu.width/443*2);
          break;
        case "dotted":
          svg.style.strokeDasharray = "0 " + (v*rendu.width/443*1.5);
          break;
      }
    }
    else document.getElementById(selection[i].id).style.borderWidth = v*rendu.width/443 + "px";
    bloc_create_html(selection[i]);
  }
  selection_update();
  //on sauvegarde
  g_sauver();
}
function cr_bord_rond_change(e)
{
  v = e.value;
  for (let i=0; i<selection.length; i++)
  {
    selection[i].bord_rond = v;
    document.getElementById(selection[i].id).style.borderRadius = v*rendu.width/443 + "px";
    bloc_create_html(selection[i]);
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
    if (selection[i].tpe == "cercle")
    {
      document.getElementById("svg_" + selection[i].id).style.fill = hex2rgba(selection[i].fond_coul, v);
    }
    else document.getElementById(selection[i].id).style.backgroundColor = hex2rgba(selection[i].fond_coul, v);
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
    document.getElementById(selection[i].id).style.padding = v*100/443 + "%";
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
        relie_update_cible(bloc_get_from_id(selection[i].relie_id));
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
        relie_update_cible(bloc_get_from_id(selection[i].relie_id));
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
  let v = e.value;
  //on vérifie les valeurs
  let elems = v.split("|");
  let txt = "";
  for (let i=0; i<elems.length; i++)
  {
    let b = bloc_get_from_id(elems[i]);
    if (!b) txt += "\n" + "l'élément avec l'id " + elems[i] + " est introuvable !";
    else if (b.relie_id != "" && b.relie_id != "*") txt += "\n" + "l'élément avec l'id " + elems[i] + " est déjà une source de relier !";
    else
    {
      switch (b.tpe)
      {
        case "texte":
        case "radio":
        case "radiobtn":
        case "check":
        case "multi":
        case "combo":
        case "cible":
          txt += "\n" + "les éléments de type " + b.tpe + " ne peuvent pas être reliés !";
          break;
      }
      for (let j=0; j<selection.length; j++)
      {
        if (selection[j].id == b.id) txt += "\n" + "l'élément avec l'id " + b.id + " ne peut se relier à lui-même !";
      }
    }
  }
  if (txt != "")
  {
    alert("!! ERREUR !!\n" + txt);
    e.value = "";
    v = "";
    elems = [];
  }
  for (let i=0; i<selection.length; i++)
  {
    bloc = selection[i];
    let old_elems = bloc.relie_id.split("|");
    bloc.relie_id = v;
    bloc.relie_cible_de = "";
    if (v != "" && bloc.points == "0") bloc.points = "1";
    else if (v == "") bloc.points = "0";
    bloc_create_html(bloc);
    //on change aussi les cibles
    for (let j=0; j<elems.length; j++)
    {
      relie_update_cible(bloc_get_from_id(elems[j]));
    }
    for (let j=0; j<old_elems.length; j++)
    {
      relie_update_cible(bloc_get_from_id(old_elems[j]));
    }
  }
  selection_update();
  //on sauvegarde
  g_sauver();
}
function relie_update_cible(bloc)
{
  console.log("hein");
  if (!bloc) return;
  // on parcoure tous les autres blocs pour voir ceux qui citent celui en cours
  let cible = "";
  for (let i=0; i<blocs.length; i++)
  {
    if (blocs[i] == bloc) continue;
    if (blocs[i].inter != "1") continue;
    let v = blocs[i].relie_id.split("|");
    for (let j=0; j<v.length; j++)
    {
      if (v[j] == bloc.id)
      {
        if (cible != "") cible += "|";
        cible += blocs[i].id;
        break;
      }
    }
  }
  console.log(cible);
  if (cible == "")
  {
    bloc.inter = "0";
    bloc.relie_id = "";
    bloc.relie_cible_de = "";
    bloc.points = "0";
    bloc_create_html(bloc);
  }
  else
  {
    bloc.inter = "1";
    bloc.relie_id = "*";
    bloc.relie_cible_de = cible;
    bloc.points = "0";
    bloc_create_html(bloc);
  }
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

function cr_aligne_change(id)
{
  
  l = parseFloat(selection[0].left);
  ch = l + parseFloat(selection[0].width)/2;
  t = parseFloat(selection[0].top);
  cv = t + parseFloat(selection[0].height)/2;
  switch (id)
  {
    case "1": //gauche
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = l;
        rendu_get_superbloc(selection[i]).style.left = l*100/443 + "px";
        document.getElementById("cr_tp_l").value = l;
      }
      break;
    case "2": //centre h
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = ch - parseFloat(selection[i].width)/2;
        rendu_get_superbloc(selection[i]).style.left = selection[i].left*100/443 + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "3": //droite
      for (let i=1; i<selection.length; i++)
      {
        selection[i].left = l + parseFloat(selection[0].width) - parseFloat(selection[i].width);
        rendu_get_superbloc(selection[i]).style.left = selection[i].left*100/443 + "px";
        document.getElementById("cr_tp_l").value = selection[i].left;
      }
      break;
    case "4": //haut
      for (let i=1; i<selection.length; i++)
      {
        selection[i].top = t;
        rendu_get_superbloc(selection[i]).style.top = t*100/631 + "px";
        document.getElementById("cr_tp_t").value = t;
      }
      break;
    case "5": //centre v
      for (let i=1; i<selection.length; i++)
      {
        selection[i].top = cv - parseFloat(selection[i].height)/2;
        rendu_get_superbloc(selection[i]).style.top = selection[i].top*100/631 + "px";
        document.getElementById("cr_tp_t").value = selection[i].top;
      }
      break;
    case "6": //bas
      for (let i=1; i<selection.length; i++)
      {
        selection[i].top = t + parseFloat(selection[0].height) - parseFloat(selection[i].height);
        rendu_get_superbloc(selection[i]).style.top = selection[i].top*100/631 + "px";
        document.getElementById("cr_tp_t").value = selection[i].top;
      }
      break;
  }
  if (id >= 0) g_sauver();
}
function _repart_compare_h(a, b)
{
  return (a.left - b.left);
}
function _repart_compare_v(a, b)
{
  return (a.top - b.top);
}
function cr_repart_change(id)
{
  if (id == "1")
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
      rendu_get_superbloc(news[i]).style.left = news[i].left*100/443 + "px";
      document.getElementById("cr_tp_l").value = news[i].left;
    }
  }
  else if (id == "2")
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
      rendu_get_superbloc(news[i]).style.top = news[i].top*100/631 + "px";
      document.getElementById("cr_tp_t").value = news[i].top;
    }
  }
  if (id >= 0) g_sauver();
}
function cr_plans_change(id)
{
  switch (id)
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
    default:
      return;
  }
  g_sauver();
}
function cr_action_change(id)
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
      let option = document.createElement("option");
      option.text = nb.id + " (" + nb.tpe + ")";
      option.value = nb.id;
      document.getElementById("cr_bloc_liste").add(option);
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
      // et de la liste déroulante
      for (let j=0; j<document.getElementById("cr_bloc_liste").options.length; j++)
      {
        if (document.getElementById("cr_bloc_liste").options[j].value == selection[i].id)
        {
          document.getElementById("cr_bloc_liste").remove(j);
          break;
        }
      }
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

function cr_record_start(e)
{
  var pre = e.id.substr(0,2);
  switch (e.getAttribute("etat"))
  {
    case "0":
      record_start(e);
      break;
    case "1":
      record_stop(e);
      break;
    case "2":
      document.getElementById(pre + "_record_audio").play();
      break;
  }
}
function cr_record_save(e)
{
  var pre = e.id.substr(0,2);
  //on sauvegarde le son enregistré
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let audio_name = xhr.responseText;
      if (audio_name.startsWith("*"))
      {
        alert(audio_name.substr(1));
        document.getElementById(pre + "_audio_select").value = "";
        return;
      }
      // et la liste des images
      var option = document.createElement("option");
      option.text = audio_name;
      option.value = audio_name;
      document.getElementById(pre + "_audio_select").add(option);
      document.getElementById(pre + "_audio_select").value = audio_name;
      if (pre == "cr")
      {
        // on récupère le bloc sélectionné
        if (selection.length < 1) return;
        bloc = selection[0];
        if (bloc.tpe != "audio") return;
        //on récupère les chemins
        bloc.audio_name = "sons/" + audio_name;
        
        audio_create_html(bloc, "");
        document.getElementById("cr_html").value = bloc.html;
        //on sauvegarde
        g_sauver();
      }
      else if (pre == "ci")
      {
        infos.audio_name = "sons/" + audio_name;
        g_sauver_info();
      }     
      
      //et on remet tout l'affichage à zéro
      record.chunks = [];
      record.blob = null;
      record.recorder = null;
      document.getElementById(pre + "_record_div").style.display = "none";
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveaudioblob&fic=" + exo_dos);
  xhr.send(record.blob);
}
function cr_record_delete(e)
{
  record.chunks = [];
  record.blob = null;
  record.recorder = null;
  record_ini(e);
}

function cr_bloc_liste_change(e)
{
  let b = bloc_get_from_id(e.value);
  if (b)
  {
    selection = [b];
    selection_change();
  }
  else
  {
    selection = [];
    selection_change();
  }
}
function cm_quitte(e)
{
  document.removeEventListener("mousedown", cm_quitte);
  let elems = document.getElementsByClassName("cm");
  for (let i=0; i<elems.length; i++)
  {
    elems[i].style.visibility = "hidden";
  }
}

function cm_show_aligne(e)
{
  if (selection.length == 0) return;
  let rect = e.getBoundingClientRect();
  let cm = document.getElementById("cm_aligne");
  let rect2 = cm.getBoundingClientRect();
  cm.style.top = (rect.top + rect.height - rect2.height) + "px";
  cm.style.left = rect.right+2 + "px";
  
  document.addEventListener("mousedown", cm_quitte);
  cm.style.visibility = "visible";
}
function cm_show_repart(e)
{
  if (selection.length <= 2) return;
  let rect = e.getBoundingClientRect();
  let cm = document.getElementById("cm_repart");
  let rect2 = cm.getBoundingClientRect();
  cm.style.top = (rect.top + rect.height - rect2.height) + "px";
  cm.style.left = rect.right+2 + "px";
  
  document.addEventListener("mousedown", cm_quitte);
  cm.style.visibility = "visible";
}
function cm_show_plans(e)
{
  if (selection.length == 0) return;
  let rect = e.getBoundingClientRect();
  let cm = document.getElementById("cm_plans");
  let rect2 = cm.getBoundingClientRect();
  cm.style.top = (rect.top + rect.height - rect2.height) + "px";
  cm.style.left = rect.right+2 + "px";
  
  document.addEventListener("mousedown", cm_quitte);
  cm.style.visibility = "visible";
}

function cr_txt_ini_keypress(event)
{
  if (event.which == 13) event.preventDefault();
}
