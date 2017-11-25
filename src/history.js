import React from "react";
import { StockLine } from "react-native-pathjs-charts";
import {
  ScrollView,
  AsyncStorage,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  TextInput,
} from "react-native";
import fetch from "cross-fetch";
import _ from "lodash";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      BTCHistory: [],
    }
  }
  
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Histórico",
    headerLeft: (
      <TouchableHighlight onPress={() => navigation.navigate('DrawerToggle')}>
        <Image
          source={require("./chats.png")}
          style={{
            width: 24,
            height: 24,
            marginLeft: 10,
          }}
        />
      </TouchableHighlight>
    )
  });

  componentDidMount() {
    AsyncStorage.getItem('BTCHistory').then(BTCHistory => this.setState({
      BTCHistory: JSON.parse(BTCHistory)
    }));
  }

  

  render() {
    const style = {
      input: {
        height: 40,
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 5,
        marginBottom: 30,
      },
      title: {
        fontSize: 20,
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontWeight: 'bold',
      },
      box: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
      },
      buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
      },
      button: {
        height: 46,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
      }
    }


    return (
      <ScrollView style={style.box}>
        <Text>{JSON.stringify(this.state.BTCHistory, null, 2)}</Text>
      </ScrollView>
    )
  }
}
