export interface BridgeMessage {
  type: 'GAME_READY' | 'SCORE_UPDATE' | 'GAME_OVER';
  payload?: any;
}

/**
 * Safely parses and validates a JSON message string sent from the WebView.
 * Returns the parsed BridgeMessage object, or null if the message is invalid.
 */
export function validateBridgeMessage(jsonString: string): BridgeMessage | null {
  try {
    const data = JSON.parse(jsonString);

    // 1. Validate that the object exists and has a string 'type' field
    if (!data || typeof data.type !== 'string') {
      console.warn('Bridge Validation Failure: Message or "type" field is missing.');
      return null;
    }

    // 2. Validate type-specific payloads
    switch (data.type) {
      case 'GAME_READY':
        // No payload expected
        break;

      case 'SCORE_UPDATE':
        if (!data.payload || typeof data.payload.score !== 'number') {
          console.warn('Bridge Validation Failure: SCORE_UPDATE expects a numeric "score" payload.');
          return null;
        }
        break;

      case 'GAME_OVER':
        if (!data.payload || typeof data.payload.score !== 'number') {
          console.warn('Bridge Validation Failure: GAME_OVER expects a numeric "score" payload.');
          return null;
        }
        break;

      default:
        console.warn(`Bridge Validation Failure: Unknown message type "${data.type}".`);
        return null;
    }

    return data as BridgeMessage;
  } catch (error) {
    console.error('Bridge Validation Failure: Failed to parse JSON message:', error);
    return null;
  }
}
