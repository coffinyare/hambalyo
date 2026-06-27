import { useState, useEffect, useCallback } from 'react';
import type { GreetingMessage, RelationshipType } from './types';
import { INITIAL_MESSAGES } from './initialMessages';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const STORAGE_KEY = 'hambalyo_messages';
const CHANNEL_NAME = 'hambalyo_channel';

// Simple client-side blocklist for automatic moderation
const PROFANITY_BLOCKLIST = [
  'nacas', 'doqon', 'danyeer', 'xanaaq', // Somali offensive words
  'stupid', 'idiot', 'spam', 'trash', 'fake' // generic English spam words
];

export function checkProfanity(text: string): boolean {
  const normalized = text.toLowerCase();
  return PROFANITY_BLOCKLIST.some(word => normalized.includes(word));
}

export function useMessages() {
  const [messages, setMessages] = useState<GreetingMessage[]>([]);

  // 1. Initial State Loading & Real-time Subscriptions
  useEffect(() => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      // Fetch initial messages from Supabase
      const fetchMessages = async () => {
        const { data, error } = await client
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages from Supabase', error);
        } else if (data) {
          setMessages(data as GreetingMessage[]);
        }
      };

      fetchMessages();

      // Subscribe to real-time changes in messages table
      const channel = client
        .channel('hambalyo-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          (payload) => {
            const { eventType, new: newRow, old: oldRow } = payload;

            if (eventType === 'INSERT') {
              const inserted = newRow as GreetingMessage;
              setMessages((prev) => {
                if (prev.some((m) => m.id === inserted.id)) return prev;
                return [inserted, ...prev];
              });
            } else if (eventType === 'UPDATE') {
              const updated = newRow as GreetingMessage;
              setMessages((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = oldRow.id;
              setMessages((prev) => prev.filter((m) => m.id !== deletedId));
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } else {
      // Fallback: LocalStorage state load
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setMessages(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored messages, resetting to seed', e);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
          setMessages(INITIAL_MESSAGES);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
        setMessages(INITIAL_MESSAGES);
      }

      // Fallback: Listen to local BroadcastChannel and window Storage event
      const broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      const handleBroadcast = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SYNC_MESSAGES') {
          setMessages(event.data.payload);
        }
      };

      broadcastChannel.addEventListener('message', handleBroadcast);

      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY && event.newValue) {
          try {
            setMessages(JSON.parse(event.newValue));
          } catch (e) {
            console.error(e);
          }
        }
      };

      window.addEventListener('storage', handleStorageEvent);

      return () => {
        broadcastChannel.removeEventListener('message', handleBroadcast);
        broadcastChannel.close();
        window.removeEventListener('storage', handleStorageEvent);
      };
    }
  }, []);

  // Fallback: Sync state utility for local storage
  const syncState = useCallback((newMessages: GreetingMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'SYNC_MESSAGES', payload: newMessages });
      channel.close();
    } catch (e) {
      console.error('Broadcast failed', e);
    }
  }, []);

  // 2. Add Message Action
  const addMessage = useCallback(
    (guestName: string, relationship: RelationshipType, text: string) => {
      const hasProfanity = checkProfanity(text) || checkProfanity(guestName);
      const isApproved = !hasProfanity;

      if (isSupabaseConfigured && supabase) {
        // Insert asynchronously in background, Realtime subscription handles state update
        supabase
          .from('messages')
          .insert([
            {
              guest_name: guestName.trim(),
              relationship,
              message_text: text.trim(),
              is_approved: isApproved,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error('Error inserting message into Supabase', error);
            }
          });
      } else {
        // Fallback Local Sync
        const newMessage: GreetingMessage = {
          id: Math.random().toString(36).substring(2, 9),
          guest_name: guestName.trim(),
          relationship,
          message_text: text.trim(),
          created_at: new Date().toISOString(),
          is_approved: isApproved,
        };

        const currentStored = localStorage.getItem(STORAGE_KEY);
        let currentList: GreetingMessage[] = [];
        if (currentStored) {
          try {
            currentList = JSON.parse(currentStored);
          } catch (e) {
            currentList = [...messages];
          }
        } else {
          currentList = [...messages];
        }

        const newList = [newMessage, ...currentList];
        syncState(newList);
      }

      return { is_approved: isApproved };
    },
    [messages, syncState]
  );

  // 3. Toggle Message Approval Action
  const toggleApproval = useCallback(
    (id: string) => {
      const msg = messages.find((m) => m.id === id);
      if (!msg) return;

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('messages')
          .update({ is_approved: !msg.is_approved })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating approval status in Supabase', error);
            }
          });
      } else {
        const newList = messages.map((m) =>
          m.id === id ? { ...m, is_approved: !m.is_approved } : m
        );
        syncState(newList);
      }
    },
    [messages, syncState]
  );

  // 4. Delete Message Action
  const deleteMessage = useCallback(
    (id: string) => {
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('messages')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Error deleting message from Supabase', error);
            }
          });
      } else {
        const newList = messages.filter((m) => m.id !== id);
        syncState(newList);
      }
    },
    [messages, syncState]
  );

  // 5. Seed Reset Action
  const resetToSeeds = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        // Delete all messages first (we select everything that is not null)
        const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .neq('guest_name', 'placeholder-nonexistent');

        if (deleteError) throw deleteError;

        // Map initial messages and insert (excluding ID to let database generate new UUIDs, 
        // or keeping them if UUIDs are valid, which they are now!)
        const seedsToInsert = INITIAL_MESSAGES.map((msg) => ({
          id: msg.id,
          guest_name: msg.guest_name,
          relationship: msg.relationship,
          message_text: msg.message_text,
          created_at: msg.created_at,
          is_approved: msg.is_approved,
        }));

        const { error: insertError } = await supabase
          .from('messages')
          .insert(seedsToInsert);

        if (insertError) throw insertError;
      } catch (err) {
        console.error('Failed to reset seeds in Supabase', err);
      }
    } else {
      syncState(INITIAL_MESSAGES);
    }
  }, [syncState]);

  return {
    messages,
    addMessage,
    toggleApproval,
    deleteMessage,
    resetToSeeds,
    isDbConnected: isSupabaseConfigured,
  };
}
