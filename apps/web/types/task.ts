export interface Task {
  id: number;
  name: string;
  description?: string;
  owner: string;
  startDate: string;
  completionPercentage: number;
  customFields?: Record<string, any>;
  parentId?: number;
  children?: Task[];
  path?: string[];
}

export interface CustomField {
  id: number;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN';
  options?: string[];
  isRequired: boolean;
} 