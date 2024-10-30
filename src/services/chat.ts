import { supabase } from "@/integrations/supabase/client";
import { MetricsManager } from "@/utils/interactionMetrics";
import { xaiService } from "./xai";
import type { InteractionMetrics, ChatResponse, ConversationStyle } from "@/types/metrics";

const adjustTemperature = (metrics: InteractionMetrics): number => {
  // Base temperature of 0.7
  let temperature = 0.7;
  
  // Increase temperature for more playful/flirty interactions
  if (metrics.flirtLevel > 7) temperature += 0.1;
  if (metrics.energyLevel === 'excited') temperature += 0.1;
  
  // Decrease temperature for more intellectual exchanges
  if (metrics.connectionStyle === 'intellectual') temperature -= 0.1;
  
  // Ensure temperature stays within reasonable bounds
  return Math.max(0.5, Math.min(0.9, temperature));
};

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

    const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
    const updatedMetrics = await MetricsManager.updateMetrics(
      userId,
      message,
      ''  // Will be updated after response generation
    );

    const response = await xaiService.generateResponse(message, userContext, updatedMetrics);
    
    // Update metrics with the actual response
    await MetricsManager.updateMetrics(userId, message, response);

    // Adjust temperature for next interaction based on current metrics
    const temperature = adjustTemperature(updatedMetrics);

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
        conversation_style: updatedMetrics.connectionStyle as ConversationStyle,
        metadata: { temperature }
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