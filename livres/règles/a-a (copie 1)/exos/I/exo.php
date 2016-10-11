<style>
[id="1"] {font-family: "sans-serif"; font-size: 2vh; color: #000000; position: absolute; left: 39.05191873589165%; top: 22.932917316692667%; padding: 2px; }
[id="2"] {font-family: "sans-serif"; font-size: 2vh; color: #000000; position: absolute; left: 30.02257336343115%; top: 72.07488299531981%; padding: 2px; }
[id="3"] {font-family: "sans-serif"; font-size: 2vh; color: #000000; position: absolute; left: 23.47629796839729%; top: 89.85959438377535%; padding: 2px; }
[id="4"] {font-family: "sans-serif"; font-size: 2vh; color: #000000; position: absolute; left: 41.309255079006775%; top: 4.212168486739469%; padding: 2px; }
</style>

<style>[id="1"] label {background-color: #ced177;} [id="1"] input[type="radio"]:checked + label {background-color: #405688;}</style>
<div class="item lignef radiobtn" tpe="radiobtn" item="1" id="1" options="#ced177|#405688" >
  <div>(Les chats sont </div>
  <form>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="0" id="rb1_1" name="1">
    <label for="rb1_1">des plantes</label>
   <br/>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="0" id="rb1_2" name="1">
    <label for="rb1_2">des oiseaux</label>
    <br/>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="1" id="rb1_3" name="1">
    <label for="rb1_3">des félins</label>
  </form>
  <div>)</div>
</div>

<div class="item lignef radio" tpe="check" item="2" id="2" >
  <div>(Les chats sont </div>
  <form>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="1" id="rb2_1" >
    <label for="rb2_1">des mamifères</label>
   <br/>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="0" id="rb2_2" >
    <label for="rb2_2">des oiseaux</label>
    <br/>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="1" id="rb2_3" >
    <label for="rb2_3">des félins</label>
  </form>
  <div>)</div>
</div>

<div class="item lignef combo" tpe="combo" item="3" id="3">
  <div>(Les chats sont </div>
  <div>
    <select itemid="3" class="exo" onchange="change(this)">
      <option value="0">--</option>
      <option value="0">des arbres</option>
      <option value="0">des oiseaux</option>
      <option value="1">des félins</option>
    </select>
    <div class="combo_corr">des félins</div>
  </div>
  <div>)</div>
</div>

<div class="item lignef texte" tpe="texte" item="4" id="4" options="0|0" >
  <div>(La souris</div>
  <div>
   <input type="text" class="exo" itemid="4" onKeyUp="change(this)" size="10">
    <div class="texte_corr">a</div>
  </div>
  <div>peur du chat)</div>
</div>

