import React from "react";
import axios from "axios";

class ApiService {
  static BASE_URL = "http://localhost:8080/api";

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
    const response = await axios.post(`${this.BASE_URL}/auth/register`, body);
    console.log("line 71");
    return response.data;
  }

  static async loginUser(body) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, body);
    return response.data;
  }

  // user details

  static async getMyAccountDetails() {
    const response = await axios.get(`${BASE_URL}/users/myAccountDetails`, {
      headers: getHeader(),
    });

    return response.data;
  }

  static async updateMyAccount(body) {
    const response = await axios.put(
      `${BASE_URL}/users/updateMyAccount`,
      body,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async allPilots() {
    const response = await axios.get(`${BASE_URL}/users/allPilots`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  // Role

  static async addRole(body) {
    await axios.post(`${BASE_URL}/role/add`, body, {
      headers: this.getHeader(),
    });
  }

  static async updateRole(body) {
    await axios.put(`${BASE_URL}/role/update`, body, {
      headers: this.getHeader(),
    });
  }

  static async deleteRole(roleName) {
    await axios.delete(`${BASE_URL}/role/delete/${roleName}`, {
      headers: this.getHeader(),
    });
  }

  static async allRoles() {
    await axios.get(`${BASE_URL}/role/allRoles`, {
      headers: this.getHeader(),
    });
  }

  // Airport Controller

  static async createAirport(body) {
    const response = await axios.post(`${BASE_URL}/airport/create`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateAirport(body) {
    const response = await axios.put(`${BASE_URL}/airport/update`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllAirports() {
    const response = await axios.get(`${this.BASE_URL}/airport/allAirports`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAirportById(id) {
    const response = await axios.get(`${BASE_URL}/airport/findById/${id}`, {
      headers: this.getHeader(),
    });

    return response.data;
  }
}

export default ApiService;
