import React from "react";
import axios from "axios";

class ApiService {
  static BASE_URL = "http://localhost:8080/api";
  static axiosInstance = axios.create();

  static {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status == 403) {
          this.logout();
          window.location.href = "/login";
          return Promise.reject(error);
        }
        return Promise.reject(error);
      },
    );
  }

  static saveToken(token) {
    localStorage.setItem("token", token);
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static saveRoles(roles) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  static getRoles() {
    const roles = localStorage.getItem("roles");

    return roles ? JSON.parse(roles) : null;
  }

  static hasRole(role) {
    const roles = this.getRoles();

    return roles ? roles.includes(role) : false;
  }

  static isAdmin() {
    const roles = this.getRoles();

    return roles ? roles.includes("ADMIN") : false;
  }

  static isPilot() {
    const roles = this.getRoles();

    return roles ? roles.includes("PILOT") : false;
  }

  static isCustomer() {
    const roles = this.getRoles();
    return roles ? roles.includes("CUSTOMER") : false;
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
  }

  static isAuthenticated() {
    const token = this.getToken();
    return token ? true : false;
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // REGISTER AND LOGIN USER

  static async registerUser(body) {
    console.log("inside register user ", body);
    console.log("url", `${this.BASE_URL}/auth/register`);
    const response = await this.axiosInstance.post(
      `${this.BASE_URL}/auth/register`,
      body,
    );
    console.log("line 71");
    return response.data;
  }

  static async loginUser(body) {
    const response = await this.axiosInstance.post(
      `${this.BASE_URL}/auth/login`,
      body,
    );
    return response.data;
  }

  // user details

  static async getMyAccountDetails() {
    console.log("line 844444444", `${this.BASE_URL}/users/myAccountDetails`);
    console.log(this.getHeader());
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/users/myAccountDetails`,
      {
        headers: this.getHeader(),
      },
    );

    return response.data;
  }

  static async updateMyAccount(body) {
    console.log("inside update my acccount api");
    const response = await this.axiosInstance.put(
      `${this.BASE_URL}/users/updateMyAccount`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async allPilots() {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/users/allPilots`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  // Role

  static async addRole(body) {
    await this.axiosInstance.post(`${this.BASE_URL}/role/add`, body, {
      headers: this.getHeader(),
    });
  }

  static async updateRole(body) {
    await this.axiosInstance.put(`${this.BASE_URL}/role/update`, body, {
      headers: this.getHeader(),
    });
  }

  static async deleteRole(roleName) {
    await this.axiosInstance.delete(
      `${this.BASE_URL}/role/delete/${roleName}`,
      {
        headers: this.getHeader(),
      },
    );
  }

  static async allRoles() {
    await this.axiosInstance.get(`${this.BASE_URL}/role/allRoles`, {
      headers: this.getHeader(),
    });
  }

  // Airport Controller

  static async createAirport(body) {
    const response = await this.axiosInstance.post(
      `${this.BASE_URL}/airport/create`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async updateAirport(body) {
    const response = await this.axiosInstance.put(
      `${this.BASE_URL}/airport/update`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getAllAirports() {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/airport/allAirports`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getAirportById(id) {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/airport/findById/${id}`,
      {
        headers: this.getHeader(),
      },
    );

    return response.data;
  }

  static async searchFlights(
    departureIataCode,
    arrivalIataCode,
    departureDate,
  ) {
    const params = {
      departureIataCode: departureIataCode,
      arrivalIataCode: arrivalIataCode,
      status: "SCHEDULED",
      departureDate: departureDate,
    };

    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/flights/searchFlight`,
      {
        params: params,
        headers: this.getHeader(),
      },
    );

    return response.data;
  }

  static async findFlightById(id) {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/flights/flightById/${id}`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  // booking apis
  static async getMyBookings() {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/booking/myBookings`,
      {
        headers: this.getHeader(),
      },
    );

    return response.data;
  }

  static async getBookingById(id) {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/booking/getById/${id}`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async createBooking(body) {
    const response = await this.axiosInstance.post(
      `${this.BASE_URL}/booking/create`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getAllFlights() {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/flights/allFlights`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getAllBookings() {
    const response = await this.axiosInstance.get(
      `${this.BASE_URL}/booking/allBookings`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async updateBookingStatus(id, body) {
    const response = await this.axiosInstance.put(
      `${this.BASE_URL}/updateBooking/${id}`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getAllCities() {
    const resp = await this.axiosInstance.get(
      `${this.BASE_URL}/flights/allCities`,
    );
    return resp.data;
  }

  static async getAllCountries() {
    const resp = await this.axiosInstance.get(
      `${this.BASE_URL}/flights/allCountries`,
    );
    return resp.data;
  }
}

export default ApiService;
