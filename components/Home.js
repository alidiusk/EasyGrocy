import { StatusBar } from 'expo-status-bar';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image,
} from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.grocyText}>Home</Text>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#7FC8A9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    grocyText: {
      color: "floralwhite",
      fontSize: 50,
      textAlign: "center",
    },
});

export default Home;