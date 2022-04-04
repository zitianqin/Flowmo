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
let focusTime;

function start() {
	startTime = Date.now();
	myInterval = setInterval(function printTime() {
	elapsedTime = Date.now() - startTime;
	document.getElementById("timer").innerHTML = timeToString(elapsedTime);
	focusTime = elapsedTime / 5;
	}, 100);
	
	play_or_pause_span.textContent = 'Stop';
	status_span.textContent = 'Time to focus!';
}

function stop() {
	clearInterval(myInterval);
	document.getElementById("timer").innerHTML = "00:00";
	elapsedTime = 0;
	
	play_or_pause_span.textContent = 'Start Break';
	status_span.textContent = "Let's take a break!";
}

function startRest() {
	// Countdown Timer of 1/5th of study time.
	startTime = Date.now() + focusTime;
	myInterval = setInterval(function printTime() {
	elapsedTime = startTime - Date.now();
	if (elapsedTime <= 0) {
		stopRest();
	}
	document.getElementById("timer").innerHTML = timeToString(elapsedTime);
	}, 100);
	play_or_pause_span.textContent = 'End Break';
}

function stopRest() {
	clearInterval(myInterval);
	document.getElementById("timer").innerHTML = "00:00";
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
		stop();
		document.getElementById("timer").innerHTML = timeToString(focusTime);
		last_cmd = 2;
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