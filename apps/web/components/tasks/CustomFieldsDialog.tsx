"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { CustomField } from '../../types/task';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Session } from 'next-auth';

interface CustomFieldsDialogProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

type FieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN';

export default function CustomFieldsDialog({ open, onClose, session }: CustomFieldsDialogProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState({
    name: '',
    type: 'TEXT' as FieldType,
    isRequired: false,
    options: '',
  });

  useEffect(() => {
    if (open) {
      fetchCustomFields();
    }
  }, [open]);

  const fetchCustomFields = async () => {
    if (!session?.user?.accessToken) {
      toast.error('Authentication token not found');
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
      setFields(data);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast.error('Failed to fetch custom fields');
    }
  };

  const handleAddField = async () => {
    if (!session?.user?.accessToken) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      const fieldData = {
        name: newField.name,
        type: newField.type,
        options: newField.type === 'DROPDOWN' ? newField.options.split(',').map(o => o.trim()) : undefined,
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-fields`,
        fieldData,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setFields([...fields, data]);
      setNewField({ name: '', type: 'TEXT', isRequired: false, options: '' });
      toast.success('Custom field added successfully');
    } catch (error) {
      console.error('Error adding custom field:', error);
      toast.error('Failed to add custom field');
    }
  };

  const handleDeleteField = async (id: number) => {
    if (!session?.user?.accessToken) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-fields/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setFields(fields.filter(f => f.id !== id));
      toast.success('Custom field deleted successfully');
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast.error('Failed to delete custom field');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t('Manage Custom Fields')}</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{t('Add New Field')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('Field Name')}
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="TEXT">{t('Text')}</option>
                <option value="NUMBER">{t('Number')}</option>
                <option value="DATE">{t('Date')}</option>
                <option value="DROPDOWN">{t('Dropdown')}</option>
              </select>
              {newField.type === 'DROPDOWN' && (
                <input
                  type="text"
                  placeholder={t('Options (comma-separated)')}
                  value={newField.options}
                  onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                  className="p-2 border border-gray-300 rounded col-span-2"
                />
              )}
            </div>
            <button
              onClick={handleAddField}
              disabled={!newField.name}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {t('Add Field')}
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">{t('Existing Fields')}</h3>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{field.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({field.type})</span>
                    {field.options && (
                      <span className="ml-2 text-sm text-gray-500">
                        [{field.options.join(', ')}]
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    {t('Remove')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {t('Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 