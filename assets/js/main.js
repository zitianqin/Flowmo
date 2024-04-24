const Command = Object.freeze({
  START: 0,
  STOP: 1,
  START_REST: 2,
  STOP_REST: 3
});

const playStopBtn = document.getElementById('play-stop-btn');
const playPauseText = document.getElementById('play-pause-text');
const statusSpan = document.getElementById('status-span');

let startTime = 0;
let elapsedTime = 0;
let focusTime = 0;
let lastCmd = Command.START;

function timeToString(time) {
  // Calculate hours, minutes, and seconds
  const hh = Math.floor(time / 3600000);
  const mm = Math.floor((time % 3600000) / 60000);
  const ss = Math.floor((time % 60000) / 1000);

  // Format the components to two digits
  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");

  // Construct the formatted time string based on the duration
  return hh > 0 ? `${formattedHH}:${formattedMM}:${formattedSS}` : `${formattedMM}:${formattedSS}`;
}

function start() {
    startTime = Date.now();
    myInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = timeToString(elapsedTime);
    focusTime = elapsedTime / 5;
	}, 1000);
	
	playPauseText.textContent = 'Stop';
	statusSpan.textContent = 'Time to focus!';
}

function stop() {
  clearInterval(myInterval);
  document.getElementById("timer").innerHTML = "00:00";
  elapsedTime = 0;

  playPauseText.textContent = 'Start Break';
  statusSpan.textContent = "Let's take a break!";
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
  }, 25);
  playPauseText.textContent = 'End Break';
}

function stopRest() {
  clearInterval(myInterval);
  document.getElementById("timer").innerHTML = "00:00";
  elapsedTime = 0;

  playPauseText.textContent = 'Start';
  statusSpan.textContent = 'Time to focus!';
  lastCmd = 0;
}

function startStopToggle() {
  switch (lastCmd) {
    case Command.START:
      start();
      lastCmd = Command.STOP;
      break;
    case Command.STOP:
      stop();
      document.getElementById("timer").innerHTML = timeToString(focusTime);
      lastCmd = Command.START_REST;
      break;
    case Command.START_REST:
      startRest();
      lastCmd = Command.STOP_REST;
      break;
    case Command.STOP_REST:
      stopRest();
      lastCmd = Command.START;
      break;
    default:
      console.error("Unexpected command");
      break;
  }
}

playStopBtn.onclick = startStopToggle;