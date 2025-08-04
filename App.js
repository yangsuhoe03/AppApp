import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export default function App() {
  const [response, setResponse] = useState('');

  const handlePress = async () => {
    try {
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello, world!' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      setResponse('Error fetching data from OpenAI');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Text" onPress={handlePress} />
      <Text style={styles.text}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});