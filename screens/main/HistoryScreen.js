import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { light, dark } from '../../theme/color';

const transactions = [
  { id: '1', title: 'Diploma Request', status: 'Issued', date: '2025-09-20' },
  { id: '2', title: 'Transcript of Records', status: 'Pending', date: '2025-09-22' },
  { id: '3', title: 'Certificate of Grades', status: 'Paid', date: '2025-09-23' },
];

export default function HistoryScreen() {
  const darkMode = useSelector(state => state.settings.darkMode);
  const colors = darkMode ? dark : light;

  const renderItem = ({ item }) => (
    <View style={[styles.item, { borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.date, { color: colors.sub }]}>{item.date}</Text>
      </View>
      <View style={[
        styles.badge, 
        item.status === 'Issued' && { backgroundColor: '#28a745' },
        item.status === 'Pending' && { backgroundColor: '#ffc107' },
        item.status === 'Paid' && { backgroundColor: '#007bff' }
      ]}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>Transaction History</Text>
      <FlatList 
        data={transactions} 
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  title: { fontSize: 16, fontWeight: '500' },
  date: { fontSize: 12 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeText: { color: '#fff', fontWeight: 'bold' }
});
