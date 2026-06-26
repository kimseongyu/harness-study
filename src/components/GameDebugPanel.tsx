import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameDebugPanelProps {
  onSimulateEvent: (event: { type: 'GAME_READY' | 'SCORE_UPDATE' | 'GAME_OVER'; payload?: any }) => void;
}

export function GameDebugPanel({ onSimulateEvent }: GameDebugPanelProps) {
  const [expanded, setExpanded] = useState(false);

  // Return null in production to fully exclude from production bundle
  if (!__DEV__) {
    return null;
  }

  const handleSimulate = (type: 'GAME_READY' | 'SCORE_UPDATE' | 'GAME_OVER', payload?: any) => {
    onSimulateEvent({ type, payload });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.headerText}>
          {expanded ? '▼' : '▲'} Harness Game Debug Panel
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.subTitle}>Simulate Native Game State Events:</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSimulate('GAME_READY')}
            >
              <Text style={styles.buttonText}>RESET / READY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSimulate('SCORE_UPDATE', { score: 100 })}
            >
              <Text style={styles.buttonText}>SCORE (100)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSimulate('SCORE_UPDATE', { score: 500 })}
            >
              <Text style={styles.buttonText}>SCORE (500)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSimulate('GAME_OVER', { score: 999 })}
            >
              <Text style={styles.buttonText}>GAME_OVER (999)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
  },
  header: {
    backgroundColor: '#eaeaea',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'monospace',
  },
  body: {
    padding: 16,
  },
  subTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#005faf', // Material Primary
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
export { GameDebugPanel as BridgeDebugPanel }; // Export alias for backwards compatibility if needed
