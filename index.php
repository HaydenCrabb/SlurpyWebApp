<!DOCTYPE html>
<html>
<head>
	<title>Slurpy</title>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>
<body id="main">
	<div class="playingField" id="playingField">
		<div class="player" id="player"></div>
		<div class="upgrade" id="upgrade"></div>
	</div>
	<p id="points" style="margin-left: 20px;">Points: 0</p>
	<form>
		<select id="selector" onchange="changeDifficulty()">
			<option value="easy">Easy</option>
			<option value="medium" selected="selected">Medium</option>
			<option value="hard">Nancy Drew</option>
		</select>
	</form>
	<?php
		$datafile = fopen("data.txt", "r+");
		$highscore = fgets($datafile);
		echo "<p id=\"highScore\" class=\"highScore\">HighScore: " . $highscore . "</p>";
		fclose($datafile);
	?>
	<script type="text/javascript" src="javascript.js"></script>
</body>
</html>