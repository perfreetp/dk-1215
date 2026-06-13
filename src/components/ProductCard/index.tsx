import React from 'react';
import { View, Text } from '@tarojs/components';
import type { Product } from '@/types';
import styles from './index.module.scss';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const profit = (product.price - product.costPrice) * product.sold;
  const stockPercent = (product.stock / (product.stock + product.sold)) * 100;

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.name}>{product.name}</Text>
        <Text className={styles.price}>¥{product.price}</Text>
      </View>
      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>售出</Text>
          <Text className={styles.statValue}>{product.sold}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>库存</Text>
          <Text className={`${styles.statValue} ${product.stock < 10 ? styles.lowStock : ''}`}>{product.stock}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>利润</Text>
          <Text className={styles.statValueProfit}>¥{profit}</Text>
        </View>
      </View>
      <View className={styles.stockBar}>
        <View className={styles.stockFill} style={{ width: `${stockPercent}%` }} />
      </View>
      <View className={styles.suggestion}>
        <Text className={styles.suggestionTitle}>补货建议</Text>
        <Text className={styles.suggestionText}>{product.restockSuggestion}</Text>
      </View>
      <View className={styles.note}>
        <Text className={styles.noteTitle}>价格调整</Text>
        <Text className={styles.noteText}>{product.priceAdjustmentNote}</Text>
      </View>
    </View>
  );
}