const addBtn = document.getElementById('add-btn');
const taskTitle = document.getElementById('task-title');
const prioritySelect = document.getElementById('priority');
const taskList = document.getElementById('task-list');

addBtn.addEventListener('click', addTask);

function priorityWeight(p) {
    if (p === 'high') return 3;
    if (p === 'medium') return 2;
    return 1;

function sortTasks() {
    const items = Array.from(taskList.children);
    items.sort((a, b) => {
        const wa = priorityWeight(a.dataset.priority);
        const wb = priorityWeight(b.dataset.priority);
        if (wb !== wa) return wb - wa;
        return Number(a.dataset.timestamp) - Number(b.dataset.timestamp);
    });
    items.forEach(li => taskList.appendChild(li));
}

function addTask() {
    const title = taskTitle.value.trim();
    const priority = prioritySelect.value;

    if (title === '') {
        alert('Task title cannot be empty.');
        return;
    }

    const li = document.createElement('li');
    li.classList.add("pending", `priority-${priority}`, 'enter');
    li.dataset.priority = priority;
    li.dataset.timestamp = Date.now();

    const displayPriority = priority.charAt(0).toUpperCase() + priority.slice(1);

    li.innerHTML = `
       <div class="task-info">
            <span class="task-title">${title}</span>
            <span class="priority">[${displayPriority}]</span>
        </div>
        <button class="status-btn">Start</button>
        <button class="delete-btn"><i class="fa-solid fa-circle-xmark"></i></button>
    `;

    switch (priority) {
        case 'high':
            li.style.borderLeft = '5px solid #f44336';
            break;
        case 'medium':
            li.style.borderLeft = '5px solid #ff9800';
            break;
        case 'low':
            li.style.borderLeft = '5px solid #4caf50';
            break;
    }

    li.addEventListener('animationend', (ev) => {
        if (ev.animationName === 'enterAnim') li.classList.remove('enter');
    }, { once: true });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.style.maxHeight = li.scrollHeight + 'px';
        void li.offsetHeight;
        li.classList.add('removing');
        li.addEventListener('transitionend', () => {
            li.remove();
            sortTasks();
        }, { once: true });
    });

    const statusBtn = li.querySelector('.status-btn');
    statusBtn.addEventListener('click', () => {
        if (li.classList.contains('pending')) {
            li.classList.remove('pending');
            li.classList.add('in-progress');
            statusBtn.textContent = 'In Progress';
        } else if (li.classList.contains('in-progress')) {
            li.classList.remove('in-progress');
            li.classList.add('completed');
            statusBtn.textContent = 'Completed';
            statusBtn.disabled = true;
        }
    });

    taskList.appendChild(li);
    sortTasks();

    taskTitle.value = '';
}
