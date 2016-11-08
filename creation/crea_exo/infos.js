"use strict";

let  infos = {};

let  exo_dos = ""  //chemin vers le dossier de l'exercice

let  record = {};  //objet contenant tout ce qu'il faut pour enregistrer


function change(e)
{
}

function start(dos)
{
  //si pas de nom d'exo dans l'url, il faut le rajouter ! (pour refresh...)
  if (window.location.href.substr(-1,1) == "=")
  {
    history.replaceState('ajout exo', document.title, window.location.href + dos.split("/").pop());
  }
  exo_dos = dos;
  g_restaurer_info(true);
  
  //enregistrement
  record.chunks = [];
  record.stream = null;
  record.recorder = null;
  record.promise = null;
  record.blob = null;
}

function hex2rgb(hex)
{
  let  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let  r = parseInt(result[1], 16);
  let  g = parseInt(result[2], 16);
  let  b = parseInt(result[3], 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
function hex2rgba(hex, alpha)
{
  let  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let  r = parseInt(result[1], 16);
  let  g = parseInt(result[2], 16);
  let  b = parseInt(result[3], 16);
  return "rgba(" + r + ", " + g + ", " + b + ", " + (alpha/100) + ")";
}

function record_ini(e)
{
  let  pre = e.id.substr(0,2);
  //on gère l'affichage
  document.getElementById(pre + "_record_start").style.display = "inline";
  document.getElementById(pre + "_record_save").style.display = "none";
  document.getElementById(pre + "_record_delete").style.display = "none";
  document.getElementById(pre + "_record_start").setAttribute("etat", "0");
  document.getElementById(pre + "_record_start").style.backgroundColor = "#D8D8D8";
  document.getElementById(pre + "_record_start").src = "../../icons/media-record.svg";
  document.getElementById(pre + "_record_div").style.display = "inline-block";

  if (record.promise) return; //on a déjà initialiser !
  
  record.promise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
  record.promise.then(function(_str) {record.stream = _str; });
  record.promise.catch(function(err) { console.log(err.name + ": " + err.message); });
}
function record_start(el)
{
  let  pre = el.id.substr(0,2);
  document.getElementById(pre + "_record_start").setAttribute("etat", "1");
  document.getElementById(pre + "_record_start").style.backgroundColor = "red";
  document.getElementById(pre + "_record_start").src = "../../icons/media-playback-stop.svg";
  record.recorder = new MediaRecorder(record.stream);
  record.recorder.ondataavailable = function(e) {record.chunks.push(e.data);};
  record.recorder.onstop = function(e) {record_fin(e, el);};
  
  record.recorder.start();
  console.log("recorder started : " + record.recorder.state);
}
function record_stop(e)
{
  let  pre = e.id.substr(0,2);
  record.recorder.stop();
  console.log("recorder stopped " + record.recorder.state);
  document.getElementById(pre + "_record_start").setAttribute("etat", "2");
  document.getElementById(pre + "_record_start").style.backgroundColor = "#D8D8D8";
  document.getElementById(pre + "_record_start").src = "../../icons/media-playback-start.svg";
  document.getElementById(pre + "_record_save").style.display = "inline";
  document.getElementById(pre + "_record_delete").style.display = "inline";
}
function record_fin(e, el)
{
  record.blob = new Blob(record.chunks, { 'type' : 'audio/ogg; codecs=opus' });
  let  audioURL = window.URL.createObjectURL(record.blob);
  document.getElementById("ci_record_audio").src = audioURL;
}
function cr_record_start(e)
{
  let  pre = e.id.substr(0,2);
  switch (e.getAttribute("etat"))
  {
    case "0":
      record_start(e);
      break;
    case "1":
      record_stop(e);
      break;
    case "2":
      document.getElementById("ci_record_audio").play();
      break;
  }
}
function cr_record_save(e)
{
  //on sauvegarde le son enregistré
  let  xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let audio_name = xhr.responseText;
      if (audio_name.startsWith("*"))
      {
        alert(audio_name.substr(1));
        document.getElementById("ci_audio_select").value = "";
        return;
      }
      // et la liste des images
      let  option = document.createElement("option");
      option.text = audio_name;
      option.value = audio_name;
      document.getElementById("ci_audio_select").add(option);
      document.getElementById("ci_audio_select").value = audio_name;

      infos.audio_name = "sons/" + audio_name;
      g_sauver_info(); 
      
      //et on remet tout l'affichage à zéro
      record.chunks = [];
      record.blob = null;
      record.recorder = null;
      document.getElementById("ci_record_div").style.display = "none";
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

function file_create_infos()
{
  let txt = infos.titre + "\n";
  txt += infos.consigne.replace(/(?:\r\n|\r|\n)/g, '<br />') + "\n";
  txt += infos.total + "|" + infos.arrondi + "\n";
  for(i=0; i<6; i++)
  {
    txt += infos.a[i].min + "|" + infos.a[i].coul + "|";
    txt += infos.a[i].txt.replace(/(?:\r\n|\r|\n)/g, '<br />') + "|";
    txt += infos.a[i].re;
    txt += "\n";
  }
  txt += infos.essais + "\n";
  txt += infos.coul + "\n";
  txt += infos.audio_name + "\n";
  txt += infos.show_bilan + "\n";
  txt += infos.image + "|" + infos.image_hover;
  
  return txt;
}
function file_sauve(fic, txt)
{
  let xhr = new XMLHttpRequest();
  let ligne = "io=sauve&fic=" + fic + "&v=" + encodeURIComponent(txt);
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(ligne);
}

function g_sauver_info()
{
  file_sauve(exo_dos + "/exo.txt", file_create_infos());
}

function g_restaurer_info(init)
{
  //on nettoie
  if (init) g_reinit();
  
  //on récupère les infos dans le fichier ad'hoc
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      // on met les bonnes valeurs aux bons endroits
      let  vals = [];
      let  rep = xhr.responseText;
      let tosave = false;
      if (rep.length > 3 && rep.substr(0,4) == "****")
      {
        tosave = true;
        rep = rep.substr(4);
      }
      if (rep != "") vals = rep.split("\n");
      else g_sauver_info();
      if (vals.length>10)
      {
        infos.titre = vals[0];
        infos.consigne = vals[1];
        let vv = vals[2].split("|");
        if (vv.length>1)
        {
          infos.total = vv[0];
          infos.arrondi = vv[1];
        }
        for (let i=0; i<6; i++)
        {
          vv = vals[i+3].split("|");
          if (vv.length>3)
          {
            infos.a[i].min = vv[0];
            infos.a[i].coul = vv[1];
            infos.a[i].txt = vv[2].replace(/<br \/>/g, "\n");
            infos.a[i].re = vv[3];
          }
        }
        infos.essais = vals[9];
        infos.coul = vals[10];
        if (vals.length>11) infos.audio_name = vals[11];
        if (vals.length>12) infos.show_bilan = vals[12];
        if (vals.length>13)
        {
          vv = vals[13].split("|");
          if (vv.length>1)
          {
            infos.image = vv[0];
            infos.image_hover = vv[1];
          }
        }
      }
      if (tosave) g_sauver_info();
      infos_change();
    }
  };
  xhr.open("POST", "io.php" , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("io=charge&fic=" + exo_dos + "/exo.txt");
}

function infos_change()
{
  document.getElementById("cri_titre").value = infos.titre;
  document.getElementById("cri_coul").value = infos.coul;
  document.getElementById("cri_consigne").value = infos.consigne;
  document.getElementById("cri_total").value = infos.total;
  document.getElementById("cri_arrondi").value = infos.arrondi;
  document.getElementById("cri_essais").value = infos.essais;
  for (let j=0; j<6; j++)
  {
    document.getElementById((j+1) + "_cri_a_min").value = infos.a[j].min;
    document.getElementById((j+1) + "_cri_a_coul").value = infos.a[j].coul;
    document.getElementById((j+1) + "_cri_a_re").checked = (infos.a[j].re == "1");
    document.getElementById((j+1) + "_cri_a_txt").value = infos.a[j].txt;
  }
  let audio = infos.audio_name;
  if (audio.length>5) audio = audio.substr(5);
  document.getElementById("ci_audio_select").value = audio;
  document.getElementById("cri_show_bilan").checked = (infos.show_bilan == "1");
  document.getElementById("ci_img_select").value = infos.image;
  document.getElementById("cri_img_hover").checked = (infos.image_hover == "1");
}

function g_reinit()
{
  //on nettoie
  infos_ini();
  infos_change();
}

function infos_ini()
{
  infos = {};
  infos.titre = "exercice";
  infos.coul = "#ffffff";
  infos.consigne = "";
  infos.total = "-1";
  infos.arrondi = "1";
  infos.essais = "1";
  infos.a = [{}, {}, {}, {}, {}, {}];
  infos.a[0].min = "0";
  infos.a[1].min = "20";
  infos.a[2].min = "40";
  infos.a[3].min = "60";
  infos.a[4].min = "80";
  infos.a[5].min = "99";
  infos.a[0].coul = "n";
  infos.a[1].coul = "r";
  infos.a[2].coul = "j";
  infos.a[3].coul = "b";
  infos.a[4].coul = "v";
  infos.a[5].coul = "c";
  infos.a[0].re = "0";
  infos.a[1].re = "0";
  infos.a[2].re = "0";
  infos.a[3].re = "0";
  infos.a[4].re = "0";
  infos.a[5].re = "0";
  infos.a[0].txt = "OH !\nTu n'as pas compris la consigne ou la règle !\nDemande de l'aide à quelqu'un\net passe à la suite...";
  infos.a[1].txt = "Tu as encore fait trop d'erreurs !\nDemande de l'aide à quelqu'un\net passe à la suite...";
  infos.a[2].txt = "Tu as encore fait trop d'erreurs !\nRelis la règle\net passe à la suite...";
  infos.a[3].txt = "Tu commences à comprendre,\nmais il reste encore des erreurs !\Passe à la suite...";
  infos.a[4].txt = "BIEN !\nTu n'as presque plus d'erreurs.\Sauras-tu faire encore mieux\nau prochain exercice ?";
  infos.a[5].txt = "BRAVO !\nSeras-tu capable de faire aussi bien\nau prochain exercice ?";
  infos.audio_name = "";
  infos.show_bilan = "1";
  infos.image = "";
  infos.image_hover = "0";
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
  let nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].min = e.value;
  g_sauver_info();
}
function cri_a_coul_change(e)
{
  let nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].coul = e.value;
  g_sauver_info();
}
function cri_a_re_change(e)
{
  let nb = parseInt(e.id.substr(0,1));
  if (e.checked) infos.a[nb-1].re = "1";
  else infos.a[nb-1].re = "0";
  g_sauver_info();
}
function cri_a_txt_change(e)
{
  let nb = parseInt(e.id.substr(0,1));
  infos.a[nb-1].txt = e.value;
  g_sauver_info();
}
function cri_show_bilan_change(e)
{
  if (e.checked) infos.show_bilan = "1";
  else infos.show_bilan = "0";
  g_sauver_info();
}
function cri_img_hover_change(e)
{
  if (e.checked) infos.image_hover = "1";
  else infos.image_hover = "0";
  g_sauver_info();
}
function cri_mod_sel_change(e)
{
  if (e.value == "****")
  {
    //rien à faire
  }
  else if (e.value == "####")
  {
    //on ouvre le gestionnaire dans une nouvelle fenêtre
    document.getElementById("cri_mod_gestion").click();
  }
  else
  {
    //on charge le modèle
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
      {
        // on met les bonnes valeurs aux bons endroits
        let  vals = [];
        let  rep = xhr.responseText;
        if (rep != "") vals = rep.split("\n");
        else return;
        if (vals.length>10)
        {
          infos.titre = vals[0];
          infos.consigne = vals[1];
          let vv = vals[2].split("|");
          if (vv.length>1)
          {
            infos.total = vv[0];
            infos.arrondi = vv[1];
          }
          for (let i=0; i<6; i++)
          {
            vv = vals[i+3].split("|");
            if (vv.length>3)
            {
              infos.a[i].min = vv[0];
              infos.a[i].coul = vv[1];
              infos.a[i].txt = vv[2].replace(/<br \/>/g, "\n");
              infos.a[i].re = vv[3];
            }
          }
          infos.essais = vals[9];
          infos.coul = vals[10];
          if (vals.length>11) infos.audio_name = vals[11];
        }
        infos_change();
      }
    };
    xhr.open("POST", "io.php" , true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("io=charge&fic=modeles/" + e.value);
  }
  e.selectedIndex = 0;
}
function cri_mod_save(e)
{
  let txt = prompt("Nom du modèle (sans accents, espaces, etc...)\n\nAttention si il existe déjà, l'ancien sera écrasé !", "");
  if (!txt | txt == "") return;
  file_sauve("modeles/" + txt, file_create_infos());
  let  option = document.createElement("option");
  option.text = txt;
  option.value = txt;
  document.getElementById("cri_mod_sel").add(option);
}

function cr_img_get_change(e)
{
  //on sauvegarde l'image sélectionnée
  let  xhr = new XMLHttpRequest();
  let  fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let img_name = xhr.responseText;
      if (img_name.startsWith("*"))
      {
        alert(img_name.substr(1));
        document.getElementById("ci_img_select").value = "";
        return;
      }
      
      // et la liste des images
      let  option = document.createElement("option");
      option.text = img_name;
      option.value = img_name;
      document.getElementById("ci_img_select").add(option);
      document.getElementById("ci_img_select").value = img_name;
      
      infos.image = img_name;
      g_sauver_info();    
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveimg&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_img_select_change(e)
{
  let  v = e.value;
  if (!v) return;
  if (v == "****")
  {
    document.getElementById("ci_img_get").click();
  }
  infos.image = v;
  g_sauver_info();
}

function cr_audio_get_change(e)
{
  //on sauvegarde l'image sélectionnée
  let  xhr = new XMLHttpRequest();
  let  fd  = new FormData(e.form);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
    {
      let audio_name = xhr.responseText;
      if (audio_name.startsWith("*"))
      {
        alert(audio_name.substr(1));
        document.getElementById("ci_audio_select").value = "";
        return;
      }
      // et la liste des images
      let  option = document.createElement("option");
      option.text = audio_name;
      option.value = audio_name;
      document.getElementById("ci_audio_select").add(option);
      document.getElementById("ci_audio_select").value = audio_name;
      infos.audio_name = "sons/" + audio_name;
      g_sauver_info();
    }
  };
  // We setup our request
  xhr.open("POST", "io.php?io=sauveaudio&fic=" + exo_dos);
  xhr.send(fd);
}
function cr_audio_select_change(e)
{
  let  v = e.value;
  document.getElementById("ci_record_div").style.display = "none";
  if (!v) v = "";
  if (v == "******") //enregistrer
  {
    record_ini(e);
  }
  else if (v == "****") //parcourir
  {
    document.getElementById("ci_audio_get").click();
  }
  if (v != "") infos.audio_name = "sons/" + v;
  else infos.audio_name = "";
  g_sauver_info();
}
