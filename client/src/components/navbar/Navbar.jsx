import { NavLink } from "react-router"
import styles from "./navbar.module.css"
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ChatIcon from '@mui/icons-material/Chat'
import AudioTrackIcon from '@mui/icons-material/Audiotrack'
import { useAudio } from "../../utils/audioContext"

export default function Navbar(){
    const {togglePlayPause, playSfx} = useAudio()
    const styling = {
        fontSize : 32,
        color : 'rgba(30, 123, 30, 0.8)',
        transition : 'color 0.5s ease',
        '.active &' : {
            color : 'rgba(11, 74, 11, 0.8)'
        },
        '&:hover' : {
            color : 'rgba(14, 158, 14, 0.8)'
        }
    }
    return (
        <nav className={styles.nav}>
            <NavLink onClick={() => playSfx("link")} to={"/posts"}><DynamicFeedIcon sx={styling}/></NavLink>
            <NavLink onClick={() => playSfx("link")} to={"/"}><PersonIcon sx={styling}/></NavLink>
            <NavLink onClick={() => playSfx("link")} to={"/profile/search"}><SearchIcon sx={styling}/></NavLink>
            <NavLink onClick={() => playSfx("link")} to={"/chat"}><ChatIcon sx={styling}/></NavLink>
            <span onClick={() => togglePlayPause()}><AudioTrackIcon sx={styling}/></span>
        </nav>
    )
}