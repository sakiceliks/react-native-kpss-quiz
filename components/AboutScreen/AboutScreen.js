import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from '../../redux/slices/settings';
import { ResetQuiz } from '../../redux/slices/quiz';
import { SetAccuracy } from '../../redux/slices/stats';
import { Platform } from 'react-native';
import { A } from '@expo/html-elements';



export default function AboutScreen({ correctAnswers, navigation }) {
   const colors = useSelector(Colors);
   const comingFromHome = useSelector(state => state.settings.comingFromHome);


   return (
      <View style={[styles.container, { backgroundColor: colors.dark }]}>
         {(Platform.OS !== 'web')&& <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: colors.light }]}>
               Hakkımda
            </Text>
         </View>}

         <ScrollView style={[styles.settingContainer, { backgroundColor: colors.dark, borderColor: colors.light }]}>
            <Text style={[styles.settingText, { color: colors.light, }]} onPress={() => {
            }}>
<Text style={{fontFamily: 'Poppins-Bold', }}>KPSS: Temel Öğretim Bilgisi</Text>
{'\n'}{'\n'}

Öğretmenlik mesleği ve alan bilgisi için nihai hazırlık uygulamanız. KPSS'de başarılı olmak için gerekli temel temalar ve konularla bilginizi pekiştirin.
{'\n'}{'\n'}

KPSS: Temel Öğretim Bilgisi. Öğretmenlik mesleği ve alan bilgisi için nihai hazırlık uygulamanız. KPSS'de başarılı olmak için gerekli temel temalar ve konularla bilginizi pekiştirin.
<Text style={{fontFamily: 'Poppins-Bold', }}>
{'\n'}{'\n'}


Geri bildiriminiz bizim için önemli! </Text> 

{'\n'}{'\n'}

Uygulamayı geliştirmemize yardımcı olmak için görüşlerinizi kpss@sakicelik.com.tr adresine iletebilirsiniz: KPSS Hazırlık  <A style={{textDecorationLine: 'underline'}} href="mailto:kpss@sakicelik.com.tr">kpss@sakicelik.com.tr</A>


            </Text>

         </ScrollView>


      </View>
   )
}


const styles = StyleSheet.create({
   container: {
      flex: 1,

   },
   logo: {
      fontSize: 40,
      fontFamily: 'Poppins-Regular',
      textAlign: 'left',
   },
   logoContainer: {
      marginTop: 50,
      marginBottom: 10,
      marginHorizontal: 20
   },

   settingContainer: {
      minWidth: '90%',
      maxHeight: '78%',
      borderWidth: 2,
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10
   },
   settingText: {
      fontFamily: 'Poppins-Regular',
      fontSize: 17,
      textAlign: 'center',
      padding: 5
   }

});

