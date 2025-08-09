/**
 * Message interface representing a single message in the incident transcript
 */
export interface Message {
  id: string;
  speaker: string;
  text: string;
  order: number;
  response?: any;
  type: "Action_Item" | "Timeline_Event" | "Root_Cause_Signal" | "Metadata_Hint" | "Follow_Up" | "None";
  isLoading?: boolean;
  time?: string;
}

/**
 * Simulation state interface
 */
export interface SimulationState {
  isPlaying: boolean;
  hasPlayed: boolean;
  isFinished: boolean;
}

/**
 * API message request interface
 */
export interface ApiMessageRequest {
  message: {
    speaker: string;
    text: string;
    order: number;
  };
}

/**
 * Simulation data interface for report generation
 */
export interface SimulationData {
  duration: string;
} 