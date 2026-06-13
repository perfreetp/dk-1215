import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore, useCurrentSession, useReport } from '@/store';
import ReportCard from '@/components/ReportCard';
import styles from './index.module.scss';
import type { LocationCompare } from '@/types';

export default function ReportPage() {
  const { state, dispatch } = useStore();
  const currentSession = useCurrentSession();
  const report = useReport(currentSession?.id || '');
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState(state.target.amount.toString());
  const [targetDeadline, setTargetDeadline] = useState(state.target.deadline);

  const locationComparison: LocationCompare[] = [
    { location: '静安创意市集', totalIncome: 1600, totalProfit: 450, avgProfit: 450, count: 1 },
    { location: '徐汇夜市', totalIncome: 1140, totalProfit: 280, avgProfit: 280, count: 1 },
    { location: '浦东周末市集', totalIncome: 0, totalProfit: 0, avgProfit: 0, count: 0 }
  ];

  const handleShare = () => {
    Taro.showToast({
      title: '生成分享图中...',
      icon: 'loading'
    });
    setTimeout(() => {
      Taro.showToast({
        title: '分享图已保存',
        icon: 'success'
      });
    }, 1500);
  };

  const handleSaveTarget = () => {
    dispatch({
      type: 'SET_TARGET',
      payload: {
        id: state.target.id,
        amount: parseInt(targetAmount) || 0,
        deadline: targetDeadline,
        progress: state.target.progress
      }
    });
    setShowTargetModal(false);
    Taro.showToast({
      title: '目标已设置',
      icon: 'success'
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>复盘报告</Text>
        <View className={styles.shareButton} onClick={handleShare}>
          <Text>📤</Text>
          <Text className={styles.shareText}>分享复盘图</Text>
        </View>
      </View>

      <View className={styles.currentSession}>
        <Text className={styles.sessionLabel}>当前场次</Text>
        <Text className={styles.sessionValue}>{currentSession?.location || '未选择场次'} - {currentSession?.date}</Text>
      </View>

      <View className={styles.targetCard}>
        <View className={styles.targetHeader}>
          <Text className={styles.targetTitle}>🎯 回本目标</Text>
          <Text className={styles.targetEdit} onClick={() => setShowTargetModal(true)}>编辑</Text>
        </View>
        <View className={styles.targetProgressBar}>
          <View className={styles.targetProgressFill} style={{ width: `${state.target.progress}%` }} />
        </View>
        <View className={styles.targetInfo}>
          <Text className={styles.targetAmount}>目标: ¥{state.target.amount}</Text>
          <Text className={styles.targetPercent}>{state.target.progress}%</Text>
        </View>
      </View>

      {report ? (
        <ReportCard report={report} />
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>暂无复盘数据，请先录入收支记录</Text>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📍</Text>
          <Text>地点对比</Text>
        </Text>
        <View className={styles.locationCompare}>
          {locationComparison.map((item, index) => (
            <View key={index} className={styles.locationItem}>
              <Text className={styles.locationName}>{item.location}</Text>
              <Text className={styles.locationProfit}>
                {item.count > 0 ? `¥${item.avgProfit}/场` : '暂无数据'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {showTargetModal && (
        <View className={styles.modalOverlay} onClick={() => setShowTargetModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>设置回本目标</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>目标金额（元）</Text>
              <Input 
                className={styles.formInput}
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.detail.value)}
                placeholder="输入目标金额"
              />
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>截止日期</Text>
              <Input 
                className={styles.formInput}
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.detail.value)}
                placeholder="如：2024-03-31"
              />
            </View>

            <View className={styles.modalButtons}>
              <View className={`${styles.modalButton} ${styles.cancel}`} onClick={() => setShowTargetModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalButton} ${styles.confirm}`} onClick={handleSaveTarget}>
                <Text>确认设置</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}