import axios from "axios";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const createOrder = (reqData) => async (dispatch) => {
  console.log("req data ", reqData);
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${reqData.jwt}`,
      },
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/api/orders/`,
      reqData.address,
      config
    );
    if (data.id) {
      reqData.navigate({ search: `step=3&order_id=${data.id}` });
    }
    console.log("created order - ", data);
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("catch error : ", error);
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getOrderById = (order_id) => async (dispatch) => {
  console.log("get order req ", order_id);
  try {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });

    const { data } = await api.get(
      `/api/orders/${order_id}`,
      
    );
    console.log("order by id ", data);
    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("catch ",error)
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getOrderHistory = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });
    
    console.log("Fetching order history...");
    const { data } = await api.get('/api/orders/user');
    
    console.log("Order history full response:", data);
    console.log("Number of orders:", data?.length || 0);
    console.log("Order statuses:", data?.map(order => order.orderStatus));
    
    if (!data || data.length === 0) {
      console.log("No orders found in the response");
    }
    
    dispatch({
      type: GET_ORDER_HISTORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
