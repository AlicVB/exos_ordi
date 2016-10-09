


<div class="item ligne2 zone" tpe="zone" item="0" >
  <div>
    <div class="mv_space">&#8203;</div>
    <div class="mv_src">
      <div id="z_0_0">chat</div>
      <div id="z_0_1">ici.</div>
      <div id="z_0_2">Le</div>
      <div id="z_0_3">est</div>
    </div>
  </div>
  <br/>
  <div>
    <div class="exo mv_dest" itemid="0" ok="z_0_2"></div>
    <div class="exo mv_dest" itemid="0" ok="z_0_0"></div>
    <div class="exo mv_dest" itemid="0" ok="z_0_3"></div>
    <div class="exo mv_dest" itemid="0" ok="z_0_1"></div>
  </div>
</div>
<div class="item ligne2 zone" tpe="line" item="10" id="l00">
  <div id="l01">
    <div class="mv_space" id="l02">&#8203;</div>
    <div class="mv_src" id="l03">
      <div id="l_0_0" onmousedown="line_start(this)" itemid="10">chat</div>
      <div id="l_0_1" onmousedown="line_start(this)" itemid="10">ici.</div>
      <div id="l_0_2" onmousedown="line_start(this)" itemid="10">Le</div>
      <div id="l_0_3" onmousedown="line_start(this)" itemid="10">est</div>
    </div>
  </div>
  <br/>
  <div style="height: 8vh;" id="l04"></div>
  <div>
    <div class="exo mv_dest" itemid="10" ok="l_0_2" score="0">1</div>
    <div class="exo mv_dest" itemid="10" ok="l_0_0" score="0">2</div>
    <div class="exo mv_dest" itemid="10" ok="l_0_3" score="0">3</div>
    <div class="exo mv_dest" itemid="10" ok="l_0_1" score="0">4</div>
  </div>
</div>

<style>#rb1 label {background-color: #91A0FF;} #rb1 input[type="radio"]:checked + label {background-color: #FFF56B;}</style>
<div class="item ligne radiobtn" tpe="radiobtn" item="1" id="rb1" options="rgb(145, 160, 255)|rgb(255, 245, 107)" >
  <div>Les chats sont </div>
  <form>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="0" id="rb1_1" name="1">
    <label for="rb1_1">des arbres</label>
   <br/>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="0" id="rb1_2" name="1">
    <label for="rb1_2">des oiseaux</label>
    <br/>
    <input type="radio" itemid="1" class="exo" onclick="change(this)" value="1" id="rb1_3" name="1">
    <label for="rb1_3">des félins</label>
  </form>
  <div>uops !</div>
</div>

<div class="item ligne radio" tpe="check" item="2" id="rb2" >
  <div>Les chats sont </div>
  <form>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="1" id="rb2_1" >
    <label for="rb2_1">des mamifères</label>
   <br/>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="0" id="rb2_2" >
    <label for="rb2_2">des arbres</label>
   <br/>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="0" id="rb2_3" >
    <label for="rb2_3">des oiseaux</label>
    <br/>
    <input type="checkbox" itemid="2" class="exo" onclick="change(this)" value="1" id="rb2_4" >
    <label for="rb2_4">des félins</label>
  </form>
  <div>uops !</div>
</div>

<div class="item ligne combo" tpe="combo" item="3">
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
  <div>allez !</div>
</div>

<div class="item ligne texte" tpe="texte" item="4">
  <div>La souris</div>
  <div>
   <input type="text" class="exo" itemid="4" onKeyUp="change(this)" size="10">
    <div class="texte_corr">a</div>
  </div>
  <div>peur du chat</div>
</div>

<div class="item ligne texte" tpe="texte" item="5">
  <div style="width: 100%;">
  <div>La fille est jolie...</div>
  <div>
   <textarea rows="2" class="exo" itemid="5" onKeyUp="change(this)" style="box-sizing: border-box; width:100%;"></textarea>
    <div class="texte_corr">La fille est jolie...</div>
  </div>
  <div>peur du chat</div>
  </div>
</div>

<div class="item ligne2 multi" tpe="multi" item="6" options="rgb(0, 255, 26)|rgb(255, 0, 8)">
  <span class="exo" itemid="6" onclick="change(this)" juste="1" >Le chat</span>
  <span class="exo" itemid="6" onclick="change(this)" juste="2" >mange</span>
  <span class="exo" itemid="6" onclick="change(this)" >les souris.</span>
  <img class="multi_cim" />
  <span class="item texte" tpe="texte" item="8">
    <span>Infinitif :</span>
    <span>
     <input type="text" class="exo" itemid="8" onKeyUp="change(this)" size="10">
      <span class="texte_corr">manger</span>
    </span>
  </span>
  <br/>
  <span class="multi_corr" itemid="6">
    <span style="background-color: #00FF1A;" >Le chat</span>
    <span style="background-color: #FF0008;" >mange</span>
    <span>les souris.</span>
  </span>
</div>

<div class="item ligne2 multi" tpe="multi" item="7" options="rgb(97, 213, 255)">
  <span class="exo" itemid="7" onclick="change(this)" >Le chat</span>
  <span class="exo" itemid="7" onclick="change(this)" juste="1" >mange</span>
  <span class="exo" itemid="7" onclick="change(this)" >les souris.</span>
  <img class="multi_cim" />
  <br/>
 <span class="multi_corr" itemid="7" >Le chat</span>
 <span class="multi_corr" itemid="7" style="background-color: #61D5FF;" >mange</span>
 <span class="multi_corr" itemid="7" >les souris.</span>
</div>
