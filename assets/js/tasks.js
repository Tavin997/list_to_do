// Gerenciador de Tarefas - Mobile First
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.loadTasks();
        this.initializeEventListeners();
        this.renderTasks();
        this.updateCounts();
        this.initializeMobileUI();
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        } else {
            this.tasks = [
                {
                    id: 1,
                    title: 'Finalizar projeto de design',
                    description: 'Revisar e entregar o projeto de interface do cliente',
                    priority: 'high',
                    status: 'in-progress',
                    category: 'work',
                    dueDate: '2026-06-25',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Estudar JavaScript avançado',
                    description: 'Praticar promises, async/await e manipulação de DOM',
                    priority: 'medium',
                    status: 'pending',
                    category: 'study',
                    dueDate: '2026-06-30',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'Fazer exercícios físicos',
                    description: '30 minutos de cardio e alongamento',
                    priority: 'low',
                    status: 'completed',
                    category: 'health',
                    dueDate: '2026-06-20',
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateCounts();
        this.showToast('Tarefa criada com sucesso! 🎉', 'success');
        return newTask;
    }

    updateTask(id, updatedData) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedData };
            this.saveTasks();
            this.renderTasks();
            this.updateCounts();
            this.showToast('Tarefa atualizada com sucesso! ✏️', 'info');
            return true;
        }
        return false;
    }

    deleteTask(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateCounts();
            this.showToast('Tarefa excluída com sucesso! 🗑️', 'danger');
            return true;
        }
        return false;
    }

    toggleStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const statusMap = {
                'pending': 'in-progress',
                'in-progress': 'completed',
                'completed': 'pending'
            };
            task.status = statusMap[task.status] || 'pending';
            this.saveTasks();
            this.renderTasks();
            this.updateCounts();
            const statusMessages = {
                'pending': 'Tarefa movida para Pendente ⏳',
                'in-progress': 'Tarefa em Andamento 🔄',
                'completed': 'Tarefa Concluída! ✅'
            };
            this.showToast(statusMessages[task.status] || 'Status atualizado!', 'info');
            return true;
        }
        return false;
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(t => t.status === this.currentFilter);
        }

        if (this.currentSearch.trim()) {
            const search = this.currentSearch.toLowerCase().trim();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(search) ||
                t.description.toLowerCase().includes(search) ||
                t.category.includes(search)
            );
        }

        return filtered;
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.getFilteredTasks();

        if (filtered.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = filtered.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        const priorityColors = {
            low: 'priority-low',
            medium: 'priority-medium',
            high: 'priority-high'
        };

        const statusLabels = {
            pending: '⏳ Pendente',
            'in-progress': '🔄 Em Andamento',
            completed: '✅ Concluída'
        };

        const categoryIcons = {
            personal: '👤',
            work: '💼',
            study: '📚',
            health: '💪',
            other: '📌'
        };

        const isCompleted = task.status === 'completed';
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem data';
        const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR');

        return `
            <div class="task-card ${priorityColors[task.priority]} ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <h5 class="task-title">${task.title}</h5>
                    <div class="task-badges">
                        <span class="task-badge status-${task.status}">${statusLabels[task.status]}</span>
                    </div>
                </div>
                
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                
                <div class="task-meta">
                    <span><i class="bi bi-tag"></i> ${categoryIcons[task.category] || '📌'} ${task.category}</span>
                    <span><i class="bi bi-calendar"></i> ${dueDate}</span>
                    <span><i class="bi bi-clock"></i> ${createdDate}</span>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn-outline-success btn-sm" onclick="taskManager.toggleStatus(${task.id})">
                        <i class="bi bi-arrow-repeat"></i> Status
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="taskManager.openEditModal(${task.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="taskManager.deleteTask(${task.id})">
                        <i class="bi bi-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    }

    updateCounts() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const progress = this.tasks.filter(t => t.status === 'in-progress').length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;

        document.getElementById('allCount').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('progressCount').textContent = progress;
        document.getElementById('completedCount').textContent = completed;
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description || '';
            document.getElementById('editTaskPriority').value = task.priority;
            document.getElementById('editTaskStatus').value = task.status;
            document.getElementById('editTaskCategory').value = task.category;
            document.getElementById('editTaskDueDate').value = task.dueDate || '';

            const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
            modal.show();
        }
    }

    initializeMobileUI() {
        // Sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebarMenu');
        const overlay = document.getElementById('sidebarOverlay');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Bottom navigation
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Filter chips toggle
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', function() {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                taskManager.currentFilter = this.dataset.filter;
                taskManager.renderTasks();
            });
        });

        // Filter toggle for search
        document.getElementById('filterToggle')?.addEventListener('click', () => {
            const chips = document.getElementById('filterChips');
            chips.style.display = chips.style.display === 'none' ? 'flex' : 'none';
        });

        // Close modais com gesto de swipe (mobile)
        let touchStartY = 0;
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            content.addEventListener('touchmove', (e) => {
                const touchEndY = e.touches[0].clientY;
                const diff = touchEndY - touchStartY;
                if (diff > 100 && content.scrollTop === 0) {
                    const modal = content.closest('.modal');
                    if (modal) {
                        bootstrap.Modal.getInstance(modal)?.hide();
                    }
                }
            }, { passive: true });
        });

        // Clique fora do modal para fechar (mobile)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    bootstrap.Modal.getInstance(this)?.hide();
                }
            });
        });
    }

    initializeEventListeners() {
        // Salvar nova tarefa
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            const title = document.getElementById('taskTitle').value.trim();
            if (!title) {
                this.showToast('Por favor, insira um título para a tarefa! ⚠️', 'warning');
                return;
            }

            const taskData = {
                title: title,
                description: document.getElementById('taskDescription').value.trim(),
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value,
                category: document.getElementById('taskCategory').value,
                dueDate: document.getElementById('taskDueDate').value
            };

            this.addTask(taskData);
            document.getElementById('taskForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        });

        // Atualizar tarefa
        document.getElementById('updateTaskBtn').addEventListener('click', () => {
            const id = parseInt(document.getElementById('editTaskId').value);
            const title = document.getElementById('editTaskTitle').value.trim();
            
            if (!title) {
                this.showToast('Por favor, insira um título para a tarefa! ⚠️', 'warning');
                return;
            }

            const updatedData = {
                title: title,
                description: document.getElementById('editTaskDescription').value.trim(),
                priority: document.getElementById('editTaskPriority').value,
                status: document.getElementById('editTaskStatus').value,
                category: document.getElementById('editTaskCategory').value,
                dueDate: document.getElementById('editTaskDueDate').value
            };

            this.updateTask(id, updatedData);
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
        });

        // Busca
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.renderTasks();
        });

        // Enter para salvar
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('saveTaskBtn').click();
            }
        });

        // Fechar modais com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    bootstrap.Modal.getInstance(modal)?.hide();
                });
            }
        });
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('liveToast');
        const toastBody = document.getElementById('toastMessage');
        
        const colors = {
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            danger: '#dc3545'
        };

        toast.style.background = colors[type] || '#2c3e50';
        toastBody.textContent = message;
        
        const bsToast = new bootstrap.Toast(toast, {
            delay: 3000,
            animation: true
        });
        bsToast.show();
    }
}

// Instanciar
const taskManager = new TaskManager();
window.taskManager = taskManager;

// Salvar antes de sair
window.addEventListener('beforeunload', () => {
    taskManager.saveTasks();
});