// import { startSession } from "../../../server/models/examModel";

const { default: axiosInstance } = require("./index");
//add report
export const addReport =async (payload)=>{
    try{
        const response = await axiosInstance.post("/api/reports/add-report",payload);
        return response.data;

    }catch(error){
        return error.response.data;

    }
}

//get all reports 

export const getAllReports=async(filters)=>{
    try{
        const response=await axiosInstance.post("/api/reports/get-all-reports",filters);
        return response.data;

    }catch(error){
        return error.response.data;
    }
}
// filter question code startSession
export const getAllExcel=async(filters)=>{
    try{
        const response=await axiosInstance.post("/api/reports/get-all-excel",filters);
        return response.data;

    }catch(error){
        return error.response.data;
    }
}


// code end



//get all reports by user
export const getAllReportsByUser =async()=>{
    try{
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-user",);
        return response.data;

    }catch(error){
        return error.response.data;

    }
}
