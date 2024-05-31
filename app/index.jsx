import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-web';



export default function App() {
    //defined two states product & search in the component
    const [products, setProduct] = useState([]);
    const [search, setSearch] = useState('');
    //added loading and error state
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    //here i am handling the data fetching with axios
    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://dummyjson.com/products');
            setProduct(response.data.products);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    // i am performing side effect here
    useEffect(() => {
        getProducts();
    }, []);

    //renderItem like card data and passing a prop of item 
    const renderItem = ({ item }) => {
        return (
            <View style={styles.cardContainer}>
                <Image style={styles.image} source={{ uri: item.images[0] }} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text>Category:{item.category}</Text>
                    <Text>StockAvailable:{item.stock}</Text>
                    <Text>Rating:{item.rating}</Text>
                </View>
            </View>
        )
    }

    //Search method
    //useMemo:- is going to help to search from memoized values(or cache you can say) of product it will improve the performance in our application
    const filteredProduct = useMemo(() => {
        return products.filter(item => {
            return item.title.toLowerCase().includes(search.toLowerCase());
        })
    }, [products, search]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
            <View style={styles.container}>
                <Text style={styles.mainTitle}>Products</Text>
                <TextInput placeholder='Search Product' style={styles.searchInput} value={search} onChangeText={text => setSearch(text)} />
                {error ? (
                    <Text>Error: {error.message}</Text>
                ) : loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : filteredProduct.length > 0 ? (
                    <FlatList data={filteredProduct} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
                ) : search ? (
                    <Text>No products found</Text>
                ) : null}
                <StatusBar style="auto" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        margin: 1,
    },
    cardContainer: {
        flexDirection: 'row',
        borderWidth: 5,
        padding: 10,
        margin: 10,
        borderColor: '#131413',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
        marginRight: 10,
    },
    title: {
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
    mainTitle: {
        fontWeight: 'bold',
    }
});
