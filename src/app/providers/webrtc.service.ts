import { Injectable } from '@angular/core';
import 'webrtc-adapter';
import Peer from 'peerjs';

const constraints: MediaStreamConstraints = {video: true, audio: false};

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  stun = 'stun.l.google.com:19302';
  mediaConnection: Peer.MediaConnection;
  peer: Peer;
  myStream: MediaStream;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  options: Peer.PeerJSOption;
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };

  constructor() {

    this.options = {
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
  }

  getMedia() {
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      this.handleSuccess(stream);
    }, (error) => {
      this.handleError(error);
    });
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) {
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    try {
      this.getMedia();
      // const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // this.handleSuccess(stream);
    } catch (e) {
      this.handleError(e);
    }
    await this.createPeer(userId);
  }

  async createPeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.wait();
    });
  }

  call(partnerId: string) {
    // const conn = this.peer.connect(partnerId);
    // conn.on('open', () => {
    //   this.wait();
    //   conn.send('hi!');
    // });
    const call = this.peer.call(partnerId, this.myStream);
    call.on('stream', (stream) => {
      this.partnerEl.srcObject = stream;
    });
  }

  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.partnerEl.srcObject = stream; // URL.createObjectURL(stream);
      });
    });
  }

  handleSuccess(stream: MediaStream) {
    // const videoTracks = stream.getVideoTracks();
    // console.log('Got stream with constraints:', constraints);
    // console.log(`Using video device: ${videoTracks[0].label}`);

    this.myStream = stream;
    this.myEl.srcObject = stream;
  }

  handleError(error: any) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
     // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      this.errorMsg(`The resolution px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  

  async makeCall() {

  }
  // createPeer(userId: string) {
  //   this.peer = new Peer(userId, this.options);
  //   this.peer.on('open', () => {
  //     this.wait();
  //   });
  // }

  // call(partnerId: string) {
  //   this.mediaConnection = this.peer.call(partnerId, this.myStream);
  // }

  // wait() {
  //   this.peer.on('call', (call) => {
  //     call.on('stream', (stream) => {
  //       this.partnerEl.src = URL.createObjectURL(stream);
  //     });
  //   });
  // }
}
