import { Avatar } from "@mui/material"
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";
export default function ProfileHeader() {
      const { user } = useContext(AuthContext);
      const firstName = user ? user.firstName : "المستخدم";
      const fullName = user ? user.fullName : '';
      const userImage = user ? user.image : null;

      return (
            <section className="profile-header">
                  <h4>أهــلا، <span>{firstName}</span> {fullName}</h4>
                  <Avatar
                        src={userImage || undefined}
                        alt={firstName}
                        sx={{ width: 56, height: 56 }}
                        loading="lazy"

                  >
                        {!userImage && typeof fullName === 'string' && firstName?.charAt(0)}
                  </Avatar>
            </section>
      )
}
