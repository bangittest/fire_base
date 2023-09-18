import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Input, Radio, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/configFirebase";
import axios from "axios";

export default function Signup() {
  const [gender, setGender] = useState(0);
  const [imageURL, setImageURL] = useState(null);

  const [user, setUser] = useState({
    email: "",
    avatar: "",
    password: "",
    user_name: "",
    dateOfBirthday: "",
    role: 1,
  });

  // Tạo một them chiếu đến thư mục chưa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  const handleCheck = (e) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };

  // Props của Upload
  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        // Lấy đường dẫn của ảnh sau khi hoàn tất quá trình tải
        const downloadURL = info.file.response.url;
        // Lưu đường dẫn vào trong một state
        setImageURL(downloadURL);
        // Hiển
        message.success("Tải lên hình ảnh thành công.");
      } else if (info.file.status === "error") {
        message.error("Tải lên hình ảnh thất bại.");
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Tạo một tham chiếu đến kho ảnh trên firebase
        const imageRef = ref(imageListRef, file.name);

        // Tải ảnh lên firebase
        await uploadBytes(imageRef, file);

        // Lấy url từ firebase về sau khi upload thành công
        const downloadURL = await getDownloadURL(imageRef);

        // Gọi hàm onSuccess để thông báo là upload ảnh thành công
        onSuccess({ url: downloadURL });
      } catch (error) {
        onError(error);
      }
    },
  };

  //lấy giá trị ô input
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    // console.log(value,name);
  console.log(name, value);

    //distructoring
    setUser({
      ...user,
      [name]: value,
    });
  };

  // xử lí hàm submit
  const handleOnSubmit = (e) => {
    e.preventDefault();
   const newUser={
    email: user.email,
    avatar:imageURL,
    password: user.password,
    user_name:user.user_name,
    dateOfBirthday:user.dateOfBirthday,
    gender:gender,
    role: 1,
   }
   console.log(newUser);
    axios
      .post("http://localhost:3000/users", newUser )
      .then((response) => {
        if (response.status === 201) {
          //hien thi thanh cong
          notification.success({
            message: "thành công",
            description: "thêm mới user thành công",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({                            
          message: "thất bại",
          description: "thêm mới user thất bại",
        });
      });
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-rgba-black">
        <form className="bg-white p-6 rounded w-2/6" onSubmit={handleOnSubmit}>
            <div className="flex items-center justify-between py-1.5">
              <h3>Signup</h3>
              <CloseOutlined className="cursor-pointer hover:bg-slate-300 p-2 rounded-full" />
            </div>
          <div className="mb-3">
            <label htmlFor="name">Họ và tên</label>
            <Input name="user_name" onChange={handleInputChange} placeholder="Nhập họ và tên" className="mt-2" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Ngày sinh</label>
            <Input name="dateOfBirthday" onChange={handleInputChange} type="date" className="mt-2" id="name" />
          </div>
          <div className="mb-3">
            <label htmlFor="name">Giới tính</label>
            <div className="mt-2">
              <Radio.Group onChange={handleCheck} value={gender}>
                <Radio value={0}>Nam</Radio>
                <Radio value={1}>Nữ</Radio>
                <Radio value={2}>Khác</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="name">Hình ảnh</label>
            <div className="text-center mt-2">
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </div>
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
            <Input name="password" onChange={handleInputChange} placeholder="Nhập mật khẩu" className="mt-2" id="name" />
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
    </>
  );
}
