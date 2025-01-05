"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Task } from '../../types/task';
import { socket } from '../../lib/socket';
import TaskActions from './TaskActions';
import AddTaskDialog from './AddTaskDialog';
import CustomFieldsDialog from './CustomFieldsDialog';
import RTLWrapper from '../../components/RTLWrapper';
import { toast } from 'react-toastify';
import { Session, User } from 'next-auth';
import axios from 'axios';
import EditTaskDialog from './EditTaskDialog';

export default function TaskGrid({session}: {session: Session | null}) {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCustomFieldsDialog, setOpenCustomFieldsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    if (session) {
      fetchTasks();
      fetchUsers();
      
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
      }

      // Setup socket event listeners
      const handleTaskCreate = (newTask: Task) => {
        setTasks(prev => {
          // If task already exists, don't add it
          if (prev.find(task => task.id === newTask.id)) {
            return prev;
          }
          return [...prev, newTask];
        });
      };

      const handleTaskUpdate = (updatedTask: Task) => {
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
      };

      const handleTaskDelete = (taskId: number) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      };

      // Subscribe to events
      socket.on('taskCreated', handleTaskCreate);
      socket.on('taskUpdated', handleTaskUpdate);
      socket.on('taskDeleted', handleTaskDelete);

      // Cleanup function
      return () => {
        socket.off('taskCreated', handleTaskCreate);
        socket.off('taskUpdated', handleTaskUpdate);
        socket.off('taskDeleted', handleTaskDelete);
        socket.disconnect();
      };
    }
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.user?.accessToken) {
      console.error('No access token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(t('Error fetching tasks'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!session?.user?.accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('Error fetching users'));
    }
  };

  const handleEditTask = (task: Task) => {
    console.log(task);
    setSelectedTask(task);
    setOpenEditDialog(true);
  };

  const handleAddSubtask = (parentTask: Task) => {
    setSelectedTask(parentTask);
    setOpenAddDialog(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!session?.user?.accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      
      // Remove task from local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success(t('Task deleted successfully'));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(t('Error deleting task'));
    }
  };

  const renderTaskRow = (task: Task, level = 0) => (
    <React.Fragment key={task.id}>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap" style={{ paddingLeft: `${level * 2 + 1.5}rem` }}>
          <div className="flex items-center">
            {level > 0 && (
              <span className="mr-2 text-gray-400">└─</span>
            )}
            {task.name}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="line-clamp-2">{task.description}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{task.owner.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">{task.user.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          {new Date(task.startDate).toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${task.completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {task.completionPercentage}%
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <TaskActions
            task={task}
            onEdit={() => handleEditTask(task)}
            onAddSubtask={() => handleAddSubtask(task)}
            onDelete={() => handleDeleteTask(task.id)}
            users={users}
          />
        </td>
      </tr>
      {task.children?.map(child => renderTaskRow(child, level + 1))}
    </React.Fragment>
  );

  return (
    <RTLWrapper>
      <div className="w-full">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setOpenAddDialog(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t('Add Task')}
            </button>
            <button
              onClick={() => setOpenCustomFieldsDialog(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              {t('Manage Custom Fields')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Owner')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('User')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Start Date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Completion %')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    {t('Loading...')}
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {t('No tasks found')}
                  </td>
                </tr>
              ) : (
                tasks.map(task => renderTaskRow(task))
              )}
            </tbody>
          </table>
        </div>

        <AddTaskDialog
          session={session}
          open={openAddDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setSelectedTask(null);
            fetchTasks();
          }}
          parentTask={selectedTask}
        />
        {selectedTask && (
          <EditTaskDialog
            session={session}
            open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedTask(null);
            fetchTasks();
          }}
            task={selectedTask}
            parentTask={selectedTask}
            users={users}
          />
        )}

        <CustomFieldsDialog
          open={openCustomFieldsDialog}
          onClose={() => setOpenCustomFieldsDialog(false)}
        />

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}
      </div>
    </RTLWrapper>
  );
} 