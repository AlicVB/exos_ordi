<?php
  // on récupère les paramètres
  if (!isset($_GET['exo']) || !isset($_GET['cat']) || !isset($_GET['livre']))
  {
    exit("imossible de récupérer les paramètres...");
  }
  $exo = $_GET['exo'];
  $livre = $_GET['livre'];
  $cat = $_GET['cat'];
  $dos_l = "../../livres/";
  if ($cat != "") $dos_l .= "$cat/";
  $dos_l .= "$livre";
  
  //si besoin, on crée un nouvel exercice
  if ($exo == "")
  {
    $exos = glob("$dos_l/exos/*" , GLOB_ONLYDIR);
    if (count($exos)>0) $exo = chr(ord(basename($exos[count($exos)-1])) + 1);
    else $exo = "A";
  }
  $dos_e = "$dos_l/exos/$exo";
  
  //on crée les fichier qu'il faut si besoin
  if (!file_exists($dos_e)) mkdir("$dos_e", 0777, true);
  if (!file_exists("$dos_e/charge.php")) copy("../exo_type/charge.php", "$dos_e/charge.php");
  if (!file_exists("$dos_e/sauve.php")) copy("../exo_type/sauve.php", "$dos_e/sauve.php");
  if (!file_exists("$dos_e/exo.css")) copy("../exo_type/exo.css", "$dos_e/exo.css");
  if (!file_exists("$dos_e/exo.js")) copy("../exo_type/exo.js", "$dos_e/exo.js");
  if (!file_exists("$dos_e/exo.php")) file_put_contents("$dos_e/exo.php", "");
  if (!file_exists("$dos_e/exo.txt")) file_put_contents("$dos_e/exo.txt", "");
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Création d'exercice</title>
  <link rel="stylesheet" href="infos.css">
  <link rel="shortcut icon" href="../../icons/gnome-palm.png" >
  <script type="text/javascript" src="../../libs/jscolor.min.js"></script>
  
  <script type="text/javascript" src="infos.js"></script>
</head>

<body onload="start('<?php echo "$dos_e"; ?>')">
  <div id="cri_bandeau">
    <img id="cri_info" src="../../icons/dialog-information.svg" />
    Informations générales
    <span id="cri_dos_exo"><?php echo "$dos_e"; ?></span>
    <img id="cri_rendu" src="../../icons/application-x-diagram.svg" onclick="window.location.href='exo.php?cat=<?php echo $cat ?>&livre=<?php echo $livre ?>&exo=<?php echo $exo ?>'"/>
  </div>
  <div id="cr_pa_info">
    <p>
      Titre de l'exercice :
      <input type="text" id="cri_titre" onKeyUp="cri_titre_change(this)" value="Exercice"/>
      Couleur de fond :
      <input class="jscolor {hash:true}" type="text" id="cri_coul" value="#ffffff" onchange="cri_coul_change(this)" />
    </p>
    <table class="cri_table">
      <tr>
        <td>Consigne (html) :</th>
        <td><textarea id="cri_consigne" onKeyUp="cri_consigne_change(this)"></textarea></td>
        <td>Consigne audio :</th>
        <td>
          <div class="cr_opt_ligne" id="ci_audio_get_div">
            <select id="ci_audio_select" onchange="cr_audio_select_change(this)">
              <option value="" selected></option>
              <option value="******">Enregistrer...</options>
              <option value="****">Parcourir...</options>
              <?php
                $imgs = glob("$dos_l/sons/*");
                for ($i=0; $i<count($imgs); $i++)
                {
                  echo "<option value=\"".basename($imgs[$i])."\">".basename($imgs[$i])."</option>";
                }
              ?>
            </select>
            <form enctype="multipart/form-data">
              <input name="cr_audio_get" type="file" id="ci_audio_get" accept="audio/*" onchange="cr_audio_get_change(this)"/>
            </form>
            <div id="ci_record_div">
              <img id="ci_record_start" etat="0" src="../../icons/media-record.svg" onclick="cr_record_start(this)"/>
              <img id="ci_record_save" src="../../icons/document-save.svg" onclick="cr_record_save(this)"/>
              <img id="ci_record_delete" src="../../icons/window-close.svg" onclick="cr_record_delete(this)"/>
              <audio id="ci_record_audio"></audio>
            </div>
          </div>
        </td>
      </tr>
    </table>
    </p>
    <p>
      Apréciations :
      <table class="cri_table">
        <tr>
          <th>score min</th>
          <th>couleur</th>
          <th>btn réessai</th>
          <th>texte (html)</th>
        </tr>
        <tr>
          <th><input type="number" id="1_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="1_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="1_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="1_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
        <tr>
          <th><input type="number" id="2_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="2_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="2_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="2_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
        <tr>
          <th><input type="number" id="3_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="3_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="3_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="3_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
        <tr>
          <th><input type="number" id="4_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="4_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="4_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="4_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
        <tr>
          <th><input type="number" id="5_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="5_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="5_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="5_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
        <tr>
          <th><input type="number" id="6_cri_a_min" value="0" min="0" onchange="cri_a_min_change(this)" title="score à partir duquel on affiche l'apréciation"/>%</th>
          <th>
            <select id="6_cri_a_coul" onChange="cri_a_coul_change(this)" title="couleur de l'apréciation et du drapeau">
              <option value="n">noir</option>
              <option value="r">rouge</option>
              <option value="j">jaune</option>
              <option value="b">bleu</option>
              <option value="v">vert</option>
              <option value="c">coupe</option>
            </select>
          </th>
          <th><input type="checkbox" id="6_cri_a_re" onChange="cri_a_re_change(this)" title="ajouter un bouton 'réessayer' sous l'apréciation"/></th>
          <th><textarea class="cri_a_txt" id="6_cri_a_txt" onChange="cri_a_txt_change(this)"></textarea></th>
        </tr>
      </table>
    </p>
    <p>
      Total des points (-1=auto) :
      <input type="number" id="cri_total" value="-1" min="-1" onchange="cri_total_change(this)" />
      arrondi <select id="cri_arrondi" onChange="cri_arrondi_change(this)"><option value="1" selected>unité</option><option value="0.5">0.5</option><option value="0.1">0.1</option><option value="0.01">0.01</option><option value="0">auncun</option></select>
      Nombre d'essais (0=infini) :
      <input type="number" id="cri_essais" value="1" min="0" onchange="cri_essais_change(this)" />
      <input type="checkbox" id="cri_show_bilan" name="cri_show_bilan" onchange="cri_show_bilan_change(this)" />
      <label for="cri_show_bilan">Afficher dans le bilan</label>
    </p>
    <p>
      <div class="cr_opt_ligne" id="ci_img_get_div">
        Image de l'exercice :
        <select id="ci_img_select" onchange="cr_img_select_change(this)" title="Si aucune image est choisie, celle du livre sera utilisée">
          <option value="" selected></option>
          <option value="****">Parcourir...</options>
          <?php
            $imgs = glob("$dos_l/img/*");
            for ($i=0; $i<count($imgs); $i++)
            {
              echo "<option value=\"".basename($imgs[$i])."\">".basename($imgs[$i])."</option>";
            }
          ?>
        </select>
        <form enctype="multipart/form-data">
          <input name="cr_img_get" type="file" id="ci_img_get" accept="image/*" onchange="cr_img_get_change(this)"/>
        </form>
        <input type="checkbox" id="cri_img_hover" name="cri_img_hover" onchange="cri_img_hover_change(this)" title="sinon, l'image sera montrée uniquement au survol de l'icone ampoule"/>
        <label for="cri_img_hover">Afficher l'image en permanence</label>
      </div>
    </p>
    <p id="cri_mod">
      Appliquer le modèle : 
      <select id="cri_mod_sel" onchange="cri_mod_sel_change(this)">
        <option value="****"></option>
        <option value="####">...Gestionnaire...</option>
        <?php
          $imgs = glob("modeles/*");
          for ($i=0; $i<count($imgs); $i++)
          {
            echo "<option value=\"".basename($imgs[$i])."\">".basename($imgs[$i])."</option>";
          }
        ?>
      </select>
      <button id="cri_mod_save" onclick="cri_mod_save(this)">Sauver comme modèle</button>
      <a id="cri_mod_gestion" href="modeles.php" target="_blank"></a>
    </p>
  </div>
  <div id="gpl"><img id="exotice" src="../../exotice.svg" /><br/><img id="gplimg" src="../../icons/gpl-v3-logo-nb.svg" /> © A. RENAUDIN 2016</div>
</body>
</html>
