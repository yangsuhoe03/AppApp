import React from 'react';
import { ScrollView } from 'react-native';
import { renderComponent } from '../renderComponent';
import { useUIContext } from '../UIContext';

export default function UIRenderer() {
  const { uiJSON, handlers } = useUIContext();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {renderComponent(uiJSON, handlers)}
    </ScrollView>
  );
}