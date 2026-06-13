import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import styles from './index.module.scss';

interface Props {
  title: string;
  tags: string[];
  color: string;
  onAdd?: (tag: string) => void;
  editable?: boolean;
}

export default function FeedbackTag({ title, tags, color, onAdd, editable = true }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim() && onAdd) {
      onAdd(inputValue.trim());
      setInputValue('');
      setShowInput(false);
    }
  };

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.tags}>
        {tags.map((tag, index) => (
          <View key={index} className={styles.tag} style={{ borderColor: color, backgroundColor: `${color}10`, color }}>
            <Text>{tag}</Text>
          </View>
        ))}
        {editable && !showInput && (
          <View className={styles.addButton} onClick={() => setShowInput(true)}>
            <Text className={styles.addIcon}>+</Text>
          </View>
        )}
        {showInput && (
          <View className={styles.inputContainer}>
            <Input
              className={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.detail.value)}
              placeholder="添加标签"
              confirmType="done"
              onConfirm={handleAdd}
              autoFocus
            />
            <Text className={styles.confirmBtn} onClick={handleAdd}>确定</Text>
          </View>
        )}
      </View>
    </View>
  );
}