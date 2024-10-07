import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { getTaskById, updateTask, deleteTask, logout } from '../services/apiService';
import taskmanager from '../assets/taskmanager.png';
import '../styles/TaskView.css';
import { BsFillTrash3Fill, BsFloppy2Fill } from 'react-icons/bs';
import { TaskUpdated } from '../types/TaskUpdated';

const TaskView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<TaskUpdated>({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });
  const [editedTask, setEditedTask] = useState<TaskUpdated>(task);
  const [isModified, setIsModified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (id) {  
          const fetchedTask = await getTaskById(id);
          setTask(fetchedTask);
          setEditedTask({
            title: fetchedTask.title,
            description: fetchedTask.description,
            dueDate: new Date(fetchedTask.dueDate).toISOString().split('T')[0],
            completed: fetchedTask.completed
          });
        } else {
          console.error('ID da tarefa não fornecido');
        }
      } catch (error) {
        console.log('Erro ao buscar tarefa:', error);
      }
    };
  
    fetchTask();
  }, [id]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
    setIsModified(true);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedTask = {
        ...editedTask,
        dueDate: new Date(editedTask.dueDate),
      };
      if (id) {
        await updateTask(id, updatedTask);
      } else {
        console.error('ID da tarefa não é válido');
      }
      setIsModified(false);
      setTask(updatedTask);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (id) {
        await deleteTask(id);
      } else {
        console.error('ID da tarefa não é válido');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
    setShowModal(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="task-edit-container">
      <div className="sidebar">
        <div className="logo-section">
          <Link to="/dashboard">
            <img src={taskmanager} alt="TaskManager Logo" className="logo" />
          </Link>
        </div>
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
            <Link to="/sessions" className="btn btn-light">Minhas Sessões</Link>
            <Button variant="danger" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="content-header">
          <h2>Editar Tarefa</h2>
        </div>

        <Form className="task-edit-form" onSubmit={handleSaveChanges}>
          <Form.Group controlId="title">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="dueDate" className="mt-3">
            <Form.Label>Prazo</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="button-group mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!isModified}
              className="save-button"
            >
              <BsFloppy2Fill /> Salvar Alterações
            </Button>
            <Button
              variant="danger"
              onClick={openModal}
              className="delete-button"
            >
              <BsFillTrash3Fill /> Excluir Tarefa
            </Button>
          </div>
        </Form>

        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>Tem certeza de que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Excluir Tarefa
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TaskView;