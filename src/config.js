import React from "react";
import { StockLine } from "react-native-pathjs-charts";
import {
  View,
  AsyncStorage,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  TextInput,
} from "react-native";
import fetch from "cross-fetch";
import { setInterval } from "core-js/library/web/timers";
import _ from "lodash";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.saveValorInvestido = this.saveValorInvestido.bind(this);
    this.saveCurrentBTC = this.saveCurrentBTC.bind(this);
    this.onPress = this.onPress.bind(this);

    this.state = {
      currentBTC: '0',
      valorInvestido: '0'
    }
  }
  
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Configuração",
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
    AsyncStorage.getItem('currentBTC').then(currentBTC => this.setState({
      currentBTC
    }));
    AsyncStorage.getItem('valorInvestido').then(valorInvestido => this.setState({
      valorInvestido
    }));
  }

  onPress() {
    this.setState({
      loading: true,
    });

    Promise.all([
      AsyncStorage.setItem('currentBTC', this.state.currentBTC),
      AsyncStorage.setItem('valorInvestido', this.state.valorInvestido),
    ])
    .then(() => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 2000);
    });
  }
  
  saveCurrentBTC(currentBTC) {
    this.setState({currentBTC});
  }
  
  saveValorInvestido(valorInvestido) {
    this.setState({valorInvestido});
  }

  formatValue(value) {
    return `${value}`
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
      <View style={style.box}>
        <Text style={style.title}>Bitcoins</Text>
        <TextInput
          style={style.input}
          onChangeText={this.saveCurrentBTC}
          value={this.state.currentBTC}
        />
        <Text style={style.title}>Valor Investido</Text>
        <TextInput
          style={style.input}
          onChangeText={this.saveValorInvestido}
          value={this.formatValue(this.state.valorInvestido)}
        />
         <TouchableHighlight style={style.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={style.buttonText}>Save</Text>
        </TouchableHighlight>
        {this.state.loading ? <ActivityIndicator /> : null}
      </View>
    )
  }
}
