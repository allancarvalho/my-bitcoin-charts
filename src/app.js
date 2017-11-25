import {
  StackNavigator,
  DrawerNavigator,
} from 'react-navigation';
import Chart from './chart';
import Config from './config';

const ChartStack = StackNavigator({
  Chart: { screen: Chart },
});

const ConfigStack = StackNavigator({
  Config: { screen: Config },
});

export default DrawerNavigator({
  Chart: {screen: ChartStack},
  Config: {screen: ConfigStack},
});
