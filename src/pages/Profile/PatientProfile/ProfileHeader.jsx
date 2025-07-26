import { Avatar } from "@mui/material"
export default function ProfileHeader({ userData }) {
      const firstName = userData ? userData.firstName : "المستخدم";
      const userName = userData ? userData.fullName : '';
      const userImage = userData ? userData.image : null;
      return (
            <section className="profile-header">
                  <h4>أهــلا، <span>{firstName}</span> {userName}</h4>
                  <Avatar
                        src={userImage || undefined}
                        alt={firstName}
                        sx={{ width: 56, height: 56 }} 
                        loading="lazy"
                        
                  >
                        {!userImage && typeof userName === 'string' && firstName.charAt(0)}
                  </Avatar>
            </section>
      )
}
