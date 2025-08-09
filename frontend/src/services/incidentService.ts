import type { ApiMessageRequest } from '../types/incident';
import type { CategorizedSuggestions } from '../hooks/useCategorizedSuggestions';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Service class for handling incident-related API calls
 * Follows single responsibility principle for API operations
 */
export class IncidentService {
  /**
   * Send a message to the incident analysis API
   */
  async sendMessage(messageData: ApiMessageRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate an incident report
   */
  async generateReport(
    categorizedSuggestions: CategorizedSuggestions,
    totalMessages: number,
    duration: string
  ): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categorizedSuggestions,
        totalMessages,
        simulationData: {
          duration
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.json();
  }
} 