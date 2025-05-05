import Modal from 'react-native-modal';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#22223b'
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center'
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center'
  },
});

const DeleteConfirmationModal = ({
  visible,
  title = "Delete",
  message,
  onDelete,
  onCancel,
  deleteLabel = "Delete",
  cancelLabel = "Cancel"
}: {
  visible: boolean;
  title?: string;
  message: string;
  onDelete: () => void;
  onCancel: () => void;
  deleteLabel?: string;
  cancelLabel?: string;
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={onCancel}
    onBackButtonPress={onCancel}
    style={{ justifyContent: 'flex-end', margin: 0 }}
    backdropOpacity={0.4}
  >
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>{deleteLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default DeleteConfirmationModal; 