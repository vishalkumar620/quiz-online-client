import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../Apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { useNavigate } from "react-router-dom";
import { ShowLoading, HideLoading } from "../redux/loaderSlice";


function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      path: ["/"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },

    {
      title: "Reports",
      path: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Profile",
      path: ["/user/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/user/profile"),
    },
    {
      title: "Logout",
      path: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];
  const adminMenu = [
    // {
    //   title: "Dashboard",
    //   paths: ["/dddd"],
    //   icon: <i className="ri-home-line"></i>,
    //   onClick: () => navigate("/"),
    // },
    {
      title: "Home",
      paths: ["/"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      path: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      path: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Profile",
      path: ["/admin/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/admin/profile"),
    },
    {
      title: "Logout",
      path: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        // message.success(response.message);
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;
  const getIsActiveOrNot = (paths) => {
    if (paths?.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute?.includes("/admin/exams/edit") &&
        paths?.includes("/admin/exams")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="layout">
      <div className="flex gap-2 w-full h-full h-100">
        <div className="sidebar">
          <div className="menu">
            {menu.map((item, index) => {
              return (
                <div
                  className={`menu-item
              ${getIsActiveOrNot(item.paths) && "active-menu-item"}`}
                  key={index}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed && (
              <i class="ri-close-line" onClick={() => setCollapsed(true)}></i>
            )}
            {collapsed && (
              <i class="ri-menu-line" onClick={() => setCollapsed(false)}></i>
            )}
            <h1 className="text-2xl text-white"> SHEY QUIZ Portal</h1>
            <div>
              <div className="flex gap-1 items-center">
                <i class="ri-user-line"></i>
                <h1 className="text-md text-white ">{user?.name}</h1>
              </div>
              <span>Role:{user?.isAdmin? "Admin" : "user"}</span>
            </div>
          </div>

          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
