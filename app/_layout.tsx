import { View } from 'react-native';
import Header from './components/Header';
import './globals.css';

export default function RootLayout() {

  return (
<View style={{flex: 1}}>
    <Header/>
</View>
  );
}
