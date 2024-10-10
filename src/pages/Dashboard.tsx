import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, getCompletedTasks, getPendingTasks, getTasksGroupedByUser, logout, markTaskAsCompleted, getUserProfile  } from '../services/apiService';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';
import { Task } from '../types/Task';
import taskmanager from '../assets/taskmanager.png';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard: React.FC = () => {
  // Define o estado para as tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  // Define o estado para verificar se o usuário é admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Define o estado para o filtro de tarefas
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  /**
   * useEffect para buscar o perfil do usuário e carregar as tarefas
   * com base no filtro selecionado.
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userProfile = await getUserProfile(userId);
          setIsAdmin(userProfile.isAdmin); // Verifica se o usuário é admin
        }
      } catch (error) {
        console.log('Erro ao buscar perfil do usuário:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        let tasksData: Task[] = [];
        // Aplica o filtro para buscar as tarefas de acordo com o estado do filtro
        if (filter === 'completed') {
          tasksData = await getCompletedTasks();
        } else if (filter === 'pending') {
          tasksData = await getPendingTasks();
        } else if (filter === 'groupedByUser' && isAdmin) {
          tasksData = await getTasksGroupedByUser();
        } else {
          tasksData = await getTasks();
        }
        setTasks(tasksData);
      } catch (error) {
        console.log('Erro ao buscar tasks:', error);
      }
    };

    fetchUserProfile();
    fetchTasks();
  }, [filter, isAdmin]); // Atualiza quando o filtro ou estado de admin mudam

  /**
   * Função para marcar a tarefa como concluída ou pendente.
   * Atualiza o estado local das tarefas após a operação.
   */
  const handleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      await markTaskAsCompleted(taskId, completed);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.log('Erro ao marcar task como concluída:', error);
    }
  };

  /**
   * Função para fazer logout do usuário.
   * Redireciona para a página de login após o logout.
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  /**
   * Função de callback para lidar com a reorganização de tarefas
   * após o término do "drag and drop".
   */
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedTask] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedTask);

    setTasks(items);
  };

  /**
   * Função para alterar o filtro de visualização de tarefas.
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Seção do logo */}
        <div className="logo-section">
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>

        {/* Menu lateral */}
        <div className="menu-section">
          <div className="profile-section">
            <Link to={`/profile/${localStorage.getItem('userId')}`} className="profile-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <p className="profile-text">Meu Perfil</p>
            </Link>
          </div>

          <div className="menu-options">
            {/* Opção disponível apenas para admins */}
            {isAdmin && (
              <Link to="/usersList" className="btn btn-light">
                Lista de Usuários
              </Link>
            )}
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="content-area">
        <div className="content-header">
          <h2>Minhas Tarefas</h2>
        </div>

        <div className="content-header2">
          {/* Botão para adicionar nova tarefa */}
          <Link to="/createTask" className="add-task-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            Adicionar Tarefa
          </Link>

          {/* Filtro de tarefas */}
          <select value={filter} onChange={handleFilterChange} className="task-filter">
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
            {isAdmin && <option value="groupedByUser">Agrupadas por Usuário</option>}
          </select>
        </div>

        {/* Drag and drop para tarefas */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {tasks.length > 0 && (
            <Droppable droppableId="tasks">
              {(provided) => (
                <div className="task-grid" {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided, snapshot) => (
                        <Link to={`/task/${task.id}`} className="task-link">
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${task.completed ? 'completed' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            {/* Marcar tarefa como concluída */}
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-complete-${task.id}`}>Marcar como concluída</Tooltip>}
                            >
                              <input
                                type="checkbox"
                                className="task-checkbox"
                                checked={task.completed}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleTaskCompletion(task.id, !task.completed)}
                              />
                          </OverlayTrigger>
                          <h5>{task.title}</h5><br />
                          <div className="task-dates">
                            <small>Criação: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</small><br />
                            <small>Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</small><br />
                            <small>Ultima Modificação: {new Date(task.updatedAt).toLocaleDateString('pt-BR')}</small><br />
                            {isAdmin && (
                              <small>ID do Usuário: {task.userId}</small>
                            )}
                          </div>
                        </div>
                      </Link>
                    )}
                  </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;