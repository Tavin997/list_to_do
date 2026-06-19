<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

    <?php 
        session_start(); 

        if (!$_SESSION['logado']) {
            header('location: https://list-to-do-cijf.onrender.com/front-end/login.html');
            exit;
        }
    ?>

    <!-- Sidebar / Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <i class="bi bi-check2-square"></i>
                Minhas Tarefas
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">
                            <i class="bi bi-house"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="bi bi-calendar"></i> Calendário
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="bi bi-bar-chart"></i> Estatísticas
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-bs-toggle="dropdown">
                            <span class="d-none d-lg-inline"> <?php echo $_SESSION['user_name'] ?> </span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-person"></i> Perfil</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-gear"></i> Configurações</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item text-danger" href="../banco-dados/logOut.php"><i
                                        class="bi bi-box-arrow-right"></i> Sair</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
        <div class="container-fluid">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-md-8">
                    <h1 class="page-title">
                        <i class="bi bi-list-check"></i> Minhas Tarefas
                    </h1>
                    <p class="text-muted">Gerencie suas tarefas diárias de forma eficiente</p>
                </div>
                <div class="col-md-4 text-md-end">
                    <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#taskModal">
                        <i class="bi bi-plus-circle"></i> Nova Tarefa
                    </button>
                </div>
            </div>

            <!-- Filters -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="filter-bar">
                        <div class="btn-group" role="group">
                            <button class="btn btn-filter active" data-filter="all">
                                <i class="bi bi-list-ul"></i> Todas
                                <span class="badge bg-primary" id="allCount">0</span>
                            </button>
                            <button class="btn btn-filter" data-filter="pending">
                                <i class="bi bi-clock"></i> Pendentes
                                <span class="badge bg-warning" id="pendingCount">0</span>
                            </button>
                            <button class="btn btn-filter" data-filter="in-progress">
                                <i class="bi bi-arrow-repeat"></i> Em Andamento
                                <span class="badge bg-info" id="progressCount">0</span>
                            </button>
                            <button class="btn btn-filter" data-filter="completed">
                                <i class="bi bi-check-circle"></i> Concluídas
                                <span class="badge bg-success" id="completedCount">0</span>
                            </button>
                        </div>

                        <div class="search-box ms-auto">
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control" id="searchInput"
                                    placeholder="Buscar tarefas...">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tasks Grid -->
            <div class="row" id="tasksContainer">
                <!-- Tasks will be rendered here -->
            </div>

            <!-- Empty State -->
            <div class="empty-state" id="emptyState" style="display: none;">
                <i class="bi bi-inbox"></i>
                <h3>Nenhuma tarefa encontrada</h3>
                <p class="text-muted">Comece adicionando sua primeira tarefa clicando no botão "Nova Tarefa"</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModal">
                    <i class="bi bi-plus-circle"></i> Criar primeira tarefa
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Nova Tarefa -->
    <div class="modal fade" id="taskModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
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
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="taskPriority" class="form-label fw-bold">Prioridade</label>
                                <select class="form-select" id="taskPriority">
                                    <option value="low">🔵 Baixa</option>
                                    <option value="medium" selected>🟡 Média</option>
                                    <option value="high">🔴 Alta</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="taskStatus" class="form-label fw-bold">Status</label>
                                <select class="form-select" id="taskStatus">
                                    <option value="pending">⏳ Pendente</option>
                                    <option value="in-progress">🔄 Em Andamento</option>
                                    <option value="completed">✅ Concluída</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="taskCategory" class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="taskCategory">
                                    <option value="personal">👤 Pessoal</option>
                                    <option value="work">💼 Trabalho</option>
                                    <option value="study">📚 Estudo</option>
                                    <option value="health">💪 Saúde</option>
                                    <option value="other">📌 Outros</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="taskDueDate" class="form-label fw-bold">Data de vencimento</label>
                                <input type="date" class="form-control" id="taskDueDate">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="saveTaskBtn">
                        <i class="bi bi-check-circle"></i> Salvar Tarefa
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Editar Tarefa -->
    <div class="modal fade" id="editTaskModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
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
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="editTaskPriority" class="form-label fw-bold">Prioridade</label>
                                <select class="form-select" id="editTaskPriority">
                                    <option value="low">🔵 Baixa</option>
                                    <option value="medium">🟡 Média</option>
                                    <option value="high">🔴 Alta</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="editTaskStatus" class="form-label fw-bold">Status</label>
                                <select class="form-select" id="editTaskStatus">
                                    <option value="pending">⏳ Pendente</option>
                                    <option value="in-progress">🔄 Em Andamento</option>
                                    <option value="completed">✅ Concluída</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="editTaskCategory" class="form-label fw-bold">Categoria</label>
                                <select class="form-select" id="editTaskCategory">
                                    <option value="personal">👤 Pessoal</option>
                                    <option value="work">💼 Trabalho</option>
                                    <option value="study">📚 Estudo</option>
                                    <option value="health">💪 Saúde</option>
                                    <option value="other">📌 Outros</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="editTaskDueDate" class="form-label fw-bold">Data de vencimento</label>
                                <input type="date" class="form-control" id="editTaskDueDate">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="updateTaskBtn">
                        <i class="bi bi-check-circle"></i> Atualizar Tarefa
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="liveToast" class="toast align-items-center border-0" role="alert" aria-live="assertive"
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