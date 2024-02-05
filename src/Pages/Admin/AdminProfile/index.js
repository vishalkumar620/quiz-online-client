import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import moment from "moment";
import { Link } from "react-router-dom";
import { getAllReports } from "../../../Apicalls/reports";
import PageTitle from "../../../Component/PageTitle";

function AdminProfile() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });

  const removeDuplicates = (array, key) => {
    const uniqueSet = new Set();
    const uniqueArray = [];


    for (const item of array) {

      const itemKey = item[key];

      const nestedUserName = item.user.name
      if (!uniqueSet.has(nestedUserName)) {
        uniqueSet.add(nestedUserName);
        uniqueArray.push(item);
      }
    }
    return uniqueArray;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user?.name}</>,
    },
    {
      title: "Created on",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.user?.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <>{record.user?.email}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => <Link to= {"/user/profile"}>  <i class="ri-eye-fill"></i>
       View Profile</Link>
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        const uniqueUsers = removeDuplicates(response.data, "user.name");
        setReportsData(uniqueUsers);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <div className="mt-1 mb-1">
      <PageTitle title="Profiles" />
      </div>
      <div className="divider"></div>
      <div className="flex gap-2 mt-2 w-100">
        <input
          type="text"
          placeholder="Search by User Name"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button className="primary-outlined-btn" onClick={() => {
          setFilters({
             examName: "",userName: ""
          })
          getData({
            examName: "",userName: ""
         });
        }}>
          Clear
        </button>
        <button className="primary-contained-btn " onClick={() => getData(filters)}>
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default AdminProfile;

// import React, { useEffect } from "react";
// import PageTitle from "../../../Component/PageTitle";
// import { Table, message } from "antd";
// import { useDispatch } from "react-redux";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
// import { getAllReports } from "../../../Apicalls/reports";
// import moment from "moment";
// import { Link } from "react-router-dom";

// function AdminProfile() {
//   const [reportsData, setReportsData] = React.useState([]);
//   const dispatch = useDispatch();
//   const [filters, setFilters] = React.useState({
//     examName: "",
//     userName: "",
//   });

//   const columns = [
//     {
//       title: " Name",
//       dataIndex: "userName",
//       render: (text, record) => <>{record.user?.name}</>,
//     },
//     {
//       title: "Created on",
//       dataIndex: "date",
//       render: (text, record) => (
//         <>{moment(record.user?.createdAt).format("DD-MM-YYYY hh:mm:ss")} </>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       render: (text, record) => <>{record.user?.email}</>,
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       render: (record) =><Link to={"/user/profile"}>View Profile</Link>,
//     },
//   ];

//   const getData = async (tempFilters) => {
//     try {
//       dispatch(ShowLoading());
//       const response = await getAllReports(tempFilters);
//       if (response.success) {
//         setReportsData(response.data);
//       } else {
//         message.error(response.message);
//       }
//       dispatch(HideLoading());
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };
//   useEffect(() => {
//     getData(filters);
//   }, []);

//   return (
//     <div>
//       <PageTitle title="All Student Profile" />
//       <div className="divider"></div>
//       <div className="flex gap-2 ">
        
//         <input
//           type="text"
//           placeholder="search by user Name"
//           value={filters.userName}
//           onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
//         />

//         <button
//           className="primary-outlined-btn"
//           onClick={() => {
//             setFilters({
//               examName: "",
//               userName: "",
//             });
//             getData({
//               examName: "",
//               userName: "",
//             });
//           }}
//         >
//           Clear
//         </button>

//         <button
//           className="primary-contained-btn"
//           onClick={() => getData(filters)}
//         >
//           Search
//         </button>
//       </div>
//       <Table columns={columns} dataSource={reportsData} className="mt-2" />
//     </div>
//   );
// }

// export default AdminProfile;
