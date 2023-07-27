"use client";
import { fetchUser } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function UploadImage() {
  const [file, setFile] = useState<File | undefined>(undefined);

  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies

  const [userId, setUserId] = useState("");

  //   get user
  useEffect(() => {
    const getUserId = async () => {
      const user = await fetchUser(supabase); // get user
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
      }

      if (fileError) {
        console.log("Error uploading file:", fileError);
      }
    }
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
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
      const { error } = await supabase
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

      if (error) return;
    }

    // save string as new post
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" onChange={handleFileSelected} />
        <button type="submit">Upload image</button>
      </form>
    </>
  );
}
