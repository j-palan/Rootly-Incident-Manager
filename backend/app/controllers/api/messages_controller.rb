# API controller for chat messages
module Api
    class MessagesController < ApplicationController
  
      # HTTP POST /api/messages endpoint
      def create
        user_id = request.remote_ip 
        speaker = params[:message][:speaker]
        user_text = params[:message][:text]
  
        # Retrieve current chat context
        chat_context = get_context(user_id)
  
        # Insert system instruction once if missing
        if chat_context.none? { |msg| msg[:role] == "system" }
          chat_context.unshift({
            role: "system",
            content: <<~PROMPT.strip
            You are an AI assistant that supports real-time incident responders.
            Analyze the provided message and decide if it contains information that should trigger follow-up action, be logged on the timeline, point to a possible root cause, or add metadata.

            Respond only in the following strict JSON format:
            {
              "category": "Action_Item" | "Timeline_Event" | "Root_Cause_Signal" | "Metadata_Hint" | "Follow_Up" | "None",
              "suggestion": "Brief plain-English suggestion, or 'No Suggestion' if nothing applies"
            }
            Evaluation Rules:
            - Assign exactly one category from the list.
            - Provide a concise, clear suggestion if applicable.
            - If no category fits, set "suggestion" to "No Suggestion".
            - Do not include explanations or text outside the JSON.

            Category Definitions:
              - Action_Item – Immediate steps to mitigate or resolve the incident.
              - Follow_Up – Tasks to complete after the incident ends (e.g., documentation, review).
              - Timeline_Event – Notable changes in incident status (e.g., mitigation, resolution, escalation).
              - Root_Cause_Signal – A potential cause or hypothesis for the incident.
              - Metadata_Hint – Scope, affected systems, severity, or other contextual details.
              - None – No relevant classification.

            If no category fits, set "suggestion" to "No Suggestion".

            Do not include explanations or text outside the JSON.

            Category Definitions:

            Action_Item – Immediate steps to mitigate or resolve the incident.
            Follow_Up – Tasks to complete after the incident ends (e.g., documentation, review).
            Timeline_Event – Notable changes in incident status (e.g., mitigation, resolution, escalation).
            Root_Cause_Signal – A potential cause or hypothesis for the incident.
            Metadata_Hint – Scope, affected systems, severity, or other contextual details.
            None – No relevant classification.

            Classification Logic:

            Post-incident task → Follow_Up
            Active incident fix → Action_Item
            Status change → Timeline_Event
            Cause/theory → Root_Cause_Signal
            Scope/detail → Metadata_Hint
            Anything else → None

            Suggestion Rules:

            Use a single concise sentence.
            Specify if it’s client/user-related; otherwise, clarify what it concerns.
            
            Message:
              "#{user_text}"
            PROMPT
          })
        end
  
        # Append user message to context
        chat_context << { role: "user", content: user_text }

        puts "=== Current OpenAI Chat Context ==="
        pp chat_context
        puts "==================================="

  
        # Call the OpenAI API
        client = OpenAI::Client.new(access_token: ENV["OPENAI_API_KEY"])
        response = client.chat(
          parameters: {
            model: "gpt-4o-mini",
            messages: chat_context,
            temperature: 0.2
          }
        )

        parsed = JSON.parse(response.dig("choices", 0, "message", "content")) rescue nil

        # Append assistant reply to context
        chat_context << { role: "assistant", content: response.dig("choices", 0, "message", "content") }

        # Persist a trimmed context
        store_context(user_id, chat_context)

        render json: {
          speaker: speaker,
          text: user_text,
          suggestion: parsed&.dig("suggestion") || "No Suggestion",
          type: parsed&.dig("category") || "None"
        }, status: :ok
      end
  
      private
  
      def get_context(user_id)
        Rails.cache.fetch("chat_context_#{user_id}") { [] }
      end
  
      def store_context(user_id, context)
        trimmed = context.last(20) # limit memory usage
        Rails.cache.write("chat_context_#{user_id}", trimmed)
      end
    end
  end
  