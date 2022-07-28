export class Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  institution: string;
  repository: string;
  website: string;
  citation: string;
  creationDate: Date;
  containerId: string;
  baseCommand: string;
  title: string;
  inputs: JSON[];
  outputs: JSON[];
  ui: JSON[];
  resourceRequirements?: PluginResourceRequirements;
  _links: any;
}

export interface PluginResourceRequirements {
  ramMin?: number;
  coresMin?: number;
  cpuAVX?: boolean;
  cpuAVX2?: boolean;
  gpu?: boolean;
  cudaRequirements?: PluginResourceCudaRequirements;

}

export interface PluginResourceCudaRequirements {
  deviceMemoryMin?: number;
  cudaComputeCapability?: string | string[];
}

export interface PaginatedPlugins {
  page: any;
  plugins: Plugin[];
  _links: any;
}
