import MemoryClient from 'mem0ai';

const API_KEY = 'm0-2Uqz8Gu1pN8L6UV5rxkqQ4nWcZrkGRE2a2JLWTfh';
const client = new MemoryClient(API_KEY);

export const saveToMem0 = async (messages: any[], userId: string) => {
  try {
    const response = await client.add(messages, { 
      user_id: userId
    });
    return response;
  } catch (error) {
    console.error('Error saving to Mem0:', error);
    throw error;
  }
};

export const saveAgentMemory = async (messages: any[]) => {
  try {
    const response = await client.add(messages, { 
      agent_id: "ai-companion"
    });
    return response;
  } catch (error) {
    console.error('Error saving agent memory:', error);
    throw error;
  }
};