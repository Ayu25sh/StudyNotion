import React from 'react'
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';
import { toast } from 'react-toastify';



export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    

    try{
        const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{categoryId: categoryId});
        // console.log("result -- ",response);

        console.log("FETCHING CATALOG PAGE DATA RESPONSE ............", response)
        if(!response?.data?.success){
            throw new Error("Could not fetch Category Page Catalog");
        }

        result = response?.data;
        console.log("Result",result)

    }catch(error){
        console.log("FETCHING CATALOG PAGE DATA ERROR ............",error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}
