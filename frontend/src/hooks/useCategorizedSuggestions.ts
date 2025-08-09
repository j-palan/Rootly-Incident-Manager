import { useState } from 'react';

export interface CategorizedSuggestion {
  id: string;
  time: string;
  suggestion: string;
}

export interface CategorizedSuggestions {
  actionItems: CategorizedSuggestion[];
  timelineEvents: CategorizedSuggestion[];
  rootCauseSignals: CategorizedSuggestion[];
  metadataHints: CategorizedSuggestion[];
  followUps: CategorizedSuggestion[];
}

/**
 * Custom hook to manage categorized suggestions
 * Handles categorization of incident suggestions by type
 */
export const useCategorizedSuggestions = () => {
  const [categorizedSuggestions, setCategorizedSuggestions] = useState<CategorizedSuggestions>({
    actionItems: [],
    timelineEvents: [],
    rootCauseSignals: [],
    metadataHints: [],
    followUps: []
  });

  const categorizeMessage = (message: any, time: string, messageId: string): void => {
    const suggestionData = { id: messageId, time, suggestion: message.suggestion };
    
    switch (message.type) {
      case "Action_Item":
        setCategorizedSuggestions(prev => ({
          ...prev,
          actionItems: [...prev.actionItems, suggestionData]
        }));
        break;
      case "Timeline_Event":
        setCategorizedSuggestions(prev => ({
          ...prev,
          timelineEvents: [...prev.timelineEvents, suggestionData]
        }));
        break;
      case "Root_Cause_Signal":
        setCategorizedSuggestions(prev => ({
          ...prev,
          rootCauseSignals: [...prev.rootCauseSignals, suggestionData]
        }));
        break;
      case "Metadata_Hint":
        setCategorizedSuggestions(prev => ({
          ...prev,
          metadataHints: [...prev.metadataHints, suggestionData]
        }));
        break;
      case "Follow_Up":
        setCategorizedSuggestions(prev => ({
          ...prev,
          followUps: [...prev.followUps, suggestionData]
        }));
        break;
      default:
        // Handle unknown types or do nothing
        break;
    }
  };

  const resetSuggestions = (): void => {
    setCategorizedSuggestions({
      actionItems: [],
      timelineEvents: [],
      rootCauseSignals: [],
      metadataHints: [],
      followUps: []
    });
  };

  return {
    categorizedSuggestions,
    categorizeMessage,
    resetSuggestions
  };
}; 