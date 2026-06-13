import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { useStore } from '@/store';
import SessionCard from '@/components/SessionCard';
import styles from './index.module.scss';

type FilterType = 'all' | 'completed' | 'upcoming';

export default function SessionsPage() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    weather: '',
    startTime: '',
    endTime: ''
  });

  const filteredSessions = state.sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const handleAddSession = () => {
    const newSession = {
      id: Date.now().toString(),
      ...formData,
      photos: [],
      status: 'upcoming' as const
    };
    dispatch({ type: 'ADD_SESSION', payload: newSession });
    setShowModal(false);
    setFormData({ date: '', location: '', weather: '', startTime: '', endTime: '' });
  };

  const handleSelectSession = (sessionId: string) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: sessionId });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>市集场次</Text>
        <View className={styles.addButton} onClick={() => setShowModal(true)}>
          <Text className={styles.addIcon}>+</Text>
        </View>
      </View>
      
      <View className={styles.filterTabs}>
        <View 
          className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          <Text>全部</Text>
        </View>
        <View 
          className={`${styles.filterTab} ${filter === 'completed' ? styles.active : ''}`}
          onClick={() => setFilter('completed')}
        >
          <Text>已结束</Text>
        </View>
        <View 
          className={`${styles.filterTab} ${filter === 'upcoming' ? styles.active : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          <Text>即将开始</Text>
        </View>
      </View>

      <View className={styles.sessionList}>
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isActive={session.id === state.currentSessionId}
              onClick={() => handleSelectSession(session.id)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📅</Text>
            <Text className={styles.emptyText}>暂无场次记录</Text>
          </View>
        )}
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加新场次</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>日期</Text>
              <Input 
                className={styles.formInput}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.detail.value })}
                placeholder="如：2024-01-20"
              />
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>地点</Text>
              <Input 
                className={styles.formInput}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.detail.value })}
                placeholder="市集名称"
              />
            </View>
            
            <View className={styles.formRow}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>天气</Text>
                <Input 
                  className={styles.formInput}
                  value={formData.weather}
                  onChange={(e) => setFormData({ ...formData, weather: e.detail.value })}
                  placeholder="晴/多云/阴"
                />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>时段</Text>
                <Input 
                  className={styles.formInput}
                  value={`${formData.startTime}-${formData.endTime}`}
                  onChange={(e) => {
                    const [start, end] = e.detail.value.split('-');
                    setFormData({ ...formData, startTime: start || '', endTime: end || '' });
                  }}
                  placeholder="10:00-18:00"
                />
              </View>
            </View>

            <View className={styles.modalButtons}>
              <View className={`${styles.modalButton} ${styles.cancel}`} onClick={() => setShowModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalButton} ${styles.confirm}`} onClick={handleAddSession}>
                <Text>确认添加</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}