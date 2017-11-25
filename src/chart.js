import React from "react";
import { StockLine } from "react-native-pathjs-charts";
import {
  View,
  AsyncStorage,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image
} from "react-native";
import fetch from "cross-fetch";
import _ from "lodash";

export default class App extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Meus bitcoins",
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

  constructor(props) {
    super(props);
    this.state = {
      btcHistory: [],
      touch: "none",
      currentBTC: "0",
      valorInvestido: "0",
      last: {
        last: 0
      },
      loading: false,
      selected: 0
    };

    this.getBTC = this.getBTC.bind(this);
    this.renderCurrent = this.renderCurrent.bind(this);

    setInterval(this.getBTC, 30 * 30000);
  }

  componentDidMount() {
    AsyncStorage.getItem("currentBTC").then(currentBTC =>
      this.setState({
        currentBTC
      })
    );

    AsyncStorage.getItem("valorInvestido").then(valorInvestido =>
      this.setState({
        valorInvestido
      })
    );

    AsyncStorage.getItem("BTCHistory")
      .then(btcHistory => {
        btcHistory = JSON.parse(btcHistory) || [];
        this.setState({
          btcHistory
        });
      })
      .catch(e => console.log(e));
    this.getBTC();
  }

  componentDidUpdate() {
    AsyncStorage.setItem("BTCHistory", JSON.stringify(this.state.btcHistory));
  }

  getBTC() {
    fetch("https://www.mercadobitcoin.net/api/BTC/ticker/")
      .then(res => {
        return res.json();
      })
      .then(({ ticker }) => {
        let btcHistory = [
          ...this.state.btcHistory,
          {
            x: ticker.date,
            y: parseFloat(ticker.last)
          }
        ];

        this.setState({
          btcHistory,
          last: ticker
        });
      });
  }

  getMyBitcoins() {
    return parseFloat(this.state.currentBTC);
  }

  getCurrentValueBRL() {
    return this.getMyBitcoins() * parseFloat(this.state.last.last);
  }

  getPriceStyle() {
    const valor = parseFloat(this.state.valorInvestido);
    const current = this.getCurrentValueBRL();
    const color = valor > current ? "#f00" : "green";
    const styleBad = {
      fontSize: 15,
      color,
      fontWeight: "bold",
      marginLeft: 15
    };

    return styleBad;
  }

  getRentabilidade() {
    return (this.getCurrentValueBRL() / this.state.valorInvestido - 1) * 100;
  }

  renderCurrent() {
    const style = {
      default: {
        fontSize: 15,
        color: "#2980B9",
        fontWeight: "bold",
        marginLeft: 15
      },
    };

    return (
      <View style={styles.box}>
        <Text style={style.default}>
          Total investido: {this.state.valorInvestido}
        </Text>
        <Text style={this.getPriceStyle()}>
          Valor bruto: {this.getCurrentValueBRL().toFixed(2)}
        </Text>
        <Text style={this.getPriceStyle()}>
          Rentabilidade: {this.getRentabilidade().toFixed(2)}%
        </Text>
      </View>
    );
  }

  render() {
    const options = {
      width: 300,
      height: 330,
      color: "#2980B9",
      margin: {
        top: 10,
        left: 60,
        right: -20,
        bottom: 30
      },
      axisX: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: false,
        zeroAxis: true,
        orient: "bottom",
        tickValues: [],
        labelFunction: data => {
          const date = new Date(data * 1000);

          const minutes =
            date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
          return `${date.getHours()}:${minutes}`;
        },
        label: {
          fontFamily: "Arial",
          fontSize: 12,
          fontWeight: true,
          fill: "#34495E"
        }
      },
      axisY: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: false,
        zeroAxis: false,
        orient: "left",
        labelFunction: btcValue =>
          `R$${(this.getMyBitcoins() * btcValue).toFixed(2)}`,
        label: {
          fontFamily: "Arial",
          fontSize: 12,
          fontWeight: false,
          fill: "#34495E"
        }
      }
    };

    if (this.state.btcHistory.length === 0) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        {this.renderCurrent()}
        <StockLine
          data={[this.state.btcHistory]}
          options={options}
          xKey="x"
          yKey="y"
        />
        <TouchableHighlight
          style={styles.button}
          onPress={this.getBTC}
          underlayColor="#99d9f4"
        >
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = {
  icon: {
    width: 24,
    height: 24
  },
  button: {
    height: 46,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    margin: 30,
    width: 100,
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  box: {
    marginTop: 20,
    marginBottom: 20
  }
};
