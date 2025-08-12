import { Avatar } from "@mui/material"
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";
export default function ProfileHeader() {
      const { user } = useContext(AuthContext);
      const first_name = user ? user.first_name : "المستخدم";
      const full_name = user ? user.full_name : '';
      const userImage = user ? user.image : null;

      return (
            <section className="profile-header">
                  <h4>أهــلا، <span>{first_name}</span> {full_name}</h4>
                  <Avatar
                        src={userImage || undefined}
                        alt={first_name}
                        sx={{ width: 56, height: 56 }}
                        loading="lazy"

                  >
                        {!userImage && typeof full_name === 'string' && first_name?.charAt(0)}
                  </Avatar>
            </section>
      )
}
