import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { Session } from '@/types';
import styles from './index.module.scss';

interface Props {
  session: Session;
  isActive?: boolean;
  onClick: () => void;
}

export default function SessionCard({ session, isActive = false, onClick }: Props) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    return `${month}月${day}日 ${weekDay}`;
  };

  return (
    <View className={`${styles.card} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.date}>
          <Text className={styles.monthDay}>{formatDate(session.date)}</Text>
          <Text className={`${styles.status} ${session.status === 'completed' ? styles.completed : styles.upcoming}`}>
            {session.status === 'completed' ? '已结束' : '即将开始'}
          </Text>
        </View>
        <View className={styles.weather}>{session.weather}</View>
      </View>
      <Text className={styles.location}>{session.location}</Text>
      <View className={styles.time}>
        <Text className={styles.timeText}>{session.startTime} - {session.endTime}</Text>
      </View>
      {session.photos.length > 0 && (
        <View className={styles.photos}>
          <Image className={styles.photo} src={session.photos[0]} mode="aspectFill" />
        </View>
      )}
    </View>
  );
}