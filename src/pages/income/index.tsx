import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore, useCurrentSession, useIncomeRecord } from '@/store';
import styles from './index.module.scss';

export default function IncomePage() {
  const { dispatch } = useStore();
  const currentSession = useCurrentSession();
  const existingRecord = useIncomeRecord(currentSession?.id || '');
  
  const [formData, setFormData] = useState({
    boothFee: '',
    transportFee: '',
    preparationAmount: '',
    salesVolume: '',
    mobilePayment: '',
    cashIncome: '',
    notes: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (existingRecord) {
      setFormData({
        boothFee: existingRecord.boothFee.toString(),
        transportFee: existingRecord.transportFee.toString(),
        preparationAmount: existingRecord.preparationAmount.toString(),
        salesVolume: existingRecord.salesVolume.toString(),
        mobilePayment: existingRecord.mobilePayment.toString(),
        cashIncome: existingRecord.cashIncome.toString(),
        notes: existingRecord.notes
      });
    }
  }, [existingRecord, currentSession]);

  const totalExpense = parseInt(formData.boothFee) + parseInt(formData.transportFee) + parseInt(formData.preparationAmount) || 0;
  const totalIncome = parseInt(formData.mobilePayment) + parseInt(formData.cashIncome) || 0;

  const handleTakePhoto = () => {
    Taro.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setPhotos([...photos, ...res.tempFilePaths]);
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const record = {
      id: existingRecord?.id || Date.now().toString(),
      sessionId: currentSession.id,
      boothFee: parseInt(formData.boothFee) || 0,
      transportFee: parseInt(formData.transportFee) || 0,
      preparationAmount: parseInt(formData.preparationAmount) || 0,
      salesVolume: parseInt(formData.salesVolume) || 0,
      mobilePayment: parseInt(formData.mobilePayment) || 0,
      cashIncome: parseInt(formData.cashIncome) || 0,
      notes: formData.notes
    };

    if (existingRecord) {
      dispatch({ type: 'UPDATE_INCOME_RECORD', payload: record });
    } else {
      dispatch({ type: 'ADD_INCOME_RECORD', payload: record });
    }

    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>收支录入</Text>
      </View>

      <View className={styles.currentSession}>
        <Text className={styles.sessionLabel}>当前场次</Text>
        <Text className={styles.sessionValue}>{currentSession?.location || '未选择场次'} - {currentSession?.date}</Text>
      </View>

      <View className={styles.takePhotoSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📷</Text>
          <Text>摊位布置拍照</Text>
        </Text>
        {photos.length > 0 && (
          <View className={styles.photoPreview}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image className={styles.photoImage} src={photo} mode="aspectFill" />
                <View className={styles.photoRemove} onClick={() => handleRemovePhoto(index)}>
                  <Text className={styles.removeIcon}>×</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className={styles.photoButton} onClick={handleTakePhoto}>
          <Text className={styles.photoIcon}>📸</Text>
          <Text className={styles.photoText}>拍照或从相册选择</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💰</Text>
          <Text>支出记录</Text>
        </Text>
        
        <View className={styles.formRow}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>摊位费</Text>
            <Input 
              className={styles.formInput}
              type="number"
              value={formData.boothFee}
              onChange={(e) => setFormData({ ...formData, boothFee: e.detail.value })}
              placeholder="0"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>交通费</Text>
            <Input 
              className={styles.formInput}
              type="number"
              value={formData.transportFee}
              onChange={(e) => setFormData({ ...formData, transportFee: e.detail.value })}
              placeholder="0"
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备货成本</Text>
          <Input 
            className={styles.formInput}
            type="number"
            value={formData.preparationAmount}
            onChange={(e) => setFormData({ ...formData, preparationAmount: e.detail.value })}
            placeholder="0"
          />
        </View>

        <View className={styles.divider} />

        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>总支出</Text>
          <Text className={styles.totalValue} style={{ color: '#f53f3f' }}>¥{totalExpense}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💵</Text>
          <Text>收入记录</Text>
        </Text>
        
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>现场销量（件）</Text>
          <Input 
            className={styles.formInput}
            type="number"
            value={formData.salesVolume}
            onChange={(e) => setFormData({ ...formData, salesVolume: e.detail.value })}
            placeholder="0"
          />
        </View>

        <View className={styles.formRow}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>移动收款</Text>
            <Input 
              className={styles.formInput}
              type="number"
              value={formData.mobilePayment}
              onChange={(e) => setFormData({ ...formData, mobilePayment: e.detail.value })}
              placeholder="0"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>现金收入</Text>
            <Input 
              className={styles.formInput}
              type="number"
              value={formData.cashIncome}
              onChange={(e) => setFormData({ ...formData, cashIncome: e.detail.value })}
              placeholder="0"
            />
          </View>
        </View>

        <View className={styles.divider} />

        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>总收入</Text>
          <Text className={styles.totalValue}>¥{totalIncome}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          <Text>利润计算</Text>
        </Text>
        
        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>本场利润</Text>
          <Text className={`${styles.totalValue} ${totalIncome - totalExpense >= 0 ? '' : 'color: #f53f3f'}`}>
            {totalIncome - totalExpense >= 0 ? '+' : ''}¥{totalIncome - totalExpense}
          </Text>
        </View>
      </View>

      <View className={styles.notesSection}>
        <Text className={styles.notesLabel}>备注</Text>
        <Input 
          className={styles.notesInput}
          type="textarea"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.detail.value })}
          placeholder="记录本场摆摊的感受和心得..."
        />
      </View>

      <View className={styles.saveButton} onClick={handleSave}>
        <Text className={styles.saveButtonText}>保存记录</Text>
      </View>
    </ScrollView>
  );
}