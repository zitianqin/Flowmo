const Command = Object.freeze({
  START: 0,
  STOP: 1,
  START_REST: 2,
  STOP_REST: 3
});

const playStopBtn = document.getElementById('play-stop-btn');
const playPauseText = document.getElementById('play-pause-text');
const statusSpan = document.getElementById('status-span');
const taskInput = document.getElementById('new-task-input');
const timer = document.getElementById("timer");

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

  if (hh > 0) {
    // Change the font size of the timer based on the number of digits
    if (window.matchMedia("(max-width: 700px)").matches && window.matchMedia("(min-width: 600px)").matches) {
      timer.style.fontSize = "6rem";
    } else if (window.matchMedia("(max-width: 600px)").matches && window.matchMedia("(min-width: 400px)").matches) {
      timer.style.fontSize = "4.5rem";
    } else if (window.matchMedia("(max-width: 400px)").matches) {
      timer.style.fontSize = "3rem";
    } else if (window.matchMedia("(max-width: 810px)").matches) {
      timer.style.fontSize = "7rem";
    } else {
      timer.style.fontSize = "8rem";
    }
  }

  // Construct the formatted time string based on the duration
  return hh > 0 ? `${formattedHH}:${formattedMM}:${formattedSS}` : `${formattedMM}:${formattedSS}`;
}

function start() {
    startTime = Date.now();
    myInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    timer.innerHTML = timeToString(elapsedTime);
    focusTime = elapsedTime / 5;
	}, 1000);
	
	playPauseText.textContent = 'Stop';
	statusSpan.textContent = 'Time to focus!';
}

function stop() {
  clearInterval(myInterval);
  timer.innerHTML = "00:00";
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
    timer.innerHTML = timeToString(elapsedTime);
  }, 1000);

  playPauseText.textContent = 'End Break';
}

function stopRest() {
  clearInterval(myInterval);
  timer.innerHTML = "00:00";
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
      timer.innerHTML = timeToString(focusTime);
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

// Save tasks to localStorage whenever a task is created or moved
function saveTasks() {
  ['task-list', 'completed-task-list'].forEach(function(listId) {
    const tasks = Array.from(document.getElementById(listId).children).map(function(taskElement) {
      return {
        id: taskElement.id,
        text: taskElement.querySelector('p').textContent,
        completed: taskElement.classList.contains('completed'),
        selected: taskElement.classList.contains('selected')
      };
    });
    localStorage.setItem(listId, JSON.stringify(tasks));
  });
}

// Add event listeners for drag and drop to each task element
function addDragAndDrop(taskElement) {
  taskElement.draggable = true;

  taskElement.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text/plain', this.id);
  });

  taskElement.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = 'gray';
  });

  taskElement.addEventListener('dragleave', function(e) {
    this.style.backgroundColor = '';
  });

  taskElement.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
  
    // Check if the dragged element was originally above or below the drop target
    if (draggedElement.offsetTop < this.offsetTop) {
      // If the dragged element was originally above, insert it below the drop target
      this.parentNode.insertBefore(draggedElement, this.nextSibling);
    } else {
      // If the dragged element was originally below, insert it above the drop target
      this.parentNode.insertBefore(draggedElement, this);
    }
  
    // Check which list the task is dropped into
    if (this.parentNode.id === 'completed-task-list') {
      // If the task is dropped into the completed tasks list, mark it as complete
      draggedElement.classList.add('completed');
    } else if (this.parentNode.id === 'task-list') {
      // If the task is dropped into the active tasks list, mark it as incomplete
      draggedElement.classList.remove('completed');
    }

    saveTasks();
  });
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

// Create a new task element
function createTaskElement(id, text, completed) {
  const taskElement = document.createElement('li');
  taskElement.id = id;

  // Add a "Complete" button to each task
  const completeButton = document.createElement('button');
  completeButton.classList.add('btn');
  completeButton.innerHTML = '<i class="bi bi-check-lg round-btn"></i>';

  completeButton.addEventListener('click', function(event) {
    event.stopPropagation();
    
    // Toggle the 'completed' class on the clicked task
    taskElement.classList.toggle('completed');

    // If the task is selected and completed, deselect it
    if (taskElement.classList.contains('completed') && taskElement.classList.contains('selected')) {
      taskElement.classList.remove('selected');
      document.getElementById('selected-task').textContent = 'No task selected';
    }

    if (taskElement.classList.contains('completed')) {
      document.getElementById('completed-task-list').appendChild(taskElement);
    } else {
      document.getElementById('task-list').appendChild(taskElement);
    }

    saveTasks();
  });

  taskElement.appendChild(completeButton);

  // Create a div to hold the task text
  const taskTextDiv = document.createElement('p');
  taskTextDiv.style.display = 'inline-block';

  // Append the task text as a separate text node
  const taskTextNode = document.createTextNode(text);
  taskTextDiv.appendChild(taskTextNode);

  // Append the div to the task element
  taskElement.appendChild(taskTextDiv);

  // Add a "Select" event to the entire task element
  taskElement.addEventListener('click', function(event) {
    event.stopPropagation();

    // If the task is already completed, ignore it
    if (taskElement.classList.contains('completed')) {
      return;
    }

    // If the task is already selected, deselect it
    if (taskElement.classList.contains('selected')) {
      taskElement.classList.remove('selected');
      document.getElementById('selected-task').textContent = 'No task selected';
    } else {
      // Otherwise, deselect all tasks and select the clicked one
      const tasks = document.querySelectorAll('#task-list li');
      tasks.forEach(function(task) {
        task.classList.remove('selected');
      });

      taskElement.classList.add('selected');
      document.getElementById('selected-task').textContent = taskElement.querySelector('p').textContent;
    }

    saveTasks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn');
  deleteButton.innerHTML = '<i class="bi bi-x-lg round-btn"></i>';
  deleteButton.addEventListener('click', function(event) {
    event.stopPropagation();
    
    if (taskElement.classList.contains('selected')) {
      taskElement.classList.remove('selected');
      document.getElementById('selected-task').textContent = 'No task selected';
    }

    taskElement.remove();
    saveTasks();
  });
  taskElement.appendChild(deleteButton);

  addDragAndDrop(taskElement);

  if (completed) {
    taskElement.classList.add('completed');
  }

  return taskElement;
}

document.getElementById('new-task-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const taskInput = document.getElementById('new-task-input');
  const taskText = taskInput.value;

  if (!taskText.trim()) {
    alert('Task cannot be empty');
    return;
  }

  if (taskText.length > 100) {
    alert('Task name cannot be over 100 characters!');
    return;
  }

  const taskElement = createTaskElement(uid(), taskText, false);
  document.getElementById('task-list').appendChild(taskElement);

  saveTasks();

  // Clear the input field
  taskInput.value = '';
});

document.getElementById('clear-completed-tasks-btn').addEventListener('click', function() {
  const completedTasks = document.querySelectorAll('#completed-task-list li');
  completedTasks.forEach(function(task) {
    task.remove();
  });

  saveTasks();
});

// Load tasks from localStorage when the page is loaded
window.addEventListener('DOMContentLoaded', function() {
  let selectedTaskElement = null;

  ['task-list', 'completed-task-list'].forEach(function(listId) {
    const tasks = JSON.parse(localStorage.getItem(listId) || '[]');
    tasks.forEach(function(task) {
      const taskElement = createTaskElement(task.id, task.text, task.completed);
      if (task.selected) {
        taskElement.classList.add('selected');
        selectedTaskElement = taskElement;
      }
      document.getElementById(listId).appendChild(taskElement);
    });
  });

  // Update selected task text in timer container
  if (selectedTaskElement) {
    document.getElementById('selected-task').textContent = selectedTaskElement.querySelector('p').textContent;
  } else {
    document.getElementById('selected-task').textContent = 'No task selected';
  }
});

taskInput.setAttribute('maxlength', '100');
playStopBtn.onclick = startStopToggle;