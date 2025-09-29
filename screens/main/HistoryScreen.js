import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { light, dark } from "../../theme/color";
import { API_URL } from "../../config";

export default function HistoryScreen() {
  const darkMode = useSelector((state) => state.settings.darkMode);
  const colors = darkMode ? dark : light;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/mobile/vc-request/mine`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await res.json();
      console.log("Fetched transactions:", data);
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedTransaction(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={[styles.item, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{item.type}</Text>
          <Text style={[styles.date, { color: colors.sub }]}>
            {new Date(item.createdAt).toLocaleDateString()}{" "}
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            item.status === "issued" && { backgroundColor: "#28a745" },
            item.status === "pending" && { backgroundColor: "#ffc107" },
            item.status === "approved" && { backgroundColor: "#007bff" },
            item.status === "rejected" && { backgroundColor: "red" },
          ]}
        >
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", backgroundColor: colors.bg },
        ]}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>Transaction History</Text>

      {transactions.length === 0 ? (
        <View style={[styles.emptyBox, { borderColor: colors.border }]}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>No requests yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Transaction Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.bg }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Transaction Details
              </Text>

              {selectedTransaction && (
                <>
                  <Text style={[styles.label, { color: colors.sub }]}>Type:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {selectedTransaction.type}
                  </Text>

                  <Text style={[styles.label, { color: colors.sub }]}>Course:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {selectedTransaction.course}
                  </Text>

                  <Text style={[styles.label, { color: colors.sub }]}>
                    Year Graduated:
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {selectedTransaction.yearGraduated || "N/A"}
                  </Text>

                  <Text style={[styles.label, { color: colors.sub }]}>Status:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {selectedTransaction.status}
                  </Text>

                  <Text style={[styles.label, { color: colors.sub }]}>Created At:</Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </Text>
                </>
              )}

              <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeText: { color: "#fff", fontWeight: "bold" },
  emptyBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    borderRadius: 10,
    padding: 15,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 14, marginTop: 10, fontWeight: "500" },
  value: { fontSize: 16, fontWeight: "400" },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
