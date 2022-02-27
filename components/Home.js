import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity,
    TouchableHighlight,
    SafeAreaView,
    TextInput,
    Pressable,
    Modal,
    Image,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import localData from "./localData";
import useToken from "./useToken";

const staticInventory = [{
    key: 1,
    name: "banana",
    price: "$4.45",
    quantity: "5",
    path: require("../assets/Food/banana.png")
},
{
    key: 2,
    name: "bread",
    price: "2.99",
    quantity: "1",
    path: require("../assets/Food/bread.png")
},
{
    key: 3,
    name: "cheese",
    price: "$4.99",
    quantity: "2",
    path: require("../assets/Food/cheese.png")
},
{
    key: 4,
    name: "apple",
    price: "2.00",
    quantity: "3",
    path: require("../assets/Food/apple.png")
},
{
    key: 5,
    name: "fries",
    price: "$3.99",
    quantity: "1",
    path: require("../assets/Food/fries.png")
},
{
    key: 6,
    name: "milk",
    price: "$4.01",
    quantity: "1",
    path: require("../assets/Food/milk.png")
},

]


const Home = ({navigation}) => {
    const [listData, setListData] = useState(staticInventory);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPrice, setModalPrice] = useState(0);
    const [modalName, setModalName] = useState("");
    const [squad, setSquadName] = useState("");
    // const [listData, setListData] = useState(Array());
    const {getToken, removeToken, setToken} = useToken();
    const {getUserId, setUserId, removeUserId, getGroupId, getGroupName} = localData();

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // The screen is focused
          // Call any action
          getGroupName().then((squad) => setSquadName(squad));
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

    const getItems = async () => {
        // getUserId().then((id) => console.log(id));
        // insert getGroupId() func
        const group = await getGroupId();
        if (group) {
            getToken().then((token) => {
                fetch(`https://easygrocy.com/api/group/${group}/items`, {
                headers: {'Authorization': 'Bearer ' + token}
            })
                .then((response) => {
                    if(!response.ok) throw new Error(response.status);
                    else return response.json();
                })
                .then((json) => {
                    // console.log(json.items);
                    let items = json.items;
                    let new_arr = Array(items.length);
                    for(let i in items){
                        new_arr[i] = {key: `${i}`, text: `${items[i].name}`}
                    }
                    // console.log(new_arr);
                    setListData(new_arr);
                })
            });
        } else {
            console.log("Group was NULL");
        }
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    const addToCart = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        const oldData = newData[prevIndex]
        // Send back to shopping cart
        console.log(oldData);
        newData.splice(prevIndex, 1);
        setListData(newData);
    }

    const renderItem = data => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#D5EEBB'}
        >
            <View style={{flexDirection: "row", flex: 1, justifyContent: "flex-start", alignItems: "center"}}>
                <Image 
                    style = {styles.cellImage}
                    source = {data.item.path}>
                </Image>
                <View style={{flexDirection: "column"}}
                >
                    <Text style={styles.itemText1}>{data.item.name}</Text>
                    <Text style={styles.itemText1}>{data.item.price}</Text>
                </View>
                <View style={{alignItems: "flex-end"}}>
                    <Text style={styles.itemText1}>Qt: {data.item.quantity}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.backLeftBtn}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.itemText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.backRightBtn}
                onPress={() => addToCart(rowMap, data.item.key)}
            >
                <Text style={styles.itemText}>Cart</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>New Item:</Text>
                        
                        <TextInput
                            onChangeText={(modalName) => setModalName(modalName)}
                            placeholder='name'
                            placeholderTextColor="#5F7A61"
                            style={styles.modalInputField}
                            autoComplete={false}
                        >
                        </TextInput>
                        <TextInput
                            placeholder={`price: $${modalPrice}`}
                            placeholderTextColor="#5F7A61"
                            style={styles.modalInputField}
                            keyboardType='decimal-pad'
                            // value={"$" + modalPrice}
                            // onChangeText={(modalPrice) => setModalPrice(modalPrice)}
                        ></TextInput>   
                        <TextInput
                            onChangeText={() => console.log("EDIT")}
                            placeholder='quantity'
                            placeholderTextColor="#5F7A61"
                            style={styles.modalInputField}
                            keyboardType='numeric'
                        ></TextInput> 
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                // setListData(listData.push({key: `${modalName}`, text: `item#${modalPrice}`}))
                                console.log(modalName);
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.textStyle}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={{flex: 5, }}>
                <TextInput
                    autoCapitalize='none'
                    autoCorrect={true}
                    onChangeText={() => console.log("Hi")}
                    status='info'
                    placeholder='Search'
                    style={styles.searchInput}
                    textStyle={{ color: '#000' }}
                />
            </View>
            <View style={{flex: 1}}>
                <TouchableOpacity style={styles.newItemBtn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.newItemButton}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenHeader}>{squad ? `${squad} - ` : ""}Inventory</Text>
            <SwipeListView
                style={styles.swipeList}
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-75}
                previewOpenDelay={3000}
                ListHeaderComponent={renderHeader}
                stickyHeaderIndices={[0]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#7FC8A9',
        flex: 1,
    },
    swipeList: {
        marginTop: 15,
        backgroundColor: "#5F7A61",
    },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#7FC8A9',
        borderBottomColor: 'floralwhite',
        borderBottomWidth: 1,
        justifyContent: 'center',
        flex: 1,
        height: 80,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'floralwhite',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: 80,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: 80,
        backgroundColor: '#5F7A61',
        right: 0
    },
    backLeftBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: 80,
        backgroundColor: 'tomato',
        left: 0
    },
    itemText: {
        color: "floralwhite"
    },
    itemText1: {
        color: "floralwhite",
        fontSize: 20,
        marginHorizontal: 30,
    },
    searchInput: {
        height: 50,
        backgroundColor: "floralwhite",
        padding: 15
    },
    screenHeader: {
        color: "floralwhite",
        textAlign: "center",
        fontSize: 20,
    },
    newItemButton: {
        color: "floralwhite",
        fontSize: 40,
    },
    headerView: {
        backgroundColor: "#444941",
        flexDirection: "row",
        
    },
    newItemBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      modalView: {
        backgroundColor: "floralwhite",
        borderRadius: 40,
        width: 300,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
      },
      button: {
        borderRadius: 20,
        width: 100,
        height: 40,
        backgroundColor: "#444941",
        justifyContent: "center",
        alignItems: "center",
      },
      textStyle: {
        color: "floralwhite",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        textAlign: "center",
        color: "#5F7A61",
        fontWeight: "bold",
      },
      modalInputField: {
        backgroundColor: "#D5EEBB",
        width: 250,
        height: 40,
        textAlign: "center",
        margin: 10,
        color: "#444941",
      },
      cellImage: {
          width: 50,
          height: 50,
          marginHorizontal: 50,
      }
});

export default Home;