
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { LOGO_URL } from '../constants';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://btrzypkvbdgwsodbmfrf.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TJAUq5Y0-f1YGiOPC1xe8w_W22A-fRE';

export const isMock = !supabaseUrl || 
                     supabaseUrl.includes('your-project-url') || 
                     !supabaseAnonKey || 
                     supabaseAnonKey.startsWith('sb_publishable_');

const createMockSupabase = () => {
  let currentUser: any = null;
  const listeners: ((event: string, session: any) => void)[] = [];

  const mockResponse = (data: any = null) => Promise.resolve({ data, error: null });
  
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockResponse(),
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    single: () => mockResponse({}),
    then: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled)
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: currentUser ? { user: currentUser } : null }, error: null }),
      getUser: async () => ({ data: { user: currentUser }, error: null }),
      onAuthStateChange: (callback: any) => {
        listeners.push(callback);
        callback('INITIAL_SESSION', currentUser ? { user: currentUser } : null);
        return {
          data: { subscription: { unsubscribe: () => {
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
          } } },
        };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        currentUser = { id: 'mock-user-id', email, user_metadata: { name: email.split('@')[0] } };
        listeners.forEach(cb => cb('SIGNED_IN', { user: currentUser }));
        return { data: { user: currentUser }, error: null };
      },
      signUp: async ({ email }: { email: string }) => {
        currentUser = { id: 'mock-user-id', email, user_metadata: { name: email.split('@')[0] } };
        listeners.forEach(cb => cb('SIGNED_UP', { user: currentUser }));
        return { data: { user: currentUser }, error: null };
      },
      signInWithOAuth: async () => ({ data: {}, error: null }),
      signOut: async () => {
        currentUser = null;
        listeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      },
      updateUser: async (attributes: any) => {
        if (currentUser) {
          currentUser = { ...currentUser, ...attributes };
        }
        return mockResponse({ user: currentUser });
      },
    },
    storage: {
      from: () => ({
        upload: async () => mockResponse({ path: 'mock-path' }),
        getPublicUrl: () => ({ data: { publicUrl: LOGO_URL } }),
      }),
    },
    from: () => mockQueryBuilder,
  };
};

export const supabase = isMock 
  ? (createMockSupabase() as any) 
  : createClient(supabaseUrl, supabaseAnonKey);
