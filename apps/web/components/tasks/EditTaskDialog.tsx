"use client";

import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Task } from "../../types/task";
import { socket } from "../../lib/socket";
import { toast } from "react-toastify";
import { Session, User } from "next-auth";
import axios from "axios";

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  parentTask?: Task | null;
  session: Session | null;
  users: User[];
}

export default function EditTaskDialog({
  open,
  onClose,
  parentTask,
  session,
  task,
  users,
}: EditTaskDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: task.name,
    description: task.description,
    userId: task.user.id,
    startDate: task.startDate,
    completionPercentage: task.completionPercentage,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.accessToken) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      const { data: updatedTask } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      socket.emit("updateTask", updatedTask);
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {parentTask ? t("Edit Subtask") : t("Edit Task")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Assigned User")}*
              </label>
              <select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: parseInt(e.target.value) })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{t("Select a user")}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Name")}*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Description")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Start Date")}*
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Completion Percentage")}*
              </label>
              <input
                type="number"
                value={formData.completionPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    completionPercentage: parseInt(e.target.value),
                  })
                }
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
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {t("Save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
