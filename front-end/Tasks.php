<?php 
    session_start(); 

    if (!isset($_SESSION['logado'])) {
        header('location: ./login.html');
        exit;
    }
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Minhas Tarefas - Gerenciador</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="../assets/css/tasks.css">
</head>

<body>
    <!-- Bottom Navigation (Mobile First) -->
    <nav class="bottom-nav">
        <div class="bottom-nav-item active" data-tab="dashboard">
            <i class="bi bi-house"></i>
            <span>Início</span>
        </div>
        <div class="bottom-nav-item" data-tab="calendar">
            <i class="bi bi-calendar"></i>
            <span>Calendário</span>
        </div>
        <div class="bottom-nav-item" data-tab="stats">
            <i class="bi bi-bar-chart"></i>
            <span>Stats</span>
        </div>
        <div class="bottom-nav-item" data-tab="profile">
            <i class="bi bi-person"></i>
            <span>Perfil</span>
        </div>
    </nav>

    <!-- Top Header -->
    <header class="top-header">
        <div class="header-content">
            <div class="header-left">
                <div class="menu-toggle" id="menuToggle">
                    <i class="bi bi-list"></i>
                </div>
                <div class="brand">
                    <i class="bi bi-check2-square"></i>
                    <span>Minhas Tarefas</span>
                </div>
            </div>
            <div class="header-right">
                <button class="btn-notification" id="notificationBtn">
                    <i class="bi bi-bell"></i>
                    <span class="notification-badge">3</span>
                </button>
                <div class="user-avatar" id="userAvatar">
                    <span><?php echo substr($_SESSION['user_name'], 0, 2); ?></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Sidebar Menu -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <div class="sidebar-menu" id="sidebarMenu">
        <div class="sidebar-header">
            <div class="user-info">
                <div class="user-avatar-large">
                    <span><?php echo substr($_SESSION['user_name'], 0, 2); ?></span>
                </div>
                <div>
                    <h5><?php echo $_SESSION['user_name']; ?></h5>
                    <p class="text-muted"><?php echo $_SESSION['user_email']; ?></p>
                </div>
            </div>
        </div>
        <div class="sidebar-body">
            <a href="#" class="sidebar-item active">
                <i class="bi bi-house"></i>
                <span>Dashboard</span>
            </a>
            <a href="#" class="sidebar-item">
                <i class="bi bi-calendar"></i>
                <span>Calendário</span>
            </a>
            <a href="#" class="sidebar-item">
                <i class="bi bi-bar-chart"></i>
                <span>Estatísticas</span>
            </a>
            <a href="#" class="sidebar-item">
                <i class="bi bi-gear"></i>
                <span>Configurações</span>
            </a>
            <a href="#" class="sidebar-item">
                <i class="bi bi-question-circle"></i>
                <span>Ajuda</span>
            </a>
            <hr>
            <a href="../banco-dados/logOut.php" class="sidebar-item text-danger">
                <i class="bi bi-box-arrow-right"></i>
                <span>Sair</span>
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container-fluid px-3">
            <!-- Header Section -->
            <div class="header-section mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h1 class="page-title">
                            <i class="bi bi-list-check"></i> Minhas Tarefas
                        </h1>
                        <p class="text-muted small">Gerencie suas tarefas diárias</p>
                    </div>
                    <button class="btn btn-primary btn-add-task" data-bs-toggle="modal" data-bs-target="#taskModal">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats mb-3">
                <div class="stat-card">
                    <div class="stat-icon bg-primary">
                        <i class="bi bi-list-ul"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="allCount">0</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon bg-warning">
                        <i class="bi bi-clock"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="pendingCount">0</span>
                        <span class="stat-label">Pendentes</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon bg-info">
                        <i class="bi bi-arrow-repeat"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="progressCount">0</span>
                        <span class="stat-label">Progresso</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon bg-success">
                        <i class="bi bi-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-number" id="completedCount">0</span>
                        <span class="stat-label">Concluídas</span>
                    </div>
                </div>
            </div>

            <!-- Search and Filters -->
            <div class="search-filter-section mb-3">
                <div class="search-box">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInput" 
                               placeholder="Buscar tarefas...">
                        <button class="btn btn-filter-toggle" id="filterToggle">
                            <i class="bi bi-funnel"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filter-chips" id="filterChips">
                    <button class="chip active" data-filter="all">
                        <i class="bi bi-list-ul"></i> Todas
                    </button>
                    <button class="chip" data-filter="pending">
                        <i class="bi bi-clock"></i> Pendentes
                    </button>
                    <button class="chip" data-filter="in-progress">
                        <i class="bi bi-arrow-repeat"></i> Progresso
                    </button>
                    <button class="chip" data-filter="completed">
                        <i class="bi bi-check-circle"></i> Concluídas
                    </button>
                </div>
            </div>

            <!-- Tasks List -->
            <div class="tasks-list" id="tasksContainer">
                <!-- Tasks will be rendered here -->
            </div>

            <!-- Empty State -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <i class="bi bi-inbox"></i>
                <h3>Nenhuma tarefa encontrada</h3>
                <p class="text-muted">Comece adicionando sua primeira tarefa</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModal">
                    <i class="bi bi-plus-circle"></i> Criar tarefa
                </button>
            </div>

            <!-- Floating Action Button (FAB) for Mobile -->
            <button class="fab" data-bs-toggle="modal" data-bs-target="#taskModal">
                <i class="bi bi-plus-lg"></i>
            </button>
        </div>
    </main>

    <!-- Modal Nova Tarefa -->
    <div class="modal fade modal-fullscreen-sm" id="taskModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-plus-circle"></i> Nova Tarefa
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="taskForm">
                        <div class="mb-3">
                            <label for="taskTitle" class="form-label fw-bold">Título *</label>
                            <input type="text" class="form-control" id="taskTitle"
                                placeholder="Digite o título da tarefa" required>
                        </div>
                        <div class="mb-3">
                            <label for="taskDescription" class="form-label fw-bold">Descrição</label>
                            <textarea class="form-control" id="taskDescription" rows="3"
                                placeholder="Descreva sua tarefa em detalhes..."></textarea>
                        </div>
                        <div class="row g-2">
                            <div class="col-6 mb-3">
                                <label for="taskPriority" class="form-label fw-bold">Prioridade</label>
                                <select class="form-select" id="taskPriority">
                                    <option value="low">🔵 Baixa</option>
                                    <option value="medium" selected>🟡 Média</option>
                                    <option value="high">🔴 Alta</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="taskStatus" class="form-label fw-bold">Status</label>
                                <select class="form-select" id="taskStatus">
                                    <option value="pending">⏳ Pendente</option>
                                    <option value="in-progress">🔄 Em Andamento</option>
                                    <option value="completed">✅ Concluída</option>
                                </select>
                            </div>
                        </div>
                        <div class="row g-2">
                            <div class="col-6 mb-3">
                                <label for="taskCategory" class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="taskCategory">
                                    <option value="personal">👤 Pessoal</option>
                                    <option value="work">💼 Trabalho</option>
                                    <option value="study">📚 Estudo</option>
                                    <option value="health">💪 Saúde</option>
                                    <option value="other">📌 Outros</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="taskDueDate" class="form-label fw-bold">Vencimento</label>
                                <input type="date" class="form-control" id="taskDueDate">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="saveTaskBtn">
                        <i class="bi bi-check-circle"></i> Salvar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Editar Tarefa -->
    <div class="modal fade modal-fullscreen-sm" id="editTaskModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-pencil-square"></i> Editar Tarefa
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editTaskForm">
                        <input type="hidden" id="editTaskId">
                        <div class="mb-3">
                            <label for="editTaskTitle" class="form-label fw-bold">Título *</label>
                            <input type="text" class="form-control" id="editTaskTitle" required>
                        </div>
                        <div class="mb-3">
                            <label for="editTaskDescription" class="form-label fw-bold">Descrição</label>
                            <textarea class="form-control" id="editTaskDescription" rows="3"></textarea>
                        </div>
                        <div class="row g-2">
                            <div class="col-6 mb-3">
                                <label for="editTaskPriority" class="form-label fw-bold">Prioridade</label>
                                <select class="form-select" id="editTaskPriority">
                                    <option value="low">🔵 Baixa</option>
                                    <option value="medium">🟡 Média</option>
                                    <option value="high">🔴 Alta</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="editTaskStatus" class="form-label fw-bold">Status</label>
                                <select class="form-select" id="editTaskStatus">
                                    <option value="pending">⏳ Pendente</option>
                                    <option value="in-progress">🔄 Em Andamento</option>
                                    <option value="completed">✅ Concluída</option>
                                </select>
                            </div>
                        </div>
                        <div class="row g-2">
                            <div class="col-6 mb-3">
                                <label for="editTaskCategory" class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="editTaskCategory">
                                    <option value="personal">👤 Pessoal</option>
                                    <option value="work">💼 Trabalho</option>
                                    <option value="study">📚 Estudo</option>
                                    <option value="health">💪 Saúde</option>
                                    <option value="other">📌 Outros</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label for="editTaskDueDate" class="form-label fw-bold">Vencimento</label>
                                <input type="date" class="form-control" id="editTaskDueDate">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="updateTaskBtn">
                        <i class="bi bi-check-circle"></i> Atualizar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div class="position-fixed bottom-0 start-0 end-0 p-3" style="z-index: 11; max-width: 400px; margin: 0 auto;">
        <div id="liveToast" class="toast align-items-center border-0 w-100" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" id="toastMessage">
                    <!-- Message will be inserted here -->
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- JavaScript Personalizado -->
    <script src="../assets/js/tasks.js"></script>
</body>

</html>