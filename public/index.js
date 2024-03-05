// Assuming you have a container element with the id 'videoDiv' to append videos
const videoDiv = document.getElementById("videoDiv");

function addVideo(videoElement, stream) {
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  videoDiv.appendChild(videoElement);
}

const socket = io("/");
const peer = new Peer();
let myVideoStream;

peer.on("open", (id) => {
  socket.emit("newUser", id);
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
  })
  .catch((err) => {
    alert(err.message);
  });

socket.on("userJoined", (id) => {
  const call = peer.call(id, myVideoStream);
  const vid = document.createElement("video");

  call.on("error", (err) => {
    alert(err);
  });

  call.on("stream", (userStream) => {
    addVideo(vid, userStream);
  });
});

peer.on("call", (call) => {
  call.answer(myVideoStream);
  const vid = document.createElement("video");

  call.on("stream", (userStream) => {
    addVideo(vid, userStream);
  });

  call.on("error", (err) => {
    alert(err);
  });
});
