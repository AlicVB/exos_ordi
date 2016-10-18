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
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Création d'exercice</title>
  <link rel="stylesheet" href="exo.css">
  <link rel="stylesheet" href="base_exos.css">
  <script type="text/javascript" src="../../libs/interact.min.js"></script>
  <script type="text/javascript" src="../../libs/jscolor.min.js"></script>
  
  <script type="text/javascript" src="exo.js"></script>
  <script type="text/javascript" src="evt.js"></script>
</head>

<body onload="start('<?php echo "$dos_e"; ?>')">
  <div id="cr_panel1">
    <div id="cr_tab_div">
      <div class="cr_tab_btn" id="cr_tab_info" onclick="cr_tab_click(this)">Informations</div>
      <div class="cr_tab_btn" id="cr_tab_create" onclick="cr_tab_click(this)">Blocs</div>
    </div>
    <div class="cr_pa1" id="cr_pa_info">
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
        <input type="number" id="cri_essais" value="1" min="0" onKeyUp="cri_essais_change(this)" />
      </p>
    </div>
    <div class="cr_pa1" id="cr_pa_create">
      <div id="cr_btn_div">
        <img class="cr_btn" src="icons/radio.svg" onclick="radio_new()" title="un seul choix possible (ronds)"/>
        <img class="cr_btn" src="icons/radiobtn.svg" onclick="radiobtn_new()" title="un seul choix possible (boutons)"/>
        <img class="cr_btn" src="icons/check.svg" onclick="check_new()" title="cases à cocher"/>
        <img class="cr_btn" src="icons/combo.svg" onclick="combo_new()" title="liste déroulante"/>
        <button onclick="texte_new()">zone de texte</button>
        <button onclick="multi_new()">boutons multi-positions</button>
        <button onclick="cible_new()">zone cible</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onclick="image_new()">image</button>
        <button onclick="texte_simple_new(false)">texte</button>
        <button onclick="audio_new()">audio</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button onclick="texte_simple_new(true)">rectangle</button>
        <button onclick="cercle_new()">cercle</button>
        <button onclick="ligne_new()">ligne</button>
      </div>
      <div id="cr_nom">
        élément sélectionné :&nbsp;
        <span id="cr_selection"></span>
      </div>
      <div class="cr_opt_full">
        <div id="cr_expl">
          &nbsp;
        </div>
        <div id="cr_txt_ini_div">
          <input class="cr_long" type="text" id="cr_txt_ini" />
          <img id="cr_new_txt" src="../../icons/go-next.svg" onclick="cr_new_txt_click(this)" />
        </div>
        <div id="cr_img_get_div">
          <select id="cr_img_select" onchange="cr_img_select_change(this)">
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
            <input name="cr_img_get" type="file" id="cr_img_get" accept="image/*" onchange="cr_img_get_change(this)"/>
          </form>
        </div>
        <div id="cr_audio_get_div">
          <select id="cr_audio_select" onchange="cr_audio_select_change(this)">
            <option value="" selected></option>
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
            <input name="cr_audio_get" type="file" id="cr_audio_get" accept="audio/*" onchange="cr_audio_get_change(this)"/>
          </form>
        </div>
        
      </div>
      <div>
        <div class="cr_opt">
          <div>
            <div style="text-align: center;"><b>Options</b></div>
            <div class="cr_coul">Nombre de positions :
              <select id="cr_coul_nb" onChange="cr_coul_nb_change(this, 'true')"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>
            </div>
            <div class="cr_coul" id="cr_div_coul1">Couleur1
              <input class="jscolor {hash:true, onFineChange: 'cr_coul_change(this)'}" type="text" id="cr_coul1" value="#00ff00" />
            </div>
            <div class="cr_coul" id="cr_div_coul2">Couleur2
              <input class="jscolor {hash:true, onFineChange: 'cr_coul_change(this)'}" type="text" id="cr_coul2" value="#ff0000" />
            </div>
            <div class="cr_coul" id="cr_div_coul3">Couleur3
              <input class="jscolor {hash:true, onFineChange: 'cr_coul_change(this)'}" type="text" id="cr_coul3" value="#0000ff" />
            </div>
            <div class="cr_coul" id="cr_div_coul4">Couleur4
              <input class="jscolor {hash:true, onFineChange: 'cr_coul_change(this)'}" type="text" id="cr_coul4" value="#ffff00" />
            </div>
            <div class="cr_coul" id="cr_div_coul5">Couleur5
              <input class="jscolor {hash:true, onFineChange: 'cr_coul_change(this)'}" type="text" id="cr_coul5" value="#00ffff" />
            </div>
            <div id="cr_texte_div">
              Largeur (0=infini) :
              <input type="text" size="3" id="cr_texte_l" value="5" onchange="cr_texte_change(this)" title="nombre de charactères maxi" />
              <br/>Hauteur :
              <input type="text" size="3" id="cr_texte_h" value="1" onchange="cr_texte_change(this)" title="nombre de lignes" />
              <br/>Retour à la ligne :
              <select id="cr_texte_e" onchange="cr_texte_change(this)"><option value="1" selected>autorisé</option><option value="0">interdit</option></select>
              <br/>Comparaison :
              <select id="cr_texte_c" onchange="cr_texte_change(this)"><option value="0" selected>strict</option><option value="1">Sans Maj. au début</option><option value="2">Sans Maj.</option></select>
            </div>
          </div>
        </div>
        <div class="cr_opt">
        <div>
          <div class="cr_opt_ligne cr_font">
            Police :
            <select class="cr_" id="cr_font_fam" onchange="cr_font_fam_change(this)" title="nom de la police">
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="monospace">Mono</option>
              <option value="handfont">handfont</option>
              <option value="staypuft">Staypuf</option>
              <option value="ABC cursive">ABCcursive</option>
            </select>
            <input class="cr_" id="cr_font_size" type="number" value="20" min="1" max="800" onchange="cr_font_size_change(this)" title="taille de la police (initial=20)"/>
            <button id="cr_font_coul" class="cr_ jscolor {valueElement:null,value:'000000', onFineChange: 'cr_font_coul_change(this)'}" title="couleur de la police"></button>
            <input class="cr_" type="checkbox" id="cr_font_g" onchange="cr_font_g_change(this)"/>
            <label for="cr_font_g" style="font-weight: bold;" title="gras">G</label>
            <input class="cr_" type="checkbox" id="cr_font_i" onchange="cr_font_i_change(this)"/>
            <label for="cr_font_i" style="font-style: italic;" title="italique">I</label>
            <input class="cr_" type="checkbox" id="cr_font_s" onchange="cr_font_s_change(this)"/>
            <label for="cr_font_s" style="text-decoration: underline;" title="souligné (exclu barré)">S</label>
            <input class="cr_" type="checkbox" id="cr_font_b" onchange="cr_font_b_change(this)"/>
            <label for="cr_font_b" style="text-decoration: line-through;" title="barré (exclu souligné)">B</label>
          </div>
          <div class="cr_opt_ligne">
            Taille :
            <input class="cr_" id="cr_tp_w" type="number" value="20" min="0" max="500" onchange="cr_tp_w_change(this)" title="largeur"/>
            x
            <input class="cr_" id="cr_tp_h" type="number" value="20" min="0" max="700" onchange="cr_tp_h_change(this)" title="hauteur"/>
            &nbsp;&nbsp;Position : <input id="cr_tp_l" type="number" value="20" min="0" max="500" onchange="cr_tp_l_change(this)" title="position horizontale"/>
            x
            <input class="cr_" id="cr_tp_t" type="number" value="20" min="0" max="700" onchange="cr_tp_t_change(this)" title="position verticale"/>
            &nbsp;&nbsp;Rotation : <input id="cr_tp_r" type="number" value="0" min="-180" max="180" onchange="cr_tp_r_change(this)" title="rotation de l'objet"/>
          </div>
          <div class="cr_opt_ligne">
            Bordure :
            <select class="cr_" id="cr_bord" onchange="cr_bord_change(this)" title="type de bordure">
              <option value="hidden">Aucune</option>
              <option value="solid">Normale</option>
              <option value="dashed">Tirets</option>
              <option value="dotted">Points</option>
              <option value="double">Double</option>
            </select>
            <input class="cr_" id="cr_bord_size" type="number" value="1" min="1" max="800" onchange="cr_bord_size_change(this)" title="épaisseur de la bordure"/>
            <button id="cr_bord_coul" class="cr_ jscolor {valueElement:null,value:'000000', onFineChange: 'cr_bord_coul_change(this)'}" title="couleur de la bordure"></button>
            &nbsp;arrondi;
            <input class="cr_" id="cr_bord_rond" type="number" value="0" min="0" max="500" onchange="cr_bord_rond_change(this)" title="arrondi de la bordure"/>
          </div>
          <div class="cr_opt_ligne">
            Fond :
            <button id="cr_fond_coul" class="cr_ jscolor {valueElement:null,value:'ffffff', onFineChange: 'cr_fond_coul_change(this)'}"  title="couleur de fond"></button>
            <input class="cr_" id="cr_fond_alpha" type="number" value="0" min="0" max="100" onchange="cr_fond_alpha_change(this)" title="opacité (100 = opaque)"/>%
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Marges :
            <input class="cr_" id="cr_marges" type="number" value="0" min="0" max="500" onchange="cr_marges_change(this)" title="marges intérieures"/>
          </div>
          <div class="cr_opt_ligne">
            Autre :
            <textarea id="cr_css" title="autres valeurs (syntaxe css)"></textarea>
          </div>
        </div>
        <div>
          <div class="cr_opt_ligne">
            Interaction :
            <div>
              <input type="radio" value="0" name="cr_inter" id="cr_inter_0" checked="true" onchange="cr_inter_change(this)"/>
              <label for="cr_inter_0">Aucune</label>
              <br/>
              <input type="radio" value="1" name="cr_inter" id="cr_inter_1" onchange="cr_inter_change(this)" title="Cet élément peut être relié avec un autre."/>
              <label for="cr_inter_1" title="Cet élément peut être relié avec un autre.">Relier</label>
              <br/>
              <input type="radio" value="2" name="cr_inter" id="cr_inter_2" onchange="cr_inter_change(this)" title="Autoriser l'élément à être déplacé sur une zone cible"/>
              <label for="cr_inter_2" title="Autoriser l'élément à être déplacé sur une zone cible">Déplacer</label>
            </div>
            avec
            <input type="text" value="" id="cr_relie_id" onchange="cr_relie_id_change(this)" size="8" title="identifiant des autres éléments séparés par '|'"/>
          </div>
          <div class="cr_opt_ligne">
            nombre de points de l'item :
            <input id="cr_points" type="number" value="1" min="0" max="50" onchange="cr_points_change(this)" title="nombre de points de l'item"/>
          </div>
        </div>
        <div>
          Code html :<br/>
          <textarea id="cr_html"></textarea>
        </div>
      </div>
      </div>
    </div>
  </div>
  <div id="cr_panel2">
    <div id="cr_rendu" onmousedown="bloc_mousedown(this, event)"></div>
    <select id="cr_aligne" onchange="cr_aligne_change(this)" disabled>
      <option value="-1">Alignement...</option>
      <option value="-2">--horizontal--</option>
      <option value="1">gauche</option>
      <option value="2">centré</option>
      <option value="3">droite</option>
      <option value="-3">--vertical--</option>
      <option value="4">haut</option>
      <option value="5">centré</option>
      <option value="6">bas</option>
    </select>
    <select id="cr_repart" onchange="cr_repart_change(this)" disabled>
      <option value="-1">Répartition...</option>
      <option value="1">horizontale</option>
      <option value="2">verticale</option>
    </select>
    <select id="cr_plan" onchange="cr_plan_change(this)" disabled>
      <option value="-1">Ordre...</option>
      <option value="1">premier plan</option>
      <option value="2">arrière plan</option>
      <option value="3">avancer</option>
      <option value="4">reculer</option>
    </select>
    <select id="cr_action" onchange="cr_action_change(this)" disabled>
      <option value="-1">Action...</option>
      <option value="1">dupliquer</option>
      <option value="2">supprimer</option>
    </select>
    <br/><br/>
    <button id="cr_sauve" onClick="g_exporter();">Créer l'exercice</button>
    <br><a href="../livre.php?cat=<?php echo $cat ?>&livre=<?php echo $livre ?>">Retour au livre</a>
  </div>
</body>
</html>
