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
let timeoutId;

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
  }, 1000);

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

function uid() {
  const timestamp = Date.now();
  const uniqueId = timestamp;

  return uniqueId.toString();
}

window.onload = function() {
  const navbar = document.querySelector('.navbar');

  // Hide the navbar after 10 seconds
  timeoutId = setTimeout(function() {
    navbar.classList.remove('navbar-show');
    navbar.classList.add('navbar-hidden');
  }, 20000);

  // When the mouse enters the navbar, clear the timeout and show the navbar
  navbar.addEventListener('mouseenter', function() {
    clearTimeout(timeoutId);
    navbar.classList.remove('navbar-hidden');
    navbar.classList.add('navbar-show');
  });

  // When the mouse leaves the navbar, set the timeout and hide the navbar after 10 seconds
  navbar.addEventListener('mouseleave', function() {
    timeoutId = setTimeout(function() {
      navbar.classList.remove('navbar-show');
      navbar.classList.add('navbar-hidden');
    }, 20000);
  });
};

document.getElementById('new-task-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const taskInput = document.getElementById('new-task-input');
  const taskText = taskInput.value;

  if (!taskText.trim()) {
    alert('Task cannot be empty');
    return;
  }

  const taskElement = document.createElement('li');

  // Add a "Complete" button to each task
  const completeButton = document.createElement('button');
  completeButton.classList.add('btn'); // Add Bootstrap classes here
  completeButton.innerHTML = '<i class="bi bi-check-lg round-btn"></i>'; // Use Bootstrap icon
  completeButton.addEventListener('click', function() {
    // Toggle the 'completed' class on the clicked task
    taskElement.classList.toggle('completed');
  });
  taskElement.appendChild(completeButton);

  // Create a div to hold the task text
  const taskTextDiv = document.createElement('p');
  taskTextDiv.style.display = 'inline-block';

  // Append the task text as a separate text node
  const taskTextNode = document.createTextNode(taskText);
  taskTextDiv.appendChild(taskTextNode);

  // Append the div to the task element
  taskElement.appendChild(taskTextDiv);

  // Add a "Select" button to each task
  const selectButton = document.createElement('button');
  selectButton.classList.add('btn'); // Add Bootstrap classes here
  selectButton.innerHTML = '<i class="bi bi-hand-index-thumb round-btn"></i>'; // Use Bootstrap icon
  selectButton.addEventListener('click', function() {
    // If the task is already selected, deselect it
    if (taskElement.classList.contains('selected')) {
      taskElement.classList.remove('selected');
      localStorage.removeItem('selectedTask');
    } else {
      // Otherwise, deselect all tasks and select the clicked one
      const tasks = document.querySelectorAll('#task-list li');
      tasks.forEach(function(task) {
        task.classList.remove('selected');
      });

      taskElement.classList.add('selected');
      localStorage.setItem('selectedTask', uid());
    }
  });
  taskElement.appendChild(selectButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn'); // Add Bootstrap classes here
  deleteButton.innerHTML = '<i class="bi bi-trash round-btn"></i>'; // Use Bootstrap icon
  deleteButton.addEventListener('click', function() {
    taskElement.remove();
  });
  taskElement.appendChild(deleteButton);

  document.getElementById('task-list').appendChild(taskElement);
    // Clear the input field
    taskInput.value = '';
});

playStopBtn.onclick = startStopToggle;