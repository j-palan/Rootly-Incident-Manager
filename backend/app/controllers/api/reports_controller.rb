module Api
  class ReportsController < ApplicationController
    # HTTP POST /api/generate-report endpoint
    # Accepts categorized suggestions and metadata to generate a concise incident summary.
    def create
      suggestion_groups = params[:categorizedSuggestions]
      total_messages = params[:totalMessages]
      incident_duration = params.dig(:simulationData, :duration)

      request_payload = JSON.pretty_generate(
        suggestions: suggestion_groups,
        totalMessages: total_messages,
        duration: incident_duration
      )

      composed_prompt = <<~PROMPT
        You are an Incident Summary Generator. You will be provided with a JSON object containing:

        - Categorized suggestions
        
        - Total number of messages exchanged
        
        - Incident duration
        
        - Your goal is to create a clear, structured incident summary that contains:
        
          - Brief Overview – a short description of the incident.
        
          - Action Items – bullet-point list of tasks (limit to the top 5).
        
          - Timeline – key events in chronological order.
        
          - Root Cause Hypotheses – potential causes of the incident.
        
          - Affected Systems / Metadata – systems, components, or metadata impacted.
        
          - Post-Incident Follow-Ups – tasks to complete after resolution (limit to the top 5).
        
          Formatting requirements:
        
          - Respond in Markdown.
        
          - Use bullet points for key information.
        
          - Show only the most important items in each category (maximum 5).
        
          Incident Details:
          #{request_payload}
      PROMPT

      openai = OpenAI::Client.new(access_token: ENV["OPENAI_API_KEY"])
      ai_result = openai.chat(
        parameters: {
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a technical incident summary generator." },
            { role: "user", content: composed_prompt }
          ],
          temperature: 0.3
        }
      )

      summary_markdown = ai_result.dig("choices", 0, "message", "content")
      render json: { summary: summary_markdown }, status: :ok
    rescue => error
      render json: { error: error.message }, status: :internal_server_error
    end
  end
end
