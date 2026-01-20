import React, { useState } from "react";
import { useMessage } from "../common/MessageDisplay";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

function Registration() {
  const { ErroDisplay, SuccessDisplay, showError, showSuccess } = useMessage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phoneNumber
    ) {
      showError("All fields are required");
      return;
    }

    if (formData.password != formData.confirmPassword) {
      showError("Password do not match");
    }

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    };
    try {
      const response = await ApiService.registerUser(registrationData);
      if (response.statusCode == 200) {
        navigate("/login");
      } else {
        showError("Registration is not successfull");
      }
    } catch (error) {
      showError("Registration is not successfull");
    }
  };

  return <div>Registration</div>;
}

export default Registration;
