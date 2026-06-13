import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore, useCurrentSession, usePreparationList } from '@/store';
import styles from './index.module.scss';
import type { LocationCompare, PreparationItem } from '@/types';

const safeParse = (val: string): number => {
  const parsed = parseInt(val);
  return isNaN(parsed) ? 0 : parsed;
};

function generateSuggestions(incomeRecord, products) {
  const suggestions: PreparationItem[] = [];
  const totalIncome = (incomeRecord?.mobilePayment || 0) + (incomeRecord?.cashIncome || 0);
  const totalExpense = (incomeRecord?.boothFee || 0) + (incomeRecord?.transportFee || 0) + (incomeRecord?.preparationAmount || 0);
  const profit = totalIncome - totalExpense;
  const salesVolume = incomeRecord?.salesVolume || 0;
  
  if (profit < 0) {
    suggestions.push({ id: 's1', text: '⚠️ 本场亏损，建议分析成本结构', checked: false });
  } else if (profit < 100) {
    suggestions.push({ id: 's2', text: '💡 利润较低，考虑调整定价或成本', checked: false });
  }
  
  if ((incomeRecord?.preparationAmount || 0) > totalIncome * 0.6) {
    suggestions.push({ id: 's3', text: '📦 备货成本过高，优化备货策略', checked: false });
  }
  
  if (salesVolume < 10) {
    suggestions.push({ id: 's4', text: '📉 销量较少，考虑营销或产品调整', checked: false });
  }
  
  const lowStockProducts = products.filter(p => p.stock < 5);
  if (lowStockProducts.length > 0) {
    suggestions.push({ id: 's5', text: `🔄 补货提醒：${lowStockProducts.map(p => p.name).join('、')}`, checked: false });
  }
  
  suggestions.push({ id: 's6', text: '✅ 准备零钱和收款码', checked: false });
  suggestions.push({ id: 's7', text: '✅ 检查摊位布置和展示道具', checked: false });
  suggestions.push({ id: 's8', text: '✅ 准备好价目表和宣传材料', checked: false });
  
  return suggestions;
}

export default function ReportPage() {
  const { state, dispatch } = useStore();
  const currentSession = useCurrentSession();
  const savedPreparationList = usePreparationList(currentSession?.id || '');
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState(state.target.amount.toString());
  const [targetDeadline, setTargetDeadline] = useState(state.target.deadline);
  
  const currentIncomeRecord = state.incomeRecords.find(i => i.sessionId === currentSession?.id);
  
  const mobilePayment = currentIncomeRecord?.mobilePayment || 0;
  const cashIncome = currentIncomeRecord?.cashIncome || 0;
  const totalIncome = mobilePayment + cashIncome;
  
  const boothFee = currentIncomeRecord?.boothFee || 0;
  const transportFee = currentIncomeRecord?.transportFee || 0;
  const preparationAmount = currentIncomeRecord?.preparationAmount || 0;
  const totalExpense = boothFee + transportFee + preparationAmount;
  
  const profit = totalIncome - totalExpense;
  const roi = totalExpense > 0 ? profit / totalExpense : 0;
  
  const incomeSalesVolume = currentIncomeRecord?.salesVolume || 0;
  const productSalesVolume = state.products.reduce((sum, p) => sum + p.sold, 0);
  const salesDiff = Math.abs(incomeSalesVolume - productSalesVolume);
  const hasSalesMismatch = salesDiff > 5 && incomeSalesVolume > 0 && productSalesVolume > 0;
  
  const preparationList = useMemo(() => {
    if (savedPreparationList.length > 0) {
      return savedPreparationList;
    }
    return generateSuggestions(currentIncomeRecord, state.products);
  }, [savedPreparationList, currentIncomeRecord, state.products]);

  const locationComparison: LocationCompare[] = useMemo(() => {
    const locationMap = new Map<string, { totalIncome: number; totalExpense: number; bestProfit: number; count: number }>();
    
    state.sessions.forEach(session => {
      const incomeRecord = state.incomeRecords.find(i => i.sessionId === session.id);
      if (incomeRecord) {
        const sessionIncome = incomeRecord.mobilePayment + incomeRecord.cashIncome;
        const sessionExpense = incomeRecord.boothFee + incomeRecord.transportFee + incomeRecord.preparationAmount;
        const sessionProfit = sessionIncome - sessionExpense;
        
        const existing = locationMap.get(session.location) || { 
          totalIncome: 0, 
          totalExpense: 0, 
          bestProfit: -Infinity, 
          count: 0 
        };
        
        locationMap.set(session.location, {
          totalIncome: existing.totalIncome + sessionIncome,
          totalExpense: existing.totalExpense + sessionExpense,
          bestProfit: Math.max(existing.bestProfit, sessionProfit),
          count: existing.count + 1
        });
      }
    });

    return Array.from(locationMap.entries()).map(([location, data]) => ({
      location,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
      totalProfit: data.totalIncome - data.totalExpense,
      avgProfit: data.count > 0 ? (data.totalIncome - data.totalExpense) / data.count : 0,
      bestProfit: data.bestProfit === -Infinity ? 0 : data.bestProfit,
      count: data.count
    }));
  }, [state.sessions, state.incomeRecords]);

  const totalProfit = locationComparison.reduce((sum, loc) => sum + loc.totalProfit, 0);
  const targetProgress = state.target.amount > 0 ? Math.round((totalProfit / state.target.amount) * 100) : 0;

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
        amount: safeParse(targetAmount),
        deadline: targetDeadline,
        progress: targetProgress
      }
    });
    setShowTargetModal(false);
    Taro.showToast({
      title: '目标已设置',
      icon: 'success'
    });
  };

  const togglePreparationItem = (itemId: string) => {
    const updatedList = preparationList.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    dispatch({
      type: 'UPDATE_PREPARATION_LIST',
      payload: { sessionId: currentSession?.id || '', items: updatedList }
    });
  };

  const roiPercent = (roi * 100).toFixed(1);
  const bestTimeSlot = currentSession?.startTime && currentSession?.endTime 
    ? `${currentSession.startTime}-${currentSession.endTime}` 
    : '暂无数据';

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
          <View className={styles.targetProgressFill} style={{ width: `${Math.min(targetProgress, 100)}%` }} />
        </View>
        <View className={styles.targetInfo}>
          <Text className={styles.targetAmount}>累计利润: ¥{totalProfit} / 目标: ¥{state.target.amount}</Text>
          <Text className={styles.targetPercent}>{targetProgress}%</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          <Text>本场数据</Text>
        </Text>
        
        <View className={styles.reportSummary}>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>总收入</Text>
              <Text className={styles.summaryValue}>¥{totalIncome}</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>总支出</Text>
              <Text className={styles.summaryValueExpense}>¥{totalExpense}</Text>
            </View>
          </View>
          
          <View className={styles.profitSection}>
            <Text className={styles.profitLabel}>本场利润</Text>
            <Text className={`${styles.profitValue} ${profit >= 0 ? styles.profit : styles.loss}`}>
              {profit >= 0 ? '+' : ''}¥{profit}
            </Text>
          </View>
          
          <View className={styles.roiSection}>
            <View className={styles.roiBar}>
              <View className={styles.roiFill} style={{ width: `${Math.min(Math.max(roi * 200, 0), 100)}%` }} />
            </View>
            <View className={styles.roiInfo}>
              <Text className={styles.roiLabel}>投入产出比</Text>
              <Text className={styles.roiValue}>{roiPercent}%</Text>
            </View>
          </View>
          
          <View className={styles.bestTime}>
            <Text className={styles.bestTimeLabel}>营业时段</Text>
            <Text className={styles.bestTimeValue}>{bestTimeSlot}</Text>
          </View>
        </View>
        
        {hasSalesMismatch && (
          <View className={styles.warningCard}>
            <Text className={styles.warningTitle}>
              <Text>⚠️</Text>
              <Text>销量核对提醒</Text>
            </Text>
            <Text className={styles.warningText}>
              收支录入的销量({incomeSalesVolume}件)与商品售出数量({productSalesVolume}件)相差{salesDiff}件，建议检查是否漏记
            </Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>✅</Text>
          <Text>下次准备清单</Text>
        </Text>
        <View className={styles.preparationList}>
          {preparationList.map(item => (
            <View 
              key={item.id} 
              className={styles.preparationItem}
              onClick={() => togglePreparationItem(item.id)}
            >
              <View className={`${styles.preparationCheckbox} ${item.checked ? styles.checked : ''}`}>
                {item.checked && <Text className={styles.checkIcon}>✓</Text>}
              </View>
              <Text className={`${styles.preparationText} ${item.checked ? styles.checked : ''}`}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📍</Text>
          <Text>地点对比</Text>
        </Text>
        {locationComparison.length > 0 ? (
          <View className={styles.locationCompare}>
            {locationComparison.map((item, index) => (
              <View key={index} className={styles.locationItem}>
                <View className={styles.locationInfo}>
                  <Text className={styles.locationName}>{item.location}</Text>
                  <Text className={styles.locationCount}>{item.count}场</Text>
                </View>
                <View className={styles.locationStats}>
                  <Text className={styles.locationProfit}>
                    {item.count > 0 ? `¥${item.totalProfit.toFixed(0)}` : '暂无数据'}
                  </Text>
                  <Text className={styles.locationAvg}>
                    {item.count > 0 ? `场均 ¥${item.avgProfit.toFixed(0)}` : ''}
                  </Text>
                  <Text className={styles.locationBest}>
                    {item.count > 0 && item.bestProfit > 0 ? `最高 ¥${item.bestProfit.toFixed(0)}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📍</Text>
            <Text className={styles.emptyText}>暂无地点数据，添加场次并录入收支后将自动统计</Text>
          </View>
        )}
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
                onInput={(e) => setTargetAmount(e.detail.value)}
                placeholder="输入目标金额"
              />
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>截止日期</Text>
              <Input 
                className={styles.formInput}
                value={targetDeadline}
                onInput={(e) => setTargetDeadline(e.detail.value)}
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