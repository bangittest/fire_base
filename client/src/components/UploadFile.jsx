import React, { useEffect, useState } from "react";
import { storage } from "../firebase/configFirebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import ReactPlayer from 'react-player'

export default function UploadFile() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  console.log(imageUrls);

  //tạo 1 tham chiếu đến thư mục chứa kho ảnh trên firebase
  const imageListRef=ref(storage,'images/')

  //hàm upload đc file lên firebase
  const uploadFires = (files) => {
    //phải xử lí được tác vụ thêm nhiều file =>bất đồng bộ => sử dụng promise
    Promise.all(
      files.map((file) => {
        //tạo 1 tham chiếu <=> tạo folder trên firebase
        const imageRef = ref(storage, `images/${file.name}`);
        return uploadBytes(imageRef, file).then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        });
      })
    ).then((urls) => {
      //Trả về danh sách các urls
      setImageUrls((prev) => [...prev, urls]);
    });
  };

  const handleSlectFiles = (e) => {
    //lấy tất cả các giá trị trong ô input có type="file"
    const files = Array.from(e.target.files);
    // console.log(files);
    setImageUpload(files);
  };
  //khi click vào nút upload thjf tiến hành upload lên fire base
  const handleUpload = (e) => {
    // console.log(e.target.files[0]);
    if (!imageUpload) {
      return;
    } else {
      uploadFires(imageUpload);
    }
  };

  //lấy url lên firebase
  useEffect(()=>{
    listAll(imageListRef).then(response=>{
        //response trả về 1 mảng danh sách các url
        response.items.forEach(item=>{
            getDownloadURL(item).then(url=>{
                //danh sách Url
                setImageUrls((prev)=>[...prev,url]);
            })
        })
    })
  },[])

  return (
    <div style={{display:"flex",gap:10}}>
        {
            imageUrls.map((url)=>(
                <ReactPlayer url={url} controls={true} />
                // <img src={url} key={url} height={200} width={200} alt="" />
            ))
        }
      <input type="file" onChange={handleSlectFiles} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
