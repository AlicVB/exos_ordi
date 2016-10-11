<?php
// infos sur le chemin du livre
$livreid = basename(dirname($_SERVER['PHP_SELF']));
$cat = basename(dirname(dirname($_SERVER['PHP_SELF'])));
$root = "../../..";
if ($cat == "livres")
{
  $root = "../..";
  $cat = "";
}
  
require("$root/fpdf/fpdf.php");

$user = (isset($_GET["user"])) ? $_GET["user"] : NULL;

if ($user)
{
  $v = explode("\n", file_get_contents("livre.txt"));
  $titre = $v[0];
  $details = "";
  for ($i=11; $i<count($v); $i++)
  {
    if ($v[$i] != "")
    {
      if ($i > 11) $details .= "\n";
      $details .= $v[$i];
    }    
  }
  
  // ****************en-têtes****************
  $pdf = new FPDF();
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
  $pdf->SetXY(20,55);
  $pdf->SetFont('Arial','I',10);
  $pdf->Cell(74,8,utf8_decode("Prénom : $user"), '', 0);
  $pdf->Cell(64,8,utf8_decode('Bilan livret informatique'), '', 1, "R");
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
        // on lit le nom de l'exercice
        $v = explode("\n", file_get_contents($f));
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
    $pdf->SetFont('Arial','B',20);
    $pdf->Cell(74,20,'TOTAL : ', '', 0, 'R');
    $p = ceil($s*100/$t);
    $pdf->Cell(74,20,"$s/$t ($p%)", '', 1, 'L');
  }
  else
  {
    $pdf->Cell(148,25,utf8_decode("Impossible de trouver le bilan du livre..."), '', 1, 'C');
  }
  
  $pdf->Output();
}
?>
