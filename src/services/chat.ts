import { supabase } from "@/integrations/supabase/client";
import { MetricsManager } from "@/utils/interactionMetrics";
import { generateResponse } from "./xai";
import type { InteractionMetrics, ChatResponse, ConversationStyle } from "@/types/metrics";

export const handleChatInteraction = async (
  message: string,
  userId: string
): Promise<ChatResponse> => {
  try {
    const { data: profile } = await supabase
      .from('companion_profiles')
      .select('personality_insights, interaction_metrics')
      .eq('profile_id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');

    const response = await generateResponse(message);
    
    const updatedMetrics = await MetricsManager.updateMetrics(
      userId,
      message,
      response
    );

    await supabase
      .from('conversations')
      .insert({
        profile_id: userId,
        message,
        is_user: true,
        emotional_context: {
          conversationVibe: updatedMetrics.energyLevel,
          flirtFactor: updatedMetrics.flirtLevel,
          wittyExchanges: updatedMetrics.wittyExchanges > 0
        },
        conversation_style: updatedMetrics.connectionStyle as ConversationStyle
      });

    return {
      response,
      metrics: updatedMetrics
    };
  } catch (error) {
    console.error('Chat interaction error:', error);
    throw error;
  }
};