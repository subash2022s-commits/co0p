import { isSupabaseConfigured, supabasePublic } from '../config/supabase.js';

// In-memory development store for offline/local testing prior to Supabase credentials setup
const memoryStore = {
  profiles: new Map(),
  farms: new Map(),
  crop_recommendations: new Map(),
  soil_reports: new Map(),
  fertilizer_advisories: new Map(),
  irrigation_advisories: new Map(),
  disease_reports: new Map(),
  cultivation_calendars: new Map(),
  chat_conversations: new Map(),
  chat_messages: new Map(),
};

/**
 * Universal Database Access Layer
 * Uses user-scoped Supabase client (RLS enforced) when configured,
 * otherwise falls back to isolated memory store per user.
 */
export const db = {
  async getProfile(userSupabase, userId) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    return memoryStore.profiles.get(userId) || null;
  },

  async upsertProfile(userSupabase, userId, profileData) {
    const payload = {
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('profiles')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const existing = memoryStore.profiles.get(userId) || { id: userId, created_at: new Date().toISOString() };
    const updated = { ...existing, ...payload };
    memoryStore.profiles.set(userId, updated);
    return updated;
  },

  async listFarms(userSupabase, userId) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('farms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const userFarms = Array.from(memoryStore.farms.values()).filter(f => f.user_id === userId);
    return userFarms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createFarm(userSupabase, userId, farmData) {
    const payload = {
      user_id: userId,
      ...farmData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('farms')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const id = crypto.randomUUID();
    const created = { id, ...payload };
    memoryStore.farms.set(id, created);
    return created;
  },

  async deleteFarm(userSupabase, userId, farmId) {
    if (isSupabaseConfigured && userSupabase) {
      const { error } = await userSupabase
        .from('farms')
        .delete()
        .eq('id', farmId)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const farm = memoryStore.farms.get(farmId);
    if (farm && farm.user_id === userId) {
      memoryStore.farms.delete(farmId);
      return true;
    }
    return false;
  },

  async saveAdvisory(table, userSupabase, userId, record) {
    const payload = {
      user_id: userId,
      ...record,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from(table)
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const id = crypto.randomUUID();
    const saved = { id, ...payload };
    if (!memoryStore[table]) memoryStore[table] = new Map();
    memoryStore[table].set(id, saved);
    return saved;
  },

  async listAdvisories(table, userSupabase, userId, limit = 50) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    }
    const store = memoryStore[table] || new Map();
    const items = Array.from(store.values()).filter(item => item.user_id === userId);
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return items.slice(0, limit);
  },

  async getAdvisoryById(table, userSupabase, userId, id) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from(table)
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    }
    const store = memoryStore[table] || new Map();
    const item = store.get(id);
    if (item && item.user_id === userId) return item;
    return null;
  },

  async deleteAdvisory(table, userSupabase, userId, id) {
    if (isSupabaseConfigured && userSupabase) {
      const { error } = await userSupabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const store = memoryStore[table] || new Map();
    const item = store.get(id);
    if (item && item.user_id === userId) {
      store.delete(id);
      return true;
    }
    return false;
  },

  async updateCalendarActivity(userSupabase, userId, calendarId, activities) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('cultivation_calendars')
        .update({ activities, updated_at: new Date().toISOString() })
        .eq('id', calendarId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const cal = memoryStore.cultivation_calendars.get(calendarId);
    if (cal && cal.user_id === userId) {
      cal.activities = activities;
      cal.updated_at = new Date().toISOString();
      return cal;
    }
    return null;
  },

  async listChatConversations(userSupabase, userId) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const convs = Array.from(memoryStore.chat_conversations.values()).filter(c => c.user_id === userId);
    return convs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  async createChatConversation(userSupabase, userId, title = 'New Conversation', language = 'en') {
    const payload = {
      user_id: userId,
      title,
      language,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('chat_conversations')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const id = crypto.randomUUID();
    const created = { id, ...payload };
    memoryStore.chat_conversations.set(id, created);
    return created;
  },

  async getChatMessages(userSupabase, userId, conversationId) {
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }
    const msgs = Array.from(memoryStore.chat_messages.values())
      .filter(m => m.conversation_id === conversationId && m.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return msgs;
  },

  async addChatMessage(userSupabase, userId, conversationId, role, content) {
    const payload = {
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && userSupabase) {
      const { data, error } = await userSupabase
        .from('chat_messages')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      // update conversation updated_at
      await userSupabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      return data;
    }
    const id = crypto.randomUUID();
    const created = { id, ...payload };
    memoryStore.chat_messages.set(id, created);
    const conv = memoryStore.chat_conversations.get(conversationId);
    if (conv) {
      conv.updated_at = new Date().toISOString();
      if (conv.title === 'New Conversation' && role === 'user') {
        conv.title = content.slice(0, 35) + (content.length > 35 ? '...' : '');
      }
    }
    return created;
  },

  async deleteChatConversation(userSupabase, userId, conversationId) {
    if (isSupabaseConfigured && userSupabase) {
      const { error } = await userSupabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const conv = memoryStore.chat_conversations.get(conversationId);
    if (conv && conv.user_id === userId) {
      memoryStore.chat_conversations.delete(conversationId);
      for (const [msgId, msg] of memoryStore.chat_messages.entries()) {
        if (msg.conversation_id === conversationId) {
          memoryStore.chat_messages.delete(msgId);
        }
      }
      return true;
    }
    return false;
  }
};

