import React from 'react';
import { View, Text } from '@tarojs/components';
import type { Report } from '@/types';
import styles from './index.module.scss';

interface Props {
  report: Report;
}

export default function ReportCard({ report }: Props) {
  const roiPercent = (report.roi * 100).toFixed(1);

  return (
    <View className={styles.card}>
      <View className={styles.summary}>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryLabel}>总收入</Text>
          <Text className={styles.summaryValue}>¥{report.totalIncome}</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.summaryLabel}>总支出</Text>
          <Text className={styles.summaryValueExpense}>¥{report.totalExpense}</Text>
        </View>
      </View>
      <View className={styles.profitSection}>
        <View className={styles.profitLabel}>
          <Text className={styles.profitText}>本场利润</Text>
        </View>
        <Text className={`${styles.profitValue} ${report.profit >= 0 ? styles.profit : styles.loss}`}>
          {report.profit >= 0 ? '+' : ''}¥{report.profit}
        </Text>
      </View>
      <View className={styles.roiSection}>
        <View className={styles.roiBar}>
          <View className={styles.roiFill} style={{ width: `${Math.min(report.roi * 200, 100)}%` }} />
        </View>
        <View className={styles.roiInfo}>
          <Text className={styles.roiLabel}>投入产出比</Text>
          <Text className={styles.roiValue}>{roiPercent}%</Text>
        </View>
      </View>
      <View className={styles.bestTime}>
        <Text className={styles.bestTimeLabel}>最佳时段</Text>
        <Text className={styles.bestTimeValue}>{report.bestTimeSlot}</Text>
      </View>
      <View className={styles.preparation}>
        <Text className={styles.preparationTitle}>下次准备清单</Text>
        <View className={styles.preparationList}>
          {report.nextPreparationList.map((item, index) => (
            <View key={index} className={styles.preparationItem}>
              <Text className={styles.checkIcon}>✓</Text>
              <Text className={styles.preparationText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}