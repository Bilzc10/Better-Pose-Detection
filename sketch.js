// Parse URL and modify variables based on url parameters
var url = new URL(window.location.href);

var showDataPoints = config.ignoreUrlParameters ? config.showDataPointsDefault : (url.searchParams.get("showDataPoints") != null || config.showDataPointsDefault); // ?showDataPoints
var faceUser = config.ignoreUrlParameters ? config.faceUserDefault : (url.searchParams.get("faceEnvironment") == null && config.faceUserDefault); // ?faceEnvironment
var multi = url.searchParams.get("multi") != null || url.searchParams.get("multiPose") != null ;
var single = url.searchParams.get("single") != null || url.searchParams.get("singlePose") != null ;
var singlePose = ((single && multi) || (!single && !multi) || config.ignoreUrlParameters) ? config.singlePoseDetection : single;

// Detect OS and if it's mobile
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

const mobile = config.ignoreUrlParameters ? isMobile() : (url.searchParams.get("desktop") != null ? false : (isMobile() || url.searchParams.get("mobile") != null));

console.log(mobile);

let poseNet;
let poses = [];

var useVideo = true;
var useAudio = false;

function setup() { // Setup PoseNet
  createCanvas(640, 480);

  // Functions stolen from poseNet because it didnt allow the amount of control I wanted
  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media ? new p5.MediaElement(elt) : new p5.Element(elt);
    pInst._elements.push(c);
    return c;
  }

  // function createCapture() from poseNet
  //p5._validateParameters('createCapture', arguments);
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
    let error = "getUserMedia not supported in this browser";
    document.getElementById("error").innerHTML = error
    document.getElementById("error").style.display = "inline";
    throw error;
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

  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {imageScaleFactor: config.advanced.imageScaleFactor, outputStride: config.advanced.outputStride, flipHorizontal: config.advanced.flipHorizontal, minConfidence: config.advanced.minConfidence, maxPoseDetections: config.advanced.maxPoseDetections, scoreThreshold: config.advanced.scoreThreshold, nmsRadius: config.advanced.nmsRadius, detectionType: (singlePose ? 'single' : 'multiple'), multiplier: isMobile() ? config.advanced.multiplierDefault : config.advanced.multiplierDefaultMobile}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  let canvas = document.getElementsByTagName("canvas")[0];

  if (showDataPoints) {
    let pre = document.createElement("pre");
    pre.id = "points";
    pre.style.display = "block";
    document.getElementsByTagName("body")[0].appendChild(pre);
  }

  document.getElementById("status").style.display = "none";

  canvas.classList.add("canvasMain");

  if (config.flipFrontCam && faceUser)
    canvas.classList.add("flip180");
  else
    canvas.classList.remove("flip180");
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
    if (showDataPoints) {
      document.getElementById("points").innerHTML = syntaxHighlight(JSON.stringify(poses, null, 2)); // Print poses array if needed
      var elements = document.getElementsByClassName("number");
      for (var e = 0; e < elements.length; e++) {
        let num = parseFloat(elements[e].innerHTML);
        console.log(num);
        if (num >= config.advanced.minConfidence && num < 1) elements[e].classList.add("confident");
      }
    }
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

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
