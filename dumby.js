import React ,{useState,useEffect}from 'react';
import {
  Vibration,
  StatusBar,
  Easing,
  TextInput,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
  useNativeDriver
} from 'react-native';
const { width, height } = Dimensions.get('window');
const colors = {
  black: '#323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

export default function App() {

  const [duration , setDuration]= useState(timers[0]);
  const timerANimation =React.useRef(new Animated.Value(height)).current;
  const buttonAnimation =React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef();
  const textInputanimation = React.useRef(new Animated.Value(timers[0])).current;
  const scrollX = React.useRef(new Animated.Value(0)).current;



  React.useEffect(()=>{
    const listener= textInputanimation.addListener(({value})=>{
       inputRef?.current?.setNativeProps({
         text:Math.ceil(value).toString()
       })
     })
  
     return ()=>{
       textInputanimation.removeListener(listener)
       textInputanimation.removeAllListeners();
 
 
     }
   })


const animation = React.useCallback(()=>{

  textInputanimation.setValue(duration)
 Animated.sequence([


  Animated.timing(buttonAnimation,{
    toValue:1,
    duration:300,
    useNativeDriver:true

  }),

    Animated.timing(timerANimation,{
      toValue:0,
      duration:300,
      useNativeDriver:true
    }),
    
    
    Animated.parallel([
      Animated.timing(textInputanimation,{
        toValue:0,
        duration:duration*1000,
        useNativeDriver:true

      }),
      Animated.timing(timerANimation,{
        toValue:height,
        duration:duration*1000,
        useNativeDriver:true
      })
    ]),
Animated.delay(400)
  ]).start(()=>{
    Vibration.cancel();
    Vibration.vibrate();
    
    textInputanimation.setValue(duration);
    Animated.timing(buttonAnimation,{
      toValue:0,
      duration:300,
      useNativeDriver:true
    }).start();


  })
},[duration])


const opacity = buttonAnimation.interpolate({
  inputRange:[0,1],
  outputRange:[1,0]
})

const TranslateY =buttonAnimation.interpolate({
  inputRange:[0,1],
  outputRange:[0,200]
})

const textOpacity = buttonAnimation.interpolate({
  inputRange:[0,1],
  outputRange:[0,1]
})
  return (
    <View style={styles.container}>
      
      <StatusBar hidden />
      <Animated.View style={[StyleSheet.absoluteFillObject,{
        height,
        width,
        backgroundColor:colors.red,
        transform:[{
          translateY:timerANimation
        }]

      }]}>

      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'flex-end',
            alignItems: 'center',
            opacity,
            paddingBottom: 100,
            transform:[{
              translateY:TranslateY

            }]
          },
        ]}>
        <TouchableOpacity
          onPress={() => {animation}}>
          <View
            style={styles.roundButton}
          />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          top: height / 3,
          left: 0,
          right: 0,
          flex: 1,
        }}>
         <Animated.View style={{
           position:"absolute",
           width:ITEM_SIZE,
           justifyContent:'center',
           alignItems:'center',
           alignSelf:'center',
           opacity: textOpacity
         }}>
           <TextInput
           defaultValue={duration.toString()}
           ref ={inputRef}
           style={styles.text} />
 
         </Animated.View>
          <Animated.FlatList
          data={timers}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal:ITEM_SPACING
          }
          }
          onScroll={Animated.event(
            [{nativeEvent:{contentoffset:{x:scrollX}}}],
            {useNativeDriver:true}
            )}
            onMomentumScrollEnd={(e)=>{
              const index =Math.floor(e.nativeEvent.contentOffset.x/ITEM_SIZE)
              setDuration(timers[index])


            }}
             snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          style={{flexGrow:0, opacity}}
          keyExtractor={item=>item.toString()}
          renderItem={({item,index})=>{
            const inputRange=[
              (index - 1)*ITEM_SIZE,
              index*ITEM_SIZE,
              (index + 1)*ITEM_SIZE
             
            ]
const opacity = scrollX.interpolate({
  inputRange,
  outputRange:[.4,1,.4]
})

const scale = scrollX.interpolate({
  inputRange,
  outputRange:[.7,1,.7]
})

            return(
              <View styel={{width:ITEM_SIZE ,justifyContent:'center' , alignItems:'center'}}>
                <Animated.Text 
              style={[styles.text,{opacity,transform:[{scale}]}]}>
                {item}
              </Animated.Text>
                </View> 

            )
          }}
 

          /> 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.red,
  },
  text: {
    fontSize: ITEM_SIZE * 0.8,
  
    color: colors.text,
    fontWeight: '900',
  }
});