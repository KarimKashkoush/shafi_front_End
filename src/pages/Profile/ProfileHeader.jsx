import { Avatar } from "@mui/material"
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";
export default function ProfileHeader() {
      const {user} = useContext(AuthContext);
      const firstName = user ? user.UserData.firstName : "المستخدم";
      const userName = user ? user.UserData.fullName : '';
      const userImage = user ? user.UserData.image : null;

      return (
            <section className="profile-header">
                  <h4>أهــلا، <span>{firstName}</span> {userName}</h4>
                  <Avatar
                        src={userImage || undefined}
                        alt={firstName}
                        sx={{ width: 56, height: 56 }}
                        loading="lazy"

                  >
                        {!userImage && typeof userName === 'string' && firstName?.charAt(0)}
                  </Avatar>
            </section>
      )
}
