const API_BASE_URL = 'http://localhost:8080/api/tasks';

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Function to create task HTML element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description || ''}</div>
            ${task.scheduledFor ? `<div class="task-schedule">Scheduled for: ${formatDate(task.scheduledFor)}</div>` : ''}
        </div>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleTaskComplete(${task.id}, ${!task.completed})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    return taskElement;
}

// Function to render tasks
function renderTasks(tasks) {
    const tasksListElement = document.getElementById('tasksList');
    tasksListElement.innerHTML = '';
    tasks.forEach(task => {
        tasksListElement.appendChild(createTaskElement(task));
    });
}

// Function to add new task
async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    const scheduledForInput = document.getElementById('scheduledFor');
    
    const task = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        scheduledFor: scheduledForInput.value ? new Date(scheduledForInput.value).toISOString() : null,
        completed: false
    };
    
    if (!task.title) {
        alert('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            titleInput.value = '';
            descriptionInput.value = '';
            scheduledForInput.value = '';
            showAllTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    }
}

// Function to toggle task completion
async function toggleTaskComplete(taskId, completed) {
    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            showAllTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task');
    }
}

// Function to delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAllTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Function to show all tasks
async function showAllTasks() {
    try {
        const response = await fetch(API_BASE_URL);
        const tasks = await response.json();
        renderTasks(tasks);
        updateActiveFilter('showAllTasks');
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks');
    }
}

// Function to show completed tasks
async function showCompletedTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/completed`);
        const tasks = await response.json();
        renderTasks(tasks);
        updateActiveFilter('showCompletedTasks');
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        alert('Failed to fetch completed tasks');
    }
}

// Function to show incomplete tasks
async function showIncompleteTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/incomplete`);
        const tasks = await response.json();
        renderTasks(tasks);
        updateActiveFilter('showIncompleteTasks');
    } catch (error) {
        console.error('Error fetching incomplete tasks:', error);
        alert('Failed to fetch incomplete tasks');
    }
}

// Function to show scheduled tasks
async function showScheduledTasks() {
    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/scheduled?start=${now.toISOString()}&end=${weekLater.toISOString()}`
        );
        const tasks = await response.json();
        renderTasks(tasks);
        updateActiveFilter('showScheduledTasks');
    } catch (error) {
        console.error('Error fetching scheduled tasks:', error);
        alert('Failed to fetch scheduled tasks');
    }
}

// Function to update active filter button
function updateActiveFilter(activeFunction) {
    const buttons = document.querySelectorAll('.filters button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').startsWith(activeFunction)) {
            button.classList.add('active');
        }
    });
}

// Load all tasks when the page loads
document.addEventListener('DOMContentLoaded', showAllTasks); 