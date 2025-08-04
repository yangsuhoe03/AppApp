import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [uiJSON, setUIJSON] = useState(null);  // ✅ GPT가 생성한 UI JSON 저장
  const [handlers, setHandlers] = useState({}); // ✅ 버튼 등 이벤트 핸들러 저장

  return (
    <UIContext.Provider value={{ uiJSON, setUIJSON, handlers, setHandlers }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => useContext(UIContext);