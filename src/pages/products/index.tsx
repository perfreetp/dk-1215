import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore, useCurrentSession, useSessionProducts } from '@/store';
import styles from './index.module.scss';
import type { Product } from '@/types';

type FilterType = 'all' | 'best' | 'lowStock';

export default function ProductsPage() {
  const { state, dispatch } = useStore();
  const currentSession = useCurrentSession();
  const sessionProducts = useSessionProducts(currentSession?.id || '');
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    stock: '',
    sold: '',
    restockSuggestion: '',
    priceAdjustmentNote: ''
  });

  const filteredProducts = sessionProducts.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'best') return product.sold > 5;
    if (filter === 'lowStock') return product.stock < 10;
    return true;
  });

  const totalSold = sessionProducts.reduce((sum, p) => sum + p.sold, 0);
  const totalStock = sessionProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalProfit = sessionProducts.reduce((sum, p) => sum + (p.price - p.costPrice) * p.sold, 0);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      costPrice: '',
      stock: '',
      sold: '',
      restockSuggestion: '',
      priceAdjustmentNote: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      stock: product.stock.toString(),
      sold: product.sold.toString(),
      restockSuggestion: product.restockSuggestion,
      priceAdjustmentNote: product.priceAdjustmentNote
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }
    
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      sessionId: currentSession?.id || '',
      name: formData.name.trim(),
      price: parseInt(formData.price) || 0,
      costPrice: parseInt(formData.costPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      sold: parseInt(formData.sold) || 0,
      restockSuggestion: formData.restockSuggestion,
      priceAdjustmentNote: formData.priceAdjustmentNote
    };

    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
    
    setShowAddModal(false);
    setEditingProduct(null);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>商品表现</Text>
        <View className={styles.addButton} onClick={handleOpenAddModal}>
          <Text className={styles.addIcon}>+</Text>
        </View>
      </View>

      <View className={styles.currentSession}>
        <Text className={styles.sessionLabel}>当前场次</Text>
        <Text className={styles.sessionValue}>{currentSession?.location || '未选择场次'} - {currentSession?.date}</Text>
      </View>

      <View className={styles.summaryCards}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>总销量</Text>
          <Text className={styles.summaryValue}>{totalSold}</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>总库存</Text>
          <Text className={styles.summaryValue}>{totalStock}</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryLabel}>总利润</Text>
          <Text className={styles.summaryValueProfit}>¥{totalProfit}</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        <View 
          className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          <Text>全部商品</Text>
        </View>
        <View 
          className={`${styles.filterTab} ${filter === 'best' ? styles.active : ''}`}
          onClick={() => setFilter('best')}
        >
          <Text>畅销款</Text>
        </View>
        <View 
          className={`${styles.filterTab} ${filter === 'lowStock' ? styles.active : ''}`}
          onClick={() => setFilter('lowStock')}
        >
          <Text>库存不足</Text>
        </View>
      </View>

      <View className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const profit = (product.price - product.costPrice) * product.sold;
            const stockPercent = product.stock > 0 ? Math.min((product.stock / 30) * 100, 100) : 0;
            
            return (
              <View key={product.id} className={styles.productCard}>
                <View className={styles.productHeader}>
                  <Text className={styles.productName}>{product.name}</Text>
                  <Text className={styles.productEdit} onClick={() => handleOpenEditModal(product)}>✏️</Text>
                </View>
                
                <View className={styles.productRow}>
                  <View className={styles.productPrice}>
                    <Text className={styles.priceLabel}>售价</Text>
                    <Text className={styles.priceValue}>¥{product.price}</Text>
                  </View>
                  <View className={styles.productCost}>
                    <Text className={styles.costLabel}>成本</Text>
                    <Text className={styles.costValue}>¥{product.costPrice}</Text>
                  </View>
                </View>
                
                <View className={styles.productRow}>
                  <View className={styles.productSold}>
                    <Text className={styles.soldLabel}>已售</Text>
                    <Text className={styles.soldValue}>{product.sold}件</Text>
                  </View>
                  <View className={styles.productStock}>
                    <Text className={styles.stockLabel}>库存</Text>
                    <Text className={styles.stockValue}>{product.stock}件</Text>
                  </View>
                  <View className={styles.productProfit}>
                    <Text className={styles.profitLabel}>利润</Text>
                    <Text className={styles.profitValue}>¥{profit}</Text>
                  </View>
                </View>
                
                <View className={styles.stockProgress}>
                  <View className={styles.stockBar}>
                    <View 
                      className={`${styles.stockFill} ${stockPercent < 30 ? styles.lowStock : ''}`} 
                      style={{ width: `${stockPercent}%` }} 
                    />
                  </View>
                  <Text className={`${styles.stockText} ${stockPercent < 30 ? styles.lowStock : ''}`}>
                    {stockPercent < 30 ? '⚠️ 库存紧张' : `库存充足 (${product.stock}件)`}
                  </Text>
                </View>
                
                {product.restockSuggestion && (
                  <View className={styles.productNote}>
                    <Text className={styles.noteLabel}>补货建议：</Text>
                    <Text className={styles.noteText}>{product.restockSuggestion}</Text>
                  </View>
                )}
                
                {product.priceAdjustmentNote && (
                  <View className={styles.productNote}>
                    <Text className={styles.noteLabel}>价格备注：</Text>
                    <Text className={styles.noteText}>{product.priceAdjustmentNote}</Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无商品记录</Text>
          </View>
        )}
      </View>

      {showAddModal && (
        <View className={styles.modalOverlay} onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>{editingProduct ? '编辑商品' : '添加商品'}</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>商品名称</Text>
              <Input 
                className={styles.formInput}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.detail.value })}
                placeholder="如：手工陶瓷杯"
              />
            </View>
            
            <View className={styles.formRow}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>售价</Text>
                <Input 
                  className={styles.formInput}
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.detail.value })}
                  placeholder="0"
                />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>成本</Text>
                <Input 
                  className={styles.formInput}
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.detail.value })}
                  placeholder="0"
                />
              </View>
            </View>

            <View className={styles.formRow}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>库存</Text>
                <Input 
                  className={styles.formInput}
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.detail.value })}
                  placeholder="0"
                />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>已售</Text>
                <Input 
                  className={styles.formInput}
                  type="number"
                  value={formData.sold}
                  onChange={(e) => setFormData({ ...formData, sold: e.detail.value })}
                  placeholder="0"
                />
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>补货建议</Text>
              <Input 
                className={styles.formInput}
                value={formData.restockSuggestion}
                onChange={(e) => setFormData({ ...formData, restockSuggestion: e.detail.value })}
                placeholder="如：建议补货20个"
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>价格调整备注</Text>
              <Input 
                className={styles.formInput}
                value={formData.priceAdjustmentNote}
                onChange={(e) => setFormData({ ...formData, priceAdjustmentNote: e.detail.value })}
                placeholder="如：定价合理，销量稳定"
              />
            </View>

            <View className={styles.modalButtons}>
              <View className={`${styles.modalButton} ${styles.cancel}`} onClick={() => { setShowAddModal(false); setEditingProduct(null); }}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalButton} ${styles.confirm}`} onClick={handleSaveProduct}>
                <Text>{editingProduct ? '保存修改' : '确认添加'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}