export interface Task {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  completionPercentage: number;
  parentId?: number;
  children?: Task[];
  user: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    name: string;
  };
  customFields?: Record<string, any>;
}

export interface CustomField {
  id: number;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN';
  options?: string[];
} 