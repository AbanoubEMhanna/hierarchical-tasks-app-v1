"use client";

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { Task } from '../../types/task';
import { socket } from '../../lib/socket';
import { toast } from 'react-toastify';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  parentTask?: Task | null;
}

export default function AddTaskDialog({ open, onClose, parentTask }: AddTaskDialogProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    startDate: new Date().toISOString().split('T')[0],
    completionPercentage: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.accessToken) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          parentId: parentTask?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      socket.emit('createTask', newTask);
      toast.success('Task created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {parentTask ? t('Add Subtask') : t('Add Task')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Name')}*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Start Date')}*
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Completion Percentage')}*
              </label>
              <input
                type="number"
                value={formData.completionPercentage}
                onChange={(e) => setFormData({ ...formData, completionPercentage: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {t('Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 