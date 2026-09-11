export type Module = 'clients' | 'scanner' | 'workflow' | 'health' | 'security' | 'synopsis' | 'settings' | 'reverse' | 'flowise';

export interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'governing';
  environment: string;
  lastSync: string;
  filesProcessed: number;
}

export interface NodeItem {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'format-analyzer';
  label: string;
  x: number;
  y: number;
  status?: 'success' | 'running' | 'idle';
}

export interface FileAsset {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'system' | 'unknown';
  format?: string;
  size?: string;
  children?: FileAsset[];
}
