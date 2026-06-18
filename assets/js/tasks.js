// Gerenciador de Tarefas
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.loadTasks();
        this.initializeEventListeners();
        this.renderTasks();
        this.updateCounts();
    }

    // Carregar tarefas do localStorage
    loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        } else {
            // Tarefas de exemplo
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

    // Salvar tarefas no localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Adicionar nova tarefa
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

    // Atualizar tarefa
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

    // Excluir tarefa
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

    // Mudar status da tarefa
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

    // Filtrar tarefas
    getFilteredTasks() {
        let filtered = this.tasks;

        // Filtro por status
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(t => t.status === this.currentFilter);
        }

        // Filtro por busca
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

    // Renderizar tarefas
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

    // Criar card da tarefa
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
            <div class="col-md-6 col-xl-4">
                <div class="task-card ${priorityColors[task.priority]} ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="task-header">
                        <h5 class="task-title">${task.title}</h5>
                        <div class="task-badges">
                            <span class="task-badge status-${task.status}">${statusLabels[task.status]}</span>
                            <span class="task-badge priority-${task.priority}">${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🔵'} ${task.priority}</span>
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
                            <i class="bi bi-arrow-repeat"></i> Mudar Status
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="taskManager.openEditModal(${task.id})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="taskManager.deleteTask(${task.id})">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Atualizar contadores
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

    // Abrir modal de edição
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

    // Inicializar eventos
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
            
            // Resetar e fechar modal
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

        // Filtros
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });

        // Busca
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.renderTasks();
        });

        // Enter para salvar no modal
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('saveTaskBtn').click();
            }
        });

        // Tecla Escape para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    bootstrap.Modal.getInstance(modal)?.hide();
                });
            }
        });
    }

    // Toast notifications
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

// Instanciar o gerenciador
const taskManager = new TaskManager();

// Funções globais para uso no HTML
window.taskManager = taskManager;

// Salvar dados antes de sair
window.addEventListener('beforeunload', () => {
    taskManager.saveTasks();
});

// Exportar para uso em outros módulos (opcional)
export default TaskManager;