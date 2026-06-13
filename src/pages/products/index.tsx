import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { useStore } from '@/store';
import ProductCard from '@/components/ProductCard';
import styles from './index.module.scss';

type FilterType = 'all' | 'best' | 'lowStock';

export default function ProductsPage() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    stock: '',
    sold: '0'
  });

  const filteredProducts = state.products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'best') return product.sold > 5;
    if (filter === 'lowStock') return product.stock < 10;
    return true;
  });

  const totalSold = state.products.reduce((sum, p) => sum + p.sold, 0);
  const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0);
  const totalProfit = state.products.reduce((sum, p) => sum + (p.price - p.costPrice) * p.sold, 0);

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price) || 0,
      costPrice: parseInt(formData.costPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      sold: parseInt(formData.sold) || 0,
      restockSuggestion: '',
      priceAdjustmentNote: ''
    };
    dispatch({ type: 'UPDATE_PRODUCT', payload: newProduct });
    setShowModal(false);
    setFormData({ name: '', price: '', costPrice: '', stock: '', sold: '0' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>商品表现</Text>
        <View className={styles.addButton} onClick={() => setShowModal(true)}>
          <Text className={styles.addIcon}>+</Text>
        </View>
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
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无商品记录</Text>
          </View>
        )}
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加商品</Text>
            
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

            <View className={styles.modalButtons}>
              <View className={`${styles.modalButton} ${styles.cancel}`} onClick={() => setShowModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={`${styles.modalButton} ${styles.confirm}`} onClick={handleAddProduct}>
                <Text>确认添加</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}