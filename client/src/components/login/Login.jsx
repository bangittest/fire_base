import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Input, Radio, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";




export default function Login() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [emailError, setEmailError] = useState(false);
  // const [passwordError, setPasswordError] = useState(false);

  // Hàm validate dữ liệu nhập vào
  // const validateData = (nameInput, valueInput) => {
  //   switch (nameInput) {
  //     case "email":
  //       if (!valueInput) {
  //         setEmailError(true);
  //       } else {
  //         setEmailError(false);
  //       }
  //       break;
  //     case "password":
  //       if (!valueInput) {
  //         setPasswordError(true);
  //       } else {
  //         setPasswordError(false);
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // Lấy giá trị từ các ô input
  const handleInputChange = (e) => {
    // Lấy name và value từ input
    const { value, name } = e.target;

    // Khi onChange thì gọi đến hàm validate
    // validateData(name, value);

    // Kiểm tra name và gán giá trị
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else {
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validateData("email", email);
    // validateData("password", password);

    if (email && password) {
      const newUser = {
        email: email,
        password: password,
      };
      // Gọi API đăng nhập
      axios
        .post("http://localhost:3000/login", newUser)
        .then((response) => {
          if (response.status === 200) {
            // Lưu dữ liệu lên local
            localStorage.setItem(
              "userLogin",
              JSON.stringify(response.data.user)
            );
            // Chuyển trang
            if (response.data.user.role === 0) {
              console.log("Chuyển vào trang admin");
            } else {
              console.log("Chuyển vào trang người dùng");
            }
          }
        })
        .catch((error) => {
          if (
            error.response.data === "Incorrect password" ||
            error.response.data === "Cannot find user" ||
            error.response.data === "Password is too short"
          ) {
            notification.error({
              message: "Cảnh báo",
              description: "Mật khẩu hoặc Email không đúng.",
            });
          }
        });
    }
  };



  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-rgba-black">
        <form className="bg-white p-6 rounded w-2/6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between py-1.5">
            <h3>Signup</h3>
            <CloseOutlined className="cursor-pointer hover:bg-slate-300 p-2 rounded-full" />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Email</label>
            <Input
              placeholder="Nhập địa chỉ email"
              className="mt-2"
              id="name"
              name="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Mật khẩu</label>
            <Input
              name="password"
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className="mt-2"
              id="name"
            />
          </div>
          <div>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full btn-primary"
            >
              Sinup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
