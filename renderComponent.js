import React from 'react';
import { View, Text, TextInput, Button, Pressable, ScrollView, Switch } from 'react-native';

const componentMap = {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  ScrollView,
  Switch,
};

export function renderComponent(node, handlers = {}, keyPrefix = 'cmp') {
  // 유효하지 않은 노드는 무시
  if (!node || typeof node !== 'object' || !node.type) return null;

  const { type, props = {}, children } = node;

  const Component = componentMap[type];
  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  // 이벤트 핸들러 포함한 props 매핑
  const mappedProps = {};

  for (const propName in props) {
    const value = props[propName];

    // 문자열 핸들러: handlers에서 찾아서 연결
    if (typeof value === 'string' && handlers[value]) {
      mappedProps[propName] = handlers[value];
    }

    // 배열 핸들러: 여러 함수 연결
    else if (Array.isArray(value)) {
      const validFns = value.map(name => handlers[name]).filter(Boolean);
      if (validFns.length > 0) {
        mappedProps[propName] = () => {
          validFns.forEach(fn => fn());
        };
      }
    }

    // 나머지 props는 그대로 사용
    else {
      mappedProps[propName] = value;
    }
  }
  const realChildren = children ?? props.children ?? null;

  // 자식 요소 재귀적으로 처리
  const renderedChildren = Array.isArray(realChildren)
    ? realChildren.map((child, i) =>
      renderComponent(child, handlers, `${keyPrefix}-${i}`)
    )
    : typeof realChildren === 'object'
      ? renderComponent(realChildren, handlers, `${keyPrefix}-c`)
      : realChildren;

  return React.createElement(Component, { ...mappedProps, key: `${keyPrefix}-${Math.random()}` }, renderedChildren);
}