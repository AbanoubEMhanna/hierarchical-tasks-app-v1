"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Task, CustomField } from "../../types/task";
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
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formData, setFormData] = useState({
    name: task.name,
    description: task.description,
    userId: task.user.id,
    startDate: task.startDate ? task.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    completionPercentage: task.completionPercentage,
    customFields: task.customFields || {},
  });

  useEffect(() => {
    if (open) {
      fetchCustomFields();
    }
  }, [open]);

  const fetchCustomFields = async () => {
    if (!session?.user?.accessToken) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-fields`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      setCustomFields(data);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
      toast.error("Failed to fetch custom fields");
    }
  };

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

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  const renderCustomField = (field: CustomField) => {
    const value = formData.customFields[field.name] || "";

    switch (field.type) {
      case "TEXT":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );
      case "NUMBER":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );
      case "DATE":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );
      case "DROPDOWN":
        return (
          <select
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">{t("Select an option")}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
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
                className="w-full p-2 border border-gray-300 rounded"
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
                className="w-full p-2 border border-gray-300 rounded"
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
                className="w-full p-2 border border-gray-300 rounded"
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
                className="w-full p-2 border border-gray-300 rounded"
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
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Custom Fields Section */}
            {customFields.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">{t("Custom Fields")}</h3>
                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.name}
                      </label>
                      {renderCustomField(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
