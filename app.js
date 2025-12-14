const addBtn = document.getElementById('add-btn');
const taskTitle = document.getElementById('task-title');
const prioritySelect = document.getElementById('priority');
const taskList = document.getElementById('not-started-list');
const inProgressList = document.getElementById('in-progress-list');
const completedList = document.getElementById('completed-list');

addBtn.addEventListener('click', addTask);

function priorityWeight(p) {
    if (p === 'high') return 3;
    if (p === 'medium') return 2;
    return 1;
}

function sortTasks() {
    const itemsOne = Array.from(taskList.children);
    itemsOne.sort((a, b) => {
        const wa = priorityWeight(a.dataset.priority);
        const wb = priorityWeight(b.dataset.priority);
        if (wb !== wa) return wb - wa;
        return Number(a.dataset.timestamp) - Number(b.dataset.timestamp);
    });
    const itemsTwo = Array.from(inProgressList.children);
    itemsTwo.sort((c, d) => {
        const wc = priorityWeight(c.dataset.priority);
        const wd= priorityWeight(d.dataset.priority);
        if (wd !== wc) return wd - wc;
        return Number(c.dataset.timestamp) - Number(d.dataset.timestamp);
    });
    const itemsThree = Array.from(completedList.children);
    itemsThree.sort((e, f) => {
        const we = priorityWeight(e.dataset.priority);
        const wf = priorityWeight(f.dataset.priority);
        if (wf !== we) return wf - we;
        return Number(e.dataset.timestamp) - Number(f.dataset.timestamp);
    });
    itemsOne.forEach(li => taskList.appendChild(li));
    itemsTwo.forEach(li => inProgressList.appendChild(li));
    itemsThree.forEach(li => completedList.appendChild(li));
}

function updatePieChart() {
    const notStartedCount = taskList.children.length;
    const inProgressCount = inProgressList.children.length;
    const completedCount = completedList.children.length;
    const totalCount = notStartedCount + inProgressCount + completedCount;
    const pieChart = document.querySelector('.pie-chart');
    const text = document.querySelector('.chart-center-text');

    if (totalCount === 0) {
        pieChart.style.background = '#333';
        text.textContent = '0%';
        return;
    }

    const notStartedPercent = Math.round((notStartedCount / totalCount) * 100);
    const inProgressPercent = Math.round((inProgressCount / totalCount) * 100);
    const completedPercent = 100 - notStartedPercent - inProgressPercent;

    if (pieChart) {
        pieChart.style.background = `conic-gradient(
            #00b4d8 0% ${notStartedPercent}%,
            #0077ba ${notStartedPercent}% ${notStartedPercent + inProgressPercent}%,
            #03045e ${notStartedPercent + inProgressPercent}% 100%
        )`;
    }

    if (text) {
        text.textContent = `${completedPercent}% Completed • ${inProgressPercent}% In Progress • ${notStartedPercent}% Not Started`;
    }
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
            updatePieChart();
        }, { once: true });
    });

    const statusBtn = li.querySelector('.status-btn');
    statusBtn.addEventListener('click', () => {
        if (li.classList.contains('pending')) {
            li.classList.remove('pending');
            li.classList.add('task-in-progress');
            statusBtn.textContent = 'In Progress';
            updateTaskLocation();
            updatePieChart();
        } else if (li.classList.contains('task-in-progress')) {
            li.classList.remove('task-in-progress');
            li.classList.add('task-completed');
            statusBtn.textContent = 'Completed';
            statusBtn.disabled = true;
            updateTaskLocation();
            updatePieChart();
        }
    });

    function updateTaskLocation() {
        if (li.classList.contains('pending')) {
            taskList.appendChild(li);
            sortTasks();
            updatePieChart();
        }
        else if (li.classList.contains('task-in-progress')) {
            inProgressList.appendChild(li);
            sortTasks();
            updatePieChart();
        }
        else if (li.classList.contains('task-completed')) {
            completedList.appendChild(li);
            sortTasks();
            updatePieChart();
        }
    }

    

    updateTaskLocation();
    sortTasks();
    
    taskTitle.value = '';
}
updatePieChart();
