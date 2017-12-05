import {
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';
import Chart from './chart';
import Config from './config';
import History from './history';

const ChartStack = StackNavigator({
  Chart: { screen: Chart },
});

const ConfigStack = StackNavigator({
  Config: { screen: Config },
});

const HistoryStack = StackNavigator({
  History: { screen: History },
});

export default DrawerNavigator({
  Config: {screen: ConfigStack},
  Chart: {screen: ChartStack},
  History: {screen: HistoryStack},
});
