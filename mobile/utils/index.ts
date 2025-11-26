import { Platform } from "react-native"
import { Alert } from "react-native"

export const showAlert = (msg: string) => {
    if (Platform.OS === 'web') window.alert(msg)
    else Alert.alert(msg)
}