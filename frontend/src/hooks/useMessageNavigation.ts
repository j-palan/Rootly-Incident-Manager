/**
 * Custom hook to handle message navigation and scrolling
 * Provides functionality to scroll to specific messages with highlight effects
 */
export const useMessageNavigation = () => {
  const scrollToMessage = (messageId: string): void => {
    const messageElement = document.getElementById(messageId);
    
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Get the message type to determine color
      const messageType = messageElement.getAttribute('data-message-type') || 'None';
      let categoryColor = 'oklch(0.69 0.19 276)'; // default purple
      
      switch (messageType) {
        case "Action_Item":
          categoryColor = "oklch(0.69 0.19 276)"; // purple
          break;
        case "Timeline_Event":
          categoryColor = "oklch(0.66 0.16 205)"; // green
          break;
        case "Root_Cause_Signal":
          categoryColor = "oklch(0.70 0.23 16)"; // red
          break;
        case "Metadata_Hint":
          categoryColor = "oklch(0.76 0.18 70)"; // yellow
          break;
        case "Follow_Up":
          categoryColor = "oklch(0.62 0.23 303)"; // magenta
          break;
        default:
          categoryColor = "oklch(0.69 0.19 276)"; // default purple
      }
      
      // Set the category color CSS variable
      (messageElement as HTMLElement).style.setProperty('--category-color', categoryColor);
      
      // Add flash effect
      messageElement.classList.add('message-flash');
      
      // Add name flash effect
      const speakerName = messageElement.querySelector('.speaker-name');
      if (speakerName) {
        (speakerName as HTMLElement).style.setProperty('--category-color', categoryColor);
        speakerName.classList.add('name-flash');
      }
      
      // Remove flash class after animation completes
      setTimeout(() => {
        messageElement.classList.remove('message-flash');
        if (speakerName) {
          speakerName.classList.remove('name-flash');
        }
      }, 3000);
    } else {
      console.log('Message element not found:', messageId);
    }
  };

  return { scrollToMessage };
}; 