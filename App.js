import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';
import HomeScreen from './components/HomeScreen/HomeScreen';
import QuizScreen from './components/QuizScreen/QuizScreen';
import StatsScreen from './components/StatScreen/StatsScreen';
import SettingsScreen from './components/SettingsScreen/SettingsScreen';
import AboutScreen from './components/AboutScreen/AboutScreen';
import OrderedEntries from './assets/data/QuizEntries';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { persistor } from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { RotateColor } from './redux/slices/settings'
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './redux/store';
import { SetNewQuiz } from './redux/slices/quiz';
import { Colors } from './redux/slices/settings';
import { Platform } from 'react-native';
import KategoriScreen from './components/KategoriScreen/KategoriScreen';



const Stack = createStackNavigator();

const AppWrapper = () => {
  return (
    <Provider store={store}>
       <PersistGate persistor={persistor}>  
      <App />
       </PersistGate>  
    </Provider>
  )
}

function App() {


  const [fontsLoaded] = useFonts({
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBoldItalic': require('./assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
  });  const dispatch = useDispatch();
  const newQuiz = useSelector(state => state.quiz.newQuiz);
  const randomize = useSelector(state => state.settings.randomize);
  const shownQuestion = useSelector(state => state.quiz.shownQuestion);
  const colors = useSelector(Colors);
  const allColorsHelper = useSelector(state => state.settings.allColorsHelper);

  const [Entries, setEntries] = useState([]); // API'den gelen veriler için state
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
      // API'den verileri çek
      fetch('https://testapi.io/api/sakiceliks/quiz')
          .then(response => response.json())
          .then(data => {
              setEntries(data); // Verileri state'e kaydet
              setCorrectAnswers(data.map(({ correct }) => correct)); 
          })
          .catch(error => console.error('API Error:', error));
  }, []); // Yalnızca bir kez çalışacak

  useEffect(() => {
      if (newQuiz) {
          dispatch(SetNewQuiz(false));
          setEntries(randomize ? shuffle(Entries) : Entries);
      }
  }, [newQuiz, randomize, Entries]); // Entries dependency

  useEffect(() => {
      dispatch(RotateColor());
  }, [shownQuestion]);

  const totalCount = Entries.length;

  if (!fontsLoaded) {
      return <Progress.CircleSnail color={['red', 'green', 'blue']} />;
  }
  return (
    <>
      <StatusBar style={(allColorsHelper == 1) ? "dark" : "light"} />
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
            {(props) => <HomeScreen  {...props} />}
          </Stack.Screen>

          <Stack.Screen name="QuizScreen" 
            options={{
              headerShown: (Platform.OS === 'web'),
              title: 'KPSS',
              headerStyle: {
                backgroundColor: colors.dark,
                borderBottomWidth: 0,
              },
              headerTintColor: colors.light,
              headerTitleStyle: {
                fontFamily: 'Poppins-Regular',
                fontSize: 40,
  
              },
            }}
          >
            {(props) => <QuizScreen {...props} totalCount={totalCount} correctAnswers={correctAnswers}
                          shownQuestion={shownQuestion} Entries={Entries} />}
          </Stack.Screen>

          <Stack.Screen name="StatsScreen" 
            options={{
              headerShown: (Platform.OS === 'web'),
              title: 'İstatistikler',
              headerStyle: {
                backgroundColor: colors.dark,
                borderBottomWidth: 0,
              },
              headerTintColor: colors.light,
              headerTitleStyle: {
                fontFamily: 'Poppins-Regular',
                fontSize: 40,
  
              },
            }}
          >
            {(props) => <StatsScreen {...props} correctAnswers={correctAnswers} />}
          </Stack.Screen>

          <Stack.Screen name="SettingsScreen" 
            options={{
              headerShown: (Platform.OS === 'web'),
              title: 'Ayarlar',
              headerStyle: {
                backgroundColor: colors.dark,
                borderBottomWidth: 0,
              },
              headerTintColor: colors.light,
              headerTitleStyle: {
                fontFamily: 'Poppins-Regular',
                fontSize: 40,
  
              },
            }}

          >
            {(props) =>  <SettingsScreen {...props} />}
          </Stack.Screen>

          <Stack.Screen name="AboutScreen" 
          options={{
            headerShown: (Platform.OS === 'web'),
            title: 'Hakkımda',
            headerStyle: {
              backgroundColor: colors.dark,
              borderBottomWidth: 0,
            },
            headerTintColor: colors.light,
            headerTitleStyle: {
              fontFamily: 'Poppins-Regular',
              fontSize: 40,

            },
          }}

          
          >
            {(props) =>  <AboutScreen {...props} />}
          </Stack.Screen>


          <Stack.Screen name="KategoriScreen" 
          options={{
            headerShown: (Platform.OS === 'web'),
            title: 'Kategoriler',
            headerStyle: {
              backgroundColor: colors.dark,
              borderBottomWidth: 0,
            },
            headerTintColor: colors.light,
            headerTitleStyle: {
              fontFamily: 'Poppins-Regular',
              fontSize: 40,

            },
          }}

          
          >
            {(props) =>  <KategoriScreen {...props} />}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    </>
  )


}

export default AppWrapper;

// From SO: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  const newArray = array.slice();
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }
  return newArray;
};