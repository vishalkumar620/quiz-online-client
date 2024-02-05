import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import PageTitle from "../../../Component/PageTitle";
import { Image } from "antd";

function UserProfile() {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="flex justify-center card">
      <div className=" flex justify-center">
        <PageTitle title="Profile" />
      </div>
      <div className="flex justify-center flex-col ">
        <div className="flex justify-center mt-2">
          <Image
            src="https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg" width="200px"height="200px"
          />
        </div >
        <div className="flex justify-center mt-2">
        <ul>
          <li>Name: {user?.name}</li>
          <li>Email: {user?.email}</li>
          <li> Created on: {moment(user.createdAt).format("DD-MM-YYYY")}</li>
        </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
