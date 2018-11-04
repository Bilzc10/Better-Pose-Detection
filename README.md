# Gesture-Detection
## Gesture detection using PoseNet and TensorFlow
More customizable version of ml5js' PoseNet with webcam application.
### Application Settings
Change settings in config.js
__**faceUserDefault**__
*true* **(default)** - the front-facing camera is used if available, but the rear camera can be enabled through the rearCamera url parameter
*false* - the rear-facing camera is used if available regardless of the rearCamera url parameter
__**enforceCameraDirection**__
*true* - The camera defined in faceUserDefault must be used, if unavailable, the video stream will be unavailable
*false* **(default)** - The browser will fall back to a different camera if the camera defined in faceUserDefault is unavailable
__**flipFrontCam**__
*true* **(default)** - The camera view is flippedmirrored when using the front facing camera
*false* - the camera view is normal
__**singlePoseDetection**__
*true* - Faster and more accurate but only one person can be in frame
*false* **(default)** - Slower, but multiple people can be in the frame
__**showDataPointsDefault**__
*true* - Data points are shown regardless of the showPoints url parameter
*false* **(default)** - Data points are disabled by default but can be enabled through the showPoints url parameter
__**ignoreUrlParameters**__
*true* - URL parameters are ignored and cannot modify the function of the program
*false* **(default)** - URL parameters are allowed to modify the function of the program
### URL Parameters
Just include them in the url with no values (ex: www.example.com/Gesture-Detection/?faceEnvironment&showDataPoints/)
__**faceEnvironment**__
Attempts to use rear facing camera if the device has one.
__**showDataPoints**__
Shows data points from the pose array on the webpage.
