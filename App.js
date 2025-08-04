import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';


export default function App() {
  const [response, setResponse] = useState('');
  const [input, setInput] = useState(''); // 사용자 입력 상태 추가
  const [container, setContainer] = useState(''); // 초기 컨테이너 설정
  const [test, setTest] = useState(''); // 테스트 상태 추가


  const handlePress = async () => {
    try {
      const prompt = `
      `
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }], // 입력값 사용
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      const content = result.data.choices[0].message.content;
      setResponse(content);
      setContainer(content); // Using content directly instead of response
      console.log(content);
    } catch (error) {
      console.error(error);
      setResponse('Error fetching data from OpenAI');
    }
  };

  return (
    <View style={styles.container}>
    
      <TextInput
        style={styles.input}
        placeholder="AI에게 물어보s세요"
        value={input}
        onChangeText={setInput}
      /> 
      <Button title="Generate Text" onPress={handlePress} />

    
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});