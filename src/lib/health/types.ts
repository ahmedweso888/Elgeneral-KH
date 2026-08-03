export interface ScanResult {
  success: boolean;

  score: number;

  grade: string;

  timestamp: string;

  duration: number;

  summary: {
    passed: number;
    warnings: number;
    errors: number;
  };

  database: DatabaseResult;

  storage: StorageResult;

  buckets: BucketResult;

  auth: AuthResult;

  policies: PoliciesResult;

  triggers: TriggersResult;

  indexes: IndexesResult;

  settings: SettingsResult;

  performance: PerformanceResult;
}

//--------------------------------------------------
// Database
//--------------------------------------------------

export interface DatabaseResult {
  ok: boolean;

  total: number;

  existing: string[];

  missing: string[];
}

//--------------------------------------------------
// Storage
//--------------------------------------------------

export interface StorageResult {
  ok: boolean;

  buckets: number;

  files: number;
}

//--------------------------------------------------
// Buckets
//--------------------------------------------------

export interface BucketResult {
  ok: boolean;

  total: number;

  existing: string[];

  missing: string[];
}

//--------------------------------------------------
// Auth
//--------------------------------------------------

export interface AuthResult {
  ok: boolean;

  users: number;

  message: string;

  details: {
    adminApi: boolean;
    usersLoaded: boolean;
  };
}

//--------------------------------------------------
// Policies
//--------------------------------------------------

export interface PoliciesResult {
  ok: boolean;

  total: number;

  found: number;

  message: string;

  missing: {
    table: string;
    name: string;
  }[];
}

//--------------------------------------------------
// Triggers
//--------------------------------------------------

export interface TriggersResult {
  ok: boolean;

  total: number;

  found: number;

  message: string;

  missing: string[];
}

//--------------------------------------------------
// Indexes
//--------------------------------------------------

export interface IndexesResult {
  ok: boolean;

  total: number;

  found: number;

  message: string;

  missing: string[];
}

//--------------------------------------------------
// Settings
//--------------------------------------------------

export interface SettingsResult {
  ok: boolean;

  configured: boolean;

  rows: number;

  issues: string[];

  message: string;
}

//--------------------------------------------------
// Performance
//--------------------------------------------------

export interface PerformanceResult {
  ok: boolean;

  duration: number;

  status: "excellent" | "good" | "slow";

  message: string;
}