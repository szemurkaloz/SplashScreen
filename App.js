import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React, { useRef } from "react";
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  return (
    <AnimatedAppLoader image={require('./assets/doctors.png')}>
      <MainScreen />
    </AnimatedAppLoader>
  );
}

function AnimatedAppLoader({ children, image }) {
  const [isSplashReady, setSplashReady] = React.useState(false);

  const startAsync = React.useMemo(
    // If you use a local image with require(...), use `Asset.fromModule`
    () => () => Asset.fromModule(image).downloadAsync(),
    [image]
  );

  const onFinish = React.useMemo(() => setSplashReady(true), []);

  if (!isSplashReady) {
    return (
      <AppLoading
        // Instruct SplashScreen not to hide yet, we want to do this manually
        autoHideSplash={false}
        startAsync={startAsync}
        onError={console.error}
        onFinish={onFinish}
      />
    );
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }) {
  const animation = React.useMemo(() => new Animated.Value(1), []);
  const moveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAppReady, setAppReady] = React.useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = React.useState(
    false
  );

  React.useEffect(() => {
    if (isAppReady) {
      Animated.sequence([
      Animated.timing(moveAnim, {
        duration: 2000,
        toValue: Dimensions.get('window').width / 1.6,
        delay: 0,
        useNativeDriver: false,
      }),
      Animated.timing(moveAnim, {
        duration: 2000,
        toValue: 0,
        delay: 0,
        useNativeDriver: false,
      }),
    ]).start();
    Animated.timing(fadeAnim, {
      duration: 2000,
      toValue: 1,
      delay: 2000,
      useNativeDriver: false,
    }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady, moveAnim, fadeAnim]);

  const onImageLoaded = React.useMemo(() => async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  });

  return (
    <>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest.splash.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
        <Animated.View style={{flexDirection: 'row', marginLeft: moveAnim, marginBottom: 50}}>
          <Text style={[styles.logoText]}></Text>
          <Animated.Text style={[styles.logoText, {opacity: fadeAnim}]}>
            Bejelentkezés
          </Animated.Text>
        </Animated.View>
      </>
      )}
    </>
  );
}

function MainScreen() {
  function onReloadPress() {
    if (Platform.OS === "web") {
      location.reload();
    } else {
      Updates.reloadAsync();
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "plum",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 30,
          marginBottom: 15,
          fontWeight: "bold",
        }}
      >
        Pretty Cool!
      </Text>
      <Button title="Run Again" onPress={onReloadPress} />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#52b372',
  },
  logoText: {
    fontSize: 30,
    marginTop: 20,
    color: 'black',
    fontWeight: '700',
    height: 50,
  },
  contentContainer: {
    top: '40%',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 200,
  },
  logoContainer: {
    flexDirection: 'row',
  },
});