import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Centralized schema reference
const schema = 'biz_support_app';

function from(table: string) {
  return supabase.from(`${schema}.${table}`);
}

// Client functions
export async function getClients() {
  const { data, error } = await from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClient(id: string) {
  const { data, error } = await from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClient(client: {
  name: string;
  business: string;
  industry: string;
  stage: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  notes?: string;
}) {
  const { data, error } = await from('clients')
    .insert({ ...client, user_id: (await supabase.auth.getUser()).data.user?.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(client: {
  id: string;
  name: string;
  business: string;
  industry: string;
  stage: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  notes?: string;
}) {
  const { id, ...updates } = client;
  const { data, error } = await from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Document functions
export async function uploadDocument(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file);

  if (error) throw error;
  return data;
}

export async function getDocumentUrl(path: string) {
  const { data } = await supabase.storage
    .from('documents')
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function createDocument(document: {
  client_id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  file_path: string;
}) {
  const { data, error } = await from('documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getClientDocuments(clientId: string) {
  const { data, error } = await from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Assessment functions
export async function createAssessment(assessment: {
  client_id: string;
  type: string;
  date: Date;
  score?: number;
  status: string;
  notes?: string;
}) {
  const { data, error } = await from('assessments')
    .insert(assessment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getClientAssessments(clientId: string) {
  const { data, error } = await from('assessments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}
