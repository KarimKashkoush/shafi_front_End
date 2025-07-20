import { Avatar } from "@mui/material"
export default function ProfileHeader({ userData }) {
      const userName = userData ? userData.full_name : "المستخدم";
      const userImage = userData ? userData.image : null;
      return (
            <section className="profile-header">
                  <h4>أهــلا، <span>{userName}</span></h4>
                  <Avatar
                        src={userImage || undefined}
                        alt={userName}
                        sx={{ width: 56, height: 56 }} // تقدر تغير الحجم زي ما تحب
                        loading="lazy"
                        
                  >
                        {!userImage && userName.charAt(0)}
                  </Avatar>
            </section>
      )
}
