import { Text, View, TouchableOpacity, Alert } from "react-native";
import { testFirebaseConnection } from "../src/services/firebaseTest";

export default function Index() {
  const handleTestFirebase = async () => {
    const isConnected = await testFirebaseConnection();
    Alert.alert(
      "Firebase Test", 
      isConnected ? "✅ Connection successful!" : "❌ Connection failed - check console for details"
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 30, textAlign: "center" }}>
        EzSupply - Vacation House Supplies
      </Text>
      
      <TouchableOpacity
        onPress={handleTestFirebase}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Test Firebase Connection
        </Text>
      </TouchableOpacity>
      
      <Text style={{ color: "#666", textAlign: "center" }}>
        Tap the button to test if Firebase is properly configured
      </Text>
    </View>
  );
}
