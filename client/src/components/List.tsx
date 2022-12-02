import React, {useState, useEffect, useRef} from 'react'
import { useAppDispatch, useAppSelector } from '../store/Hooks'
import Lights from './Lights'

const List = () => {
    interface song {
      source?: AudioBufferSourceNode,
      context?: AudioContext,
      name?: string
    }
    const playButton = <span className="material-icons">play_arrow</span>
    const pauseButton = <span className="material-icons">pause</span>

    const audioContext = useAppSelector((state) => state.index)
    const dispatch = useAppDispatch()

    const [playlist, setPlayList] = useState([])
    const [currentSong, setCurrentSong] = useState('')
    

    let context = new window.AudioContext
    let source: AudioBufferSourceNode  | undefined
    let example: string = 'hello world'
    const prevSource = useRef<song>({})
    
    const getPlayList = async() => {
        // fetch and load playlist from raspberry pi filesystem
        fetch(`/playlist`)
        .then((res) => res.json())
        .then((data) => {
            console.log('Success:', data)
            setPlayList(data.files)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      }

      const downloadFile = async (filename: string) => {
        // Download an audio file from the pi.
        let res = await fetch(`/audio/${filename}`);
        console.log(res)
        return res.arrayBuffer();
      }

      const selectSong = (song: string, index: number) => {
        source = context.createBufferSource()
        if (currentSong === song) {
          stop(source)
        } 
        else 
        {
          start(song, source);
        }
      }

      const start = async (fileName: string, source: AudioBufferSourceNode) => {
        // Stop the existing source if already playing another song
        if (prevSource?.current?.source?.buffer) {
          prevSource?.current?.context?.suspend()
        }
        console.log("song queued: ", fileName)
        setCurrentSong(fileName)
        
        // download the audio file from the pi and decode
        let buffer: ArrayBuffer = await downloadFile(fileName);
        console.log(buffer, 'buffer created')
        let decodedAudio: AudioBuffer = await context.decodeAudioData(buffer);
        console.log(decodedAudio, 'audio decoded')
    
        // Setup audio source
        source.buffer = decodedAudio
        source.connect(context.destination);
    
        // Tell the pi to play the light sequence.
        // It will reply with the unix timestamp at which to start playing the audio.
        // This accounts for network latency (assuming clocks are synced).
        // let res = await fetch(`${PI_ADDRESS}/play/${fileName}`);
        // let json = await res.json();
        // let startTime = json.startTime;
        // let wait = startTime - Date.now();
    
        // Start the audio after the delay
        // source.start(wait / 1000);
        // Store context-related data in ref to be referenced when new song is queued
        if (prevSource.current.name != fileName) {
          source.start(context.currentTime)
          console.log('context started')
          prevSource.current = {...prevSource.current, source: source, context: context, name: fileName }
        }
        else {
          prevSource.current.context?.resume()
        }
        // console.log(prevSource.current.context)
        // let obj = {
        //   sourceprop: prevSource.current.context
        // }
        // console.log(obj)
        // dispatch({ type: 'SET_CONTEXT', context: {...context} })
        // dispatch({ type: 'SET_SOURCE', source: {...source} })
        // console.log('redux state set')
      }
    
      const stop = async (source: AudioBufferSourceNode) => {
        prevSource?.current?.context?.suspend()
        setCurrentSong('')
        // source = null;
        // Tell pi to stop the light sequence
        await fetch(`/stop`, {method: 'POST'});
      }

      const setUpAnalyser = (source: AudioBufferSourceNode) => {
        const analyser = context.createAnalyser()
        analyser.fftSize = 2048

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteTimeDomainData(dataArray)

        source.connect(analyser)
      }

    useEffect( () => {
      getPlayList() 
    },[])

    // useEffect( () => {
    //   console.log('rendered')
    // },[currentSong])


    return (
        <div>
          <div>
              <Lights source={source} context={context} pause={stop} play={start}/>
          </div>
          <div className="playlist">
              <ul>
                  {playlist.map( (val: string, i: number) => (
                  <li key={i} onClick={() => {
                      selectSong(val, i)}}>
                      {currentSong == val ? pauseButton : playButton}
                      {val}
                  </li>))}
              </ul>
          </div>
        </div>
    )

}

export default List