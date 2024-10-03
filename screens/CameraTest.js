// Vi bruger Legacy Camera API, da det er den eneste der virker i dette projekt. Den ny Camera API virker kun med Typescript
import { Camera, CameraType } from 'expo-camera/legacy';

import { useState, useRef } from 'react';

import { StatusBar } from 'expo-status-bar';

import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CameraTest({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imagesArr, setImagesArr] = useState([]);
  const [loading,setLoading] = useState(false);
  //Definere om galleriet er åbent eller ej
  const [gallery, setGallery] = useState(false);
  // Camera reference
  const cameraRef = useRef();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  // Making a snapshot
    const snap = async () => {
        if (!cameraRef.current) {
            console.log("No camera ref");
            
            return;
        }
        setLoading(true);
        const result = await cameraRef.current.takePictureAsync();
        setImagesArr([...imagesArr,result]);
        setLoading(false);
    }


    // Gallery component
    const CameraGallery = () => {
        return (
            <View style={styles.gallery}>
                <Text style={styles.buttonGallery}>Billeder taget: {imagesArr.length}</Text>
                <ScrollView horizontal={true} >
                    {
                        imagesArr.length > 0
                            ? imagesArr.map((image,index) => (
                                <TouchableOpacity key={index} style={{paddingHorizontal:10}} onPress={() => navigation.navigate('image',{image:image.uri}) } >
                                    <Image source={{ uri: image.uri }} style={{ width: 80, height: 80, borderRadius:10 }} />
                                </TouchableOpacity>
                            ))
                            : <Text style={{color:"white"}}> No images taken </Text>
                    }
                </ScrollView>
            </View>
        )
    };

    // Toggles
    // Toggles the camera type
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  // Toggles the gallery
  function toggleGallery() {
    setGallery(current => !current);
  }

  return (
    <SafeAreaView style={styles.safeview}>
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
            <View style={{flex: 1, alignSelf: 'flex-end'}}> 
                <TouchableOpacity style={styles.flipbtn} onPress={toggleCameraType}>
                    <Ionicons name = "camera-reverse-outline" size= "32" color = "#fff" />
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignSelf: 'flex-end',}}> 
                <TouchableOpacity style={styles.snapbtn} onPress={snap}>
                    <Text style={styles.text}>{loading ? "Loading...":""}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignSelf: 'flex-end',}}> 
                <TouchableOpacity style={styles.gallerybtn} onPress={toggleGallery}>
                    <Ionicons name = "copy-outline" size= "32" color = "#fff" />
                </TouchableOpacity>
            </View>
        </View>
      </Camera>
      {
        gallery ? <CameraGallery /> : null
      }
        
    </View>
    <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginTop: 0,
    borderRadius: 20,
    backgroundColor: 'black',
    overflow: 'hidden',
    
  },
    camera: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 32,
    alignSelf: 'center',
  },
  
  text: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: 'white',
    alignSelf: 'center',
  },
  buttonGallery: {
    fontSize: 15,
    color:"white",
    padding: 10,
    borderRadius:10,
    alignSelf: 'center',
    },
    gallery:{
        flex: 0.2,
        paddingTop:10,
        width:"100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    safeview:{
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    snapbtn:{
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        height: 80,
        width: 80,
        borderRadius: 100,
        padding: 10,
        margin: 5,
        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
    },
    flipbtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 100,
        
        padding: 5,
        alignSelf: 'baseline',
        justifyContent: 'center',
    },
    gallerybtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 100,
        padding: 5,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
});
