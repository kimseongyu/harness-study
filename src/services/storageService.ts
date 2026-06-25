let AsyncStorage: any = null;

try {
  // lazy require to prevent crash if not installed
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn(
    'AsyncStorage is not installed. Highscore will be saved in memory for this session.',
  );
}

let memoryHighScore = 0;

export const storageService = {
  /**
   * Retrieves the persisted highscore.
   */
  async getHighScore(): Promise<number> {
    if (AsyncStorage) {
      try {
        const value = await AsyncStorage.getItem('DINO_HIGHSCORE');
        if (value !== null) {
          return parseInt(value, 10);
        }
      } catch (error) {
        console.error('Failed to load highscore from AsyncStorage:', error);
      }
    }
    return memoryHighScore;
  },

  /**
   * Persists a new highscore if it exceeds the current one.
   */
  async saveHighScore(score: number): Promise<boolean> {
    const currentHighScore = await this.getHighScore();
    if (score <= currentHighScore) {
      return false;
    }

    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem('DINO_HIGHSCORE', score.toString());
        return true;
      } catch (error) {
        console.error('Failed to save highscore to AsyncStorage:', error);
      }
    }

    memoryHighScore = score;
    return true;
  },
};
