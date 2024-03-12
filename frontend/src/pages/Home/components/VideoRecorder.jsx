import React, { useState } from 'react'
import 'video-react/dist/video-react.css'
import { Player } from 'video-react'
import { RecordRTCPromisesHandler } from 'recordrtc'
import { FiDownload } from "react-icons/fi";
// import { saveAs } from 'file-saver'

const MainRecorder = () => {
    const [recorder, setRecorder] = useState(null)
    const [stream, setStream] = useState(null)
    const [videoBlob, setVideoUrlBlob] = useState(null)
    const [isRecording , setIsRecording] = useState(false)

    const startRecording = async () => {
        try {
            setIsRecording(true)
            const mediaDevices = navigator.mediaDevices;
            const stream = await mediaDevices.getUserMedia({video: true,audio: true,})
            const recorder = new RecordRTCPromisesHandler(stream, {
                type: 'video',
            });
            await recorder.startRecording();
            setRecorder(recorder);
            setStream(stream);
            setVideoUrlBlob(null);
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };
    const stopRecording = async () => {
        if (recorder) {
                setIsRecording(false)
                await recorder?.stopRecording()
                const blob = await recorder.getBlob()
                stream.stop()
                setVideoUrlBlob(blob)
                setStream(null)
                setRecorder(null)
            }
        }

    const downloadVideo = () => {
        if (videoBlob) {
            // const mp4File = new File([videoBlob], 'demo.mp4', { type: 'video/mp4' })
            // saveAs(mp4File, `Video-${Date.now()}.mp4`)
            // saveAs(videoBlob, `Video-${Date.now()}.webm`)
        }
    }

    return (
        <div className="flex-col justify-center items-center bg-gray-300 min-w-[500px] h-[350px] rounded-[20px] px-[20px] py-[10px]">
            <div className="flex items-center justify-center flex-wrap ">
                <button
                    className="m-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    aria-label="start recording"
                    onClick = {startRecording}
                >
                Start Recording
                </button>
                <button
                    className="m-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    aria-label="stop recording"
                    onClick={stopRecording}
                    disabled={!recorder}
                >
                Stop Recording
                </button>
                <button
                    className="m-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    aria-label="download video"
                    onClick={downloadVideo}
                    disabled={!videoBlob}
                >
                 <FiDownload />   
                </button>
            </div>
            {!videoBlob && isRecording && <span className='font-bold text-[18px] text-black block text-center'>Video is Recording ...</span>}
            <div className={`${videoBlob ? 'bg-transparent' : 'bg-red-300'} max-w-[350px]`}>
                {videoBlob && <Player src={window.URL.createObjectURL(videoBlob)}/>}
            </div>

        </div>
    )
}
export default MainRecorder