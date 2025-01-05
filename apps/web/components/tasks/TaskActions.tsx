"use client";

import { User } from 'next-auth';
import { Task } from '../../types/task';

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
  onAddSubtask: () => void;
  onDelete: () => void;
  users: User[]
}

export default function TaskActions({ task, onEdit, onAddSubtask , onDelete }: TaskActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={onAddSubtask}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Add Subtask
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  );
} 