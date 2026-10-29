import { NavLink } from "react-router"
import styles from "./navbar.module.css"
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ChatIcon from '@mui/icons-material/Chat'

export default function Navbar(){
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
            <NavLink to={"/posts"}><DynamicFeedIcon sx={styling}/></NavLink>
            <NavLink to={"/"}><PersonIcon sx={styling}/></NavLink>
            <NavLink to={"/profile/search"}><SearchIcon sx={styling}/></NavLink>
            <NavLink to={"/chat"}><ChatIcon sx={styling}/></NavLink>
        </nav>
    )
}