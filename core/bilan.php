<?php
 /*
    --En-tête officielle pour dire que ce code est sous une licence "libre" (plus d'infos: https://fr.wikipedia.org/wiki/Licence_publique_g%C3%A9n%C3%A9rale_GNU)--
    
    Copyright (C) A.RENAUDIN  Developer

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
*/

// infos sur le chemin du livre
$livreid = basename(dirname($_SERVER['PHP_SELF']));
$cat = basename(dirname(dirname($_SERVER['PHP_SELF'])));
$root = "../../..";
if ($cat == "livres")
{
  $root = "../..";
  $cat = "";
}
  
require("$root/libs/fpdf/fpdf.php");

class PDF_Rotate extends FPDF
{
var $angle=0;

function Rotate($angle,$x=-1,$y=-1)
{
    if($x==-1)
        $x=$this->x;
    if($y==-1)
        $y=$this->y;
    if($this->angle!=0)
        $this->_out('Q');
    $this->angle=$angle;
    if($angle!=0)
    {
        $angle*=M_PI/180;
        $c=cos($angle);
        $s=sin($angle);
        $cx=$x*$this->k;
        $cy=($this->h-$y)*$this->k;
        $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',$c,$s,-$s,$c,$cx,$cy,-$cx,-$cy));
    }
}

function _endpage()
{
    if($this->angle!=0)
    {
        $this->angle=0;
        $this->_out('Q');
    }
    parent::_endpage();
}
}

$user = (isset($_GET["user"])) ? $_GET["user"] : NULL;

if ($user)
{
  $v = explode("\n", file_get_contents("livre.txt"));
  $titre = $v[0];
  $auth = $v[2];
  $details = "";
  for ($i=11; $i<count($v); $i++)
  {
    if ($v[$i] != "")
    {
      if ($i > 11) $details .= "\n";
      $details .= $v[$i];
    }    
  }
  setlocale(LC_TIME, 'fr_FR.utf8','fra');
  $d = strftime("%A %e %B");
  
  // ****************en-têtes****************
  $pdf = new PDF_Rotate();
  $pdf->AddPage();
  $pdf->SetMargins(15,15);
  $pdf->SetFont('Arial','I',10);
  // on écrit les consignes
  $pdf->SetXY(80,20);
  $pdf->SetFont('Arial','B',16);
  $pdf->Cell(55,10,utf8_decode('Imprime la feuille : '), '', 0);
  $pdf->Image("$root/icons/impr.png", 135, 15);
  // on trace le cadre
  $pdf->SetXY(15,50);
  $pdf->Cell(148,210,'', 'LRBT');
  // on écrit le texte
  $pdf->SetXY(20,53);
  $pdf->SetFont('Arial','I',10);
  $pdf->Cell(74,8,utf8_decode("Prénom : $user"), '', 0);
  $pdf->Cell(64,8,utf8_decode('Bilan livret informatique'), '', 1, "R");
  $pdf->SetXY(20,58);
  $pdf->Cell(74,8,utf8_decode("Date : $d"), '', 1);
  $pdf->Image("$root/exotice.png", 76, 52);
  $pdf->SetFont('Arial','B',44);
  $pdf->Cell(148,25,utf8_decode("$titre"), '', 1, 'C');
  $pdf->SetFont('Arial','I',14);
  $pdf->MultiCell(148,8, utf8_decode("$details"), '', 'C');
  $pdf->Cell(50,10,'', '', 1);
  $pdf->SetFont('Arial','B',14);
  
  // ************scores****************
  $tx = "";
  $s = 0;
  $t = 0;
  // on récupère les scores
  $f = "$root/log_exo/$user/$livreid.txt";
  if (file_exists($f))
  {
    $logs = explode("\n", file_get_contents($f));
    // on cherche les exercices
    $exos = glob("./exos/*" , GLOB_ONLYDIR);
    for ($i=0; $i<count($exos); $i++)
    {
      $f = "$exos[$i]/exo.txt";
      if (file_exists($f))
      {
        $v = explode("\n", file_get_contents($f));
        //on vérifie que l'exercice doit être montré
        if (count($v)<13 || $v[12] == "1" || $v[12] == "")
        {
          // on lit le nom de l'exercice
          $pdf->Cell(74,10,utf8_decode("$v[0] : "), '', 0, 'R');
          // et le score si il existe
          for ($j=0; $j<count($logs); $j++)
          {
            $vv = explode("|", $logs[$j]);
            if (count($vv)>3 && basename($vv[1]) == basename($exos[$i]))
            {
              $pdf->Cell(73,10,"$vv[2]/$vv[3]", '', 0, 'L');
              $s += $vv[2];
              $t += $vv[3];
              break;
            }
          }
          $pdf->Ln();
        }
      }
    }
    $pdf->SetFont('Arial','B',20);
    $pdf->Cell(74,20,'TOTAL : ', '', 0, 'R');
    $p = ceil($s*100/$t);
    $pdf->Cell(74,20,"$s/$t ($p%)", '', 1, 'L');
  }
  else
  {
    $pdf->Cell(148,25,utf8_decode("Impossible de trouver le bilan du livre..."), '', 1, 'C');
  }
  // **************Copyright***********
  $pdf->SetFont('Arial','',10);
  $pdf->Rotate(90,20,256);
  $pdf->Text(20,256,utf8_decode("© ".$auth));
  $pdf->Rotate(0);
  
  $pdf->Output();
}
?>
