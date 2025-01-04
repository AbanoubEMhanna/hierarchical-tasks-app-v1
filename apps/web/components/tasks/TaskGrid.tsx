"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Task } from '../../types/task';
import { socket } from '../../lib/socket';
import TaskActions from './TaskActions';
import AddTaskDialog from './AddTaskDialog';
import CustomFieldsDialog from './CustomFieldsDialog';
import RTLWrapper from '../../components/RTLWrapper';

export default function TaskGrid() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCustomFieldsDialog, setOpenCustomFieldsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (session) {
      fetchTasks();
      const cleanup = setupWebSocket();
      return () => {
        cleanup();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Setup event listeners
    const handleTaskUpdate = (updatedTask: Task) => {
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    };

    const handleTaskCreate = (newTask: Task) => {
      setTasks(prev => [...prev, newTask]);
    };

    socket.on('taskUpdated', handleTaskUpdate);
    socket.on('taskCreated', handleTaskCreate);

    // Return cleanup function
    return () => {
      socket.off('taskUpdated', handleTaskUpdate);
      socket.off('taskCreated', handleTaskCreate);
    };
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenAddDialog(true);
  };

  const handleAddSubtask = (parentTask: Task) => {
    setSelectedTask(parentTask);
    setOpenAddDialog(true);
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
        <td className="px-6 py-4 whitespace-nowrap">{task.owner}</td>
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
          open={openAddDialog}
          onClose={() => {
            setOpenAddDialog(false);
            setSelectedTask(null);
          }}
          parentTask={selectedTask}
        />

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