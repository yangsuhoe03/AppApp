import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UIRenderer from './screens/UIRenderer';
import { UIProvider, useUIContext } from './UIContext';

// 네비게이션 스택 생성 (React Navigation 사용)
const Stack = createNativeStackNavigator();

// 실제 UI와 핸들러 데이터를 설정하고 앱을 렌더링하는 컴포넌트
function AppWrapper() {
  // UI JSON과 핸들러를 전역 상태로 설정하는 함수들
  const { setUIJSON, setHandlers } = useUIContext();

  useEffect(() => {
    // GPT가 만들어 준 UI 구조 (JSON 형태)
    const testUI = {
      type: 'View',
      props: { style: { padding: 20 } },
      children: [
        {
          type: 'Text',
          props: { 
            children: '테스트 화면이에요!', 
            style: { fontSize: 20 } 
          },
        },
        {
          type: 'Button',
          props: {
            title: '눌러줘',
            // 실제 렌더 시 이 키 이름에 해당하는 함수가 실행됨
            // 현재 구조에선 마지막 onPress만 적용됨 (덮어씌워지기 때문)
            onPress: ['sayHello', 'anotherAction'],
          },
        },
        {
          type: 'Button',
          props: {
            title: '누르지마',
            // 실제 렌더 시 이 키 이름에 해당하는 함수가 실행됨
            // 현재 구조에선 마지막 onPress만 적용됨 (덮어씌워지기 때문)
            onPress: ['sayHelloAgain', 'anotherAction'],
          },
        },
      ],
      // 여기에 버튼 액션 등 이벤트 핸들러 코드를 문자열로 정의
      handlers: {
        sayHello: "alert('안녕하세요! 👋')",
        anotherAction: "console.log('다른 액션!')",
        sayHelloAgain: "alert('다시 인사해요!')",
      },
    };

    // 문자열로 된 함수들을 실행 가능한 진짜 함수로 변환
    const parsedHandlers = {};
    if (testUI.handlers) {
      for (const [key, fnBody] of Object.entries(testUI.handlers)) {
        // 문자열을 실제 함수로 변환: 예) new Function("alert('hi')")
        parsedHandlers[key] = new Function(fnBody);
      }
      // UI 렌더링에는 handlers가 필요 없기 때문에 삭제
      delete testUI.handlers;
    }

    // 전역 상태에 UI 구조와 핸들러 함수 등록
    setUIJSON(testUI);
    setHandlers(parsedHandlers);

  }, []); // 컴포넌트가 마운트될 때 한 번만 실행됨

  return (
    // 앱의 전체 네비게이션 컨테이너
    <NavigationContainer>
      <Stack.Navigator>
        {/* UI 렌더링 컴포넌트를 네비게이션 화면으로 등록 */}
        <Stack.Screen name="테스트" component={UIRenderer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// UI 상태 관리 컨텍스트를 앱 전체에 적용
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
    <UIProvider>
      <AppWrapper />
            <TextInput
        style={styles.input}
        placeholder="AI에게 물어보s세요"
        value={input}
        onChangeText={setInput}
      /> 
      <Button title="Generate Text" onPress={handlePress} />


    </UIProvider>
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


