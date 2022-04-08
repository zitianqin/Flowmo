function timeToString(time) {
	let diffInHrs = time / 3600000;
	let hh = Math.floor(diffInHrs);

	let diffInMin = (diffInHrs - hh) * 60 + 60 * hh;
	let mm = Math.floor(diffInMin);

	let diffInSec = (diffInMin - mm) * 60;
	let ss = Math.floor(diffInSec);

	let formattedMM = mm.toString().padStart(2, "0");
	let formattedSS = ss.toString().padStart(2, "0");

	return `${formattedMM}:${formattedSS}`;
}

let startTime;
let elapsedTime;
let focusTime = 1500000;

function start() {
	startTime = Date.now() + focusTime;
	myInterval = setInterval(function printTime() {
	elapsedTime = startTime - Date.now();
	if (elapsedTime <= 0) {;
		stop();
		document.getElementById("timer").innerHTML = "05:00";
	}
	document.getElementById("timer").innerHTML = timeToString(elapsedTime);
	}, 25);
	
	play_or_pause_span.textContent = 'Stop';
	status_span.textContent = 'Time to focus!';
}

function stop() {
	clearInterval(myInterval);
	elapsedTime = 0;
	document.getElementById("timer").innerHTML = "05:00";
	
	play_or_pause_span.textContent = 'Start Break';
	status_span.textContent = "Let's take a break!";
	last_cmd = 2;
}

function startRest() {
	// Countdown Timer of 5 minutes.
	startTime = Date.now() + 300000;
	myInterval = setInterval(function printTime() {
	elapsedTime = startTime - Date.now();
	if (elapsedTime <= 0) {
		stopRest();
	}
	document.getElementById("timer").innerHTML = timeToString(elapsedTime);
	}, 25);
	play_or_pause_span.textContent = 'End Break';
}

function stopRest() {
	clearInterval(myInterval);
	document.getElementById("timer").innerHTML = "25:00";
	elapsedTime = 0;
	
	play_or_pause_span.textContent = 'Start';
	status_span.textContent = 'Time to focus!';
	last_cmd = 0;
}

function startStopToggle() {
	if (last_cmd == 0) {
		start();
		last_cmd = 1; 
	} else if (last_cmd == 1) {
		stopRest();
		document.getElementById("timer").innerHTML = timeToString(focusTime);
		last_cmd = 0;
	} else if (last_cmd == 2) {
		startRest();
		last_cmd = 3;
	} else if (last_cmd == 3) {
		stopRest();
		last_cmd = 0;
	}
}

let last_cmd = 0;
play_stop_btn.onclick = startStopToggle;