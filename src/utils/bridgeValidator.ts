export interface GameEvent {
  type: 'GAME_READY' | 'SCORE_UPDATE' | 'GAME_OVER';
  payload?: any;
}

/**
 * Safely parses and validates a game event (either as an object or serialized JSON string).
 * Returns the validated GameEvent object, or null if invalid.
 */
export function validateGameEvent(input: any): GameEvent | null {
  try {
    let data = input;
    if (typeof input === 'string') {
      data = JSON.parse(input);
    }

    // 1. Validate that the object exists and has a string 'type' field
    if (!data || typeof data.type !== 'string') {
      console.warn('Game Event Validation Failure: Message or "type" field is missing.');
      return null;
    }

    // 2. Validate type-specific payloads
    switch (data.type) {
      case 'GAME_READY':
        // No payload expected
        break;

      case 'SCORE_UPDATE':
        if (!data.payload || typeof data.payload.score !== 'number') {
          console.warn('Game Event Validation Failure: SCORE_UPDATE expects a numeric "score" payload.');
          return null;
        }
        break;

      case 'GAME_OVER':
        if (!data.payload || typeof data.payload.score !== 'number') {
          console.warn('Game Event Validation Failure: GAME_OVER expects a numeric "score" payload.');
          return null;
        }
        break;

      default:
        console.warn(`Game Event Validation Failure: Unknown event type "${data.type}".`);
        return null;
    }

    return data as GameEvent;
  } catch (error) {
    console.error('Game Event Validation Failure: Failed to parse game event:', error);
    return null;
  }
}

// Keep the old function name alias for backwards compatibility during transition
export const validateBridgeMessage = validateGameEvent;
