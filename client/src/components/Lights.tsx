import React, {useState, useEffect, useRef} from 'react'
import { useAppDispatch, useAppSelector } from '../store/Hooks'
import { song } from './List'

const Lights = (props: any) => {
    const audioContext = useAppSelector((state) => state.context)
    const playing = useAppSelector((state) => state.playing)
    const {play, pause, returnRef} = props
    let prevSource: song

    const FPS = 10;
    const FFT_SIZE = 2048;
    const MIN_FREQ = 20;
    const MAX_FREQ = 15000;
    const NUM_LIGHTS = 16;
    const BYTES_PER_FRAME = Math.ceil(NUM_LIGHTS / 8);
    const ROTATE_FRAMES = FPS;

    let context = new window.AudioContext
    const [lights, setLights] = useState(Array(NUM_LIGHTS).fill(false))
    const [encodedData, setEncodedData] = useState()

    useEffect( () => {
        console.log("play state changed")
        prevSource = returnRef()
        const {source, context, name} = prevSource
        console.log('ref object in lights component', prevSource)
        setupAudio(source, context)
      },[playing])
    

    const setupAudio = async (source: AudioBufferSourceNode, context: AudioContext) => {
        const data = await analyze(source.buffer);
      }

    const analyze = async (buffer: AudioBuffer | null) => {
        // Setup an offline audio context to do the analysis.
        let ctx = new (window.OfflineAudioContext)(1, this.audioBuffer.length, this.ctx.sampleRate);
        let source = ctx.createBufferSource();
        source.buffer = this.audioBuffer;
    
        let analyser = this.setupAnalyser(ctx);
        source.connect(analyser);
        analyser.connect(ctx.destination);
    
        // Compute the frame interval and total number of frames to generate,
        // and store the frame rate as the first byte of data.
        let interval = (1000 / FPS) / 1000;
        let numFrames = Math.ceil(buffer.duration / interval);
        let data = new Uint8Array((numFrames + 1) * BYTES_PER_FRAME);
        data[0] = FPS;
    
        // At each interval, suspend the audio context and create a frame of data
        // for the light show sequence to send to the raspberry pi.
        let i = 1;
        let offset = interval;
        let frame = async () => {
          // Get the state of each light for this frame, and pack them into bits.
          let lights = this.updateAnalyser();
          let index = NUM_LIGHTS - 1;
          for (let j = 0; j < BYTES_PER_FRAME; j++) {
            let val = 0;
            for (let i = 7; i >= 0 && index >= 0; i--) {
              val = (val << 1) | (lights[index--] ? 1 : 0);
            }
    
            data[i++] = val;
          }
    
          // Resume the audio context and suspend at the next frame offset
          offset += interval;
          let promise = ctx.suspend(offset).then(frame);
          ctx.resume();
          await promise;
        };
    
        source.start();
        ctx.suspend(offset).then(frame);
    
        await ctx.startRendering();
        console.log(data);
        return data;
      }

    // const setUpAnalyser = (source: AudioBufferSourceNode) => {
    //     const analyser = prevSource.context?.createAnalyser()
    //     analyser.fftSize = 2048

    //     const bufferLength = analyser.frequencyBinCount
    //     const dataArray = new Uint8Array(bufferLength)
    //     analyser.getByteTimeDomainData(dataArray)

    //     source.connect(analyser)
    //   }

    return (
        <div/>
    )

}

export default Lights