import ProfileElement from "./ProfileElement";

export default function ProfileList({profiles}){
    return (
        <>
        {profiles.map(profile => <ProfileElement profile={profile}/>)}
        </>
    )
}