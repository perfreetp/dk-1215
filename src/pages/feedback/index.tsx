import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useStore, useCurrentSession, useFeedback } from '@/store';
import FeedbackTag from '@/components/FeedbackTag';
import styles from './index.module.scss';

export default function FeedbackPage() {
  const { dispatch } = useStore();
  const currentSession = useCurrentSession();
  const existingFeedback = useFeedback(currentSession?.id || '');
  
  const [feedbackData, setFeedbackData] = useState({
    frequentlyAskedQuestions: [] as string[],
    popularDisplays: [] as string[],
    rejectionReasons: [] as string[]
  });

  useEffect(() => {
    if (existingFeedback) {
      setFeedbackData({
        frequentlyAskedQuestions: existingFeedback.frequentlyAskedQuestions,
        popularDisplays: existingFeedback.popularDisplays,
        rejectionReasons: existingFeedback.rejectionReasons
      });
    }
  }, [existingFeedback, currentSession]);

  const handleAddFAQ = (tag: string) => {
    const newFAQs = [...feedbackData.frequentlyAskedQuestions, tag];
    updateFeedback({ ...feedbackData, frequentlyAskedQuestions: newFAQs });
  };

  const handleAddDisplay = (tag: string) => {
    const newDisplays = [...feedbackData.popularDisplays, tag];
    updateFeedback({ ...feedbackData, popularDisplays: newDisplays });
  };

  const handleAddRejection = (tag: string) => {
    const newRejections = [...feedbackData.rejectionReasons, tag];
    updateFeedback({ ...feedbackData, rejectionReasons: newRejections });
  };

  const updateFeedback = (data: typeof feedbackData) => {
    setFeedbackData(data);
    const feedback = {
      id: existingFeedback?.id || Date.now().toString(),
      sessionId: currentSession.id,
      ...data
    };
    if (existingFeedback) {
      dispatch({ type: 'UPDATE_FEEDBACK', payload: feedback });
    } else {
      dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>顾客反馈</Text>
      </View>

      <View className={styles.currentSession}>
        <Text className={styles.sessionLabel}>当前场次</Text>
        <Text className={styles.sessionValue}>{currentSession?.location || '未选择场次'} - {currentSession?.date}</Text>
      </View>

      <View className={styles.feedbackSections}>
        <FeedbackTag
          title="❓ 顾客常问问题"
          tags={feedbackData.frequentlyAskedQuestions}
          color="#1890ff"
          onAdd={handleAddFAQ}
        />

        <FeedbackTag
          title="✨ 受欢迎陈列"
          tags={feedbackData.popularDisplays}
          color="#00b42a"
          onAdd={handleAddDisplay}
        />

        <FeedbackTag
          title="😔 拒买原因"
          tags={feedbackData.rejectionReasons}
          color="#ff7d00"
          onAdd={handleAddRejection}
        />
      </View>

      {feedbackData.frequentlyAskedQuestions.length === 0 && 
       feedbackData.popularDisplays.length === 0 && 
       feedbackData.rejectionReasons.length === 0 && (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💬</Text>
          <Text className={styles.emptyText}>暂无反馈记录，点击标签旁的 + 号添加</Text>
        </View>
      )}
    </ScrollView>
  );
}