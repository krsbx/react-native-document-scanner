import { View } from 'react-native';
import 'react-native-rectangle-scanner';

declare module 'react-native-rectangle-scanner' {
  export interface ScannerView extends View {
    capture: () => void;
    refresh: () => void;
    focus: () => void;
  }
}
