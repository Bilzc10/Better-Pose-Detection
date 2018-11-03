import * as config from './config.js';

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

let poseNet;
let poses = [];

//const video = document.getElementById('video');
//video.width = videoWidth;
//video.height = videoHeight;

const mobile = isMobile();

var useVideo = true;
var useAudio = false;

function setup() {
  createCanvas(640, 480);
  /*if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const stream = navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: mobile ? undefined : videoWidth,
        height: mobile ? undefined : videoHeight,
      },
    });
    video.srcObject = stream;
    video.play();
  }
  else {
    document.getElementById("error").innerHTML = "ERAR: Cant capture media";
    document.getElementById("error").style.dislay = "inline";
    return;
  }*/

  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media ? new p5.MediaElement(elt) : new p5.Element(elt);
    pInst._elements.push(c);
    return c;
  }

  p5._validateParameters('createCapture', arguments);
  var constraints;
  if (navigator.getUserMedia) {
    var elt = document.createElement('video');

    if (!constraints) {
      constraints = {video: {facingMode: faceUser ? 'user' : 'environment'}, audio: false};
    }

    navigator.mediaDevices.getUserMedia(constraints).then(
      function(stream) {
        try {
          if ('srcObject' in elt) {
            elt.srcObject = stream;
          } else {
            elt.src = window.URL.createObjectURL(stream);
          }
        } catch (err) {
          elt.src = stream;
        }
      },
      function(e) {
        console.log(e);
      }
    );
  } else {
    throw 'getUserMedia not supported in this browser';
  }
  var c = addElement(elt, this, true);
  c.loadedmetadata = false;
  // set width and height onload metadata
  elt.addEventListener('loadedmetadata', function() {
    elt.play();
    if (elt.width) {
      c.width = elt.videoWidth = elt.width;
      c.height = elt.videoHeight = elt.height;
    } else {
      c.width = c.elt.width = elt.videoWidth;
      c.height = c.elt.height = elt.videoHeight;
    }
    c.loadedmetadata = true;
  });
  video = c;
  console.log(video);

  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {imageScaleFactor: config.advanced.imageScaleFactor,outputStride: config.advanced.outputStride,flipHorizontal: config.advanced.flipHorizontal,minConfidence: config.advanced.minConfidence,maxPoseDetections: config.advanced.maxPoseDetections,scoreThreshold: config.advanced.scoreThreshold,nmsRadius: config.advanced.nmsRadius,detectionType: config.singlePoseDetection ? 'single' : 'multiple',multiplier: isMobile() ? config.advanced.multiplierDefault : config.advanced.multiplierDefaultMobile}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  document.getElementById("status").style.display = "none";

  if (config.flipFrontCam && config.faceUserDefault)
    document.getElementsByTagName("canvas")[0].classList.add("flip180");
  else
    document.getElementsByTagName("canvas")[0].classList.remove("flip180");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 255, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 255, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
