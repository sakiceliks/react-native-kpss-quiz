import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SetShownQuestion } from "../../../redux/slices/quiz";
import { SetSelectedChoice } from "../../../redux/slices/quiz";
import { SetModalVisible } from "../../../redux/slices/quiz";
import { SetFinishFlag  } from '../../../redux/slices/quiz';
import { IsTraversing } from '../../../redux/slices/quiz';
import { Colors } from '../../../redux/slices/settings';
import { SetComingFromHome } from '../../../redux/slices/settings';
import { SetIsCorrect } from '../../../redux/slices/quiz';
import { Audio } from 'expo-av';


export default function NavigationSection({ navigation,  totalCount }) {
   const dispatch = useDispatch();
   const isTraversing = useSelector(IsTraversing);
   const  currentQuestion  = useSelector(state => state.quiz.currentQuestion)
   const [shownQuestion , setShownQuestion] = [ useSelector(state => state.quiz.shownQuestion), (payload) => dispatch(SetShownQuestion(payload))];
   const [finishFlag, setFinishFlag] = [ useSelector(state => state.quiz.finishFlag), (payload) => dispatch(SetFinishFlag(payload))];
   const setSelectedChoice = (payload) => dispatch(SetSelectedChoice(payload));
   const setModalVisible = (payload) => dispatch(SetModalVisible(payload));
   const isCorrect = useSelector(state => state.quiz.isCorrect);
   const setIsCorrect = (payload) => dispatch(SetIsCorrect(payload))
   const colors = useSelector(Colors)
   const setComingFromHome = (payload)=> dispatch(SetComingFromHome(payload))
   const audio = useSelector(state => state.settings.audio)
   const handleSubmit = () => {
      if(finishFlag){
         navigation.navigate('StatsScreen')
         setComingFromHome(false)
      }
      if (isCorrect != -1 && !finishFlag) {
         if (audio) {
         if (isCorrect == 1)  playSoundCorrect()
         else playSoundIncorrect()
         }
         setModalVisible(true);
      }
      if(currentQuestion == totalCount -1 && isCorrect != -1){
         setFinishFlag(true);
      }
      
   }

   const handleNext = () => {
      if(shownQuestion + 1 == currentQuestion)   setIsCorrect(-1)
      setShownQuestion((shownQuestion + 1) % totalCount);
      
   }

   const handleBack = () => {
      if (shownQuestion > 0 && shownQuestion < totalCount) {
         setShownQuestion((shownQuestion - 1) % totalCount);
         setSelectedChoice(-1);
         setIsCorrect(-1)
      }
   }

   useEffect(() => {
      if(currentQuestion===totalCount-1){
         setFinishFlag(true);
      }},[]);


      // For Audio
      const [sound, setSound] = useState();

      async function playSoundCorrect() {
        const { sound } = await Audio.Sound.createAsync(require('../../../assets/audio/correct.wav'));
        setSound(sound);
      
        await sound.playAsync();
      }
      
      async function playSoundIncorrect() {
         const { sound } = await Audio.Sound.createAsync(require('../../../assets/audio/incorrect.wav'));
         setSound(sound);
          await sound.playAsync();
       }
      
      useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);


   return (
      <View style={styles.container}>
         <View style={[styles.submitContainer, { backgroundColor: colors.light, borderColor: colors.border }, (isCorrect == -1 && !isTraversing) ? { backgroundColor: colors.dark } : { backgroundColor: colors.light }]}>
            <TouchableOpacity style={[styles.submit]} onPress={() => (!isTraversing || ((currentQuestion == totalCount) && (shownQuestion == totalCount - 1))) ? handleSubmit():handleNext() }>
               {(!isTraversing || ((currentQuestion == totalCount) && (shownQuestion == totalCount - 1))) ?
                  (
                     <Text style={[styles.submitText,   { color: colors.dark, }, ((isCorrect == -1) && !finishFlag) && { color: colors.light }]} >
                        {( finishFlag ) ? 'Sonuçları Gör' : 'Gönder'}
                     </Text>
                  )
                  : (
                     <Text style={[styles.submitText, { color: colors.dark, }]} >
Sıradaki Soru                     </Text>
                  )
               }
            </TouchableOpacity>
         </View>
         {(shownQuestion > 0) &&
            <View style={[styles.submitContainer, { borderColor: colors.dark, backgroundColor: colors.light }]}>
               <TouchableOpacity style={styles.submit} onPress={() => handleBack()}>
                  <Text style={[styles.submitText, { color: colors.dark }]}>
                     Önceki Soru
                  </Text>
               </TouchableOpacity>
            </View>
         }
      </View>
   )
}


const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      width: '93%'
   },

   submitContainer: {
      maxwidth: '100%',
      minWidth: '100%',
      borderWidth: 2,
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
   },
   submitText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 17,
      textAlign: 'center'
   }
});



