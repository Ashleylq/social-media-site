import { createContext, useContext, useEffect, useState } from "react";
import useSound from 'use-sound'

const audioContext = createContext()

export function AudioProvider({children}){
    const [isPlaying, setIsPlaying] = useState(false)
    const [index, setIndex] = useState(0)
    const audios = ['/dreamy_glass.mp3', '/techno.mp3', '/petal.mp3', '/aqua.mp3']
    const [playBg, {stop : stopBg}] = useSound(audios[index], {
        volume : 0.2,
        interrupt : false,
        loop : false,
        onend : () => {
            setIndex((prev) => (prev + 1) % 4)
        }
    })
    useEffect(() => {
        if(isPlaying){
            stopBg()
            const timer = setTimeout(() => {
                playBg()
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [index])
    function togglePlayPause(){
        if(isPlaying){
            stopBg()
            setIsPlaying(false)
        }
        else {
            playBg()
            setIsPlaying(true)
        }
    }
    const [playClick] = useSound('/glassy.wav', {volume : 0.6})
    const [playInteraction] = useSound('/chime.mp3', {volume : 0.6})
    const [playHover] = useSound('/futuristic.mp3', {volume : 0.6})
    const [playLink] = useSound('/bubbles.wav', {volume : 0.6})
    function playSfx(soundName){
        switch (soundName){
            case "click":
                playClick()
                break;
            case "interaction":
                playInteraction()
                break;
            case "hover":
                playHover()
                break;
            case "link":
                playLink()
                break;
        }
    }
    return (
        <audioContext.Provider value={{togglePlayPause, playSfx}}>
            {children}
        </audioContext.Provider>
    )
}

export const useAudio = () => useContext(audioContext)