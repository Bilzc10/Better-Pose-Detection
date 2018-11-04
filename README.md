# Gesture-Detection
### Gesture detection using PoseNet and TensorFlow
More customizable version of ml5js' PoseNet with webcam application.
## Application Settings
# Change settings in config.js
___faceUserDefault__  
*true* **(default)** - the front-facing camera is used if available, but the rear camera can be enabled through the rearCamera url parameter  
*false* - the rear-facing camera is used if available regardless of the rearCamera url parameter  

___enforceCameraDirection___
*true* - The camera defined in faceUserDefault must be used, if unavailable, the video stream will be unavailable  
*false* **(default)** - The browser will fall back to a different camera if the camera defined in faceUserDefault is unavailable  

___flipFrontCam___  
*true* **(default)** - The camera view is flippedmirrored when using the front facing camera  
*false* - the camera view is normal  

___singlePoseDetection__  
*true* - Faster and more accurate but only one person can be in frame  
*false* **(default)** - Slower, but multiple people can be in the frame  

___showDataPointsDefault___  
*true* - Data points are shown regardless of the showPoints url parameter  
*false* **(default)** - Data points are disabled by default but can be enabled through the showPoints url parameter  

___ignoreUrlParameters___  
*true* - URL parameters are ignored and cannot modify the function of the program  
*false* **(default)** - URL parameters are allowed to modify the function of the program  
### URL Parameters
Include parameters in the url with no values _(ex: `www.example.com/Gesture-Detection/?faceEnvironment&showDataPoints/`)_
___faceEnvironment___
Attempts to use rear facing camera if the device has one.
___showDataPoints___
Shows data points from the pose array on the webpage.
