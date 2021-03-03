<?php

$points = $_GET["points"];
$walls = $_GET["walls"];

$datafile = fopen("data.txt", "r+");

$highscore = fgets($datafile);
if ($points > (int)$highscore)
{
	rewind($datafile);
	fwrite($datafile, $points . "\n");
}

fclose($datafile);
$datafile = fopen("data.txt", "a");
fwrite($datafile, "\n" . $points . "," . $walls);
	

header("location: /");