"use client";
import {
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function UploadImage() {
  const [file, setFile] = useState([]);

  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [userId, setUserId] = useState("");

  //   get user
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };

    getUserId();
  }, [supabase]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (file) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("Images")
        .upload(`public/${uuidv4()}.jpg`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (fileData) {
        const imagePath = fileData.path;

        uploadImage(imagePath);

        // const { data, error } = await supabase
        //   .from("user_image")
        //   .insert([{ user_id: userId, image_path: imagePath }])
        //   .select();

        // use image path to get src

        // insert source into string

        // save string as new post

        // if (data) {
        //   console.log("Data inserted successfully:", data);
        // }

        // if (error) {
        //   console.log("Error inserting data:", error);
        // }
      }

      if (fileError) {
        console.log("Error uploading file:", fileError);
      }
    }
  };

  console.log(file);

  const handleFileSelected = (e) => {
    setFile(e.target.files[0]);
  };

  function uploadImage(imagePath: string) {
    // const imagePath = "public/avatar1.png";
    // use image path to get src

    const { data } = supabase.storage.from("Images").getPublicUrl(imagePath);

    // insert source into string

    const imageElementString = ` <img
        className="h-auto max-w-full"
        alt="image description"
        src="${data.publicUrl}"
      />`;

    postImage();

    async function postImage() {
      const { data, error } = await supabase
        .from("post")
        .insert([
          {
            posting_user_id: userId,
            community_id: 1,
            post_title: "My least fav car",
            post_content: imageElementString,
            is_image: true,
          },
        ])
        .select();
      if (data) console.log(data);
      if (error) console.log(error);
    }

    // save string as new post
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" onChange={handleFileSelected} />
        <button type="submit">Upload image</button>
      </form>
      {/* <button className="block p-5 mt-5 bg-slate-500" onClick={uploadImage}>
        test image
      </button> */}
    </>
  );
}
