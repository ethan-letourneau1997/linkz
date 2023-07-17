"use client";

import { ChangeEvent, SetStateAction, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../editor/text-editor";
import { Input } from "../ui/input";
import { Notifications, notifications } from "@mantine/notifications";
import { Button } from "../ui/button";

interface CreatePostProps {
  communityId: string;
  userId: string;
}

export function CreatePost({ communityId, userId }: CreatePostProps) {
  const supabase = createClientComponentClient();

  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [file, setFile] = useState<any>(null);

  const updatePostContent = (newValue: SetStateAction<string>) => {
    setPostContent(newValue);
  };

  const handlePostTitleChange = (event: any) => {
    setPostTitle(event.target.value);
  };

  const handleCreateTextPost = async () => {
    if (postTitle.length < 10) {
      triggerShortTitleNotif();
    }
    if (postContent.length < 1) {
      triggerNoContentNotif();
    }
    const { data, error } = await supabase
      .from("post")
      .insert([
        {
          posting_user_id: userId,
          community_id: communityId,
          post_title: postTitle,
          post_content: postContent,
        },
      ])
      .select();
  };

  const handleCreateImagePost = async () => {
    // notification if too short
    if (!file) {
      triggerNoFileNotif();
    } else if (postTitle.length < 10) {
      triggerShortTitleNotif();
    } else if (file) {
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
  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const uploadImage = async (imagePath: string) => {
    const { data } = await supabase.storage
      .from("Images")
      .getPublicUrl(imagePath);

    const imageElementString = `
      <img
        className="h-auto max-w-full"
        alt="image description"
        src="${data.publicUrl}"
      />
    `;

    postImage(imageElementString);
  };

  const postImage = async (imageElementString: string) => {
    const { data, error } = await supabase
      .from("post")
      .insert([
        {
          posting_user_id: userId,
          community_id: communityId,
          post_title: postTitle,
          post_content: imageElementString,
          is_image: true,
        },
      ])
      .select();

    triggerNotification();
  };

  function triggerNotification() {
    notifications.show({
      title: "Default notification",
      message: "Your post has been uploaded! 🤥",
    });
  }

  function triggerShortTitleNotif() {
    notifications.show({
      title: "Error",
      message: "Your title must be at least 10 characters! 🤥",
    });
  }

  function triggerNoContentNotif() {
    notifications.show({
      title: "Error",
      message: "Your post is empty!",
    });
  }

  function triggerNoFileNotif() {
    notifications.show({
      title: "Error",
      message: "You have not uploaded an image!",
    });
  }

  return (
    <div>
      <Notifications />
      <Button
        onClick={() =>
          notifications.show({
            title: "Default notification",
            message: "Hey there, your code is awesome! 🤥",
            className: "post-notification",
            autoClose: 50000,
          })
        }
      >
        Nofify
      </Button>
      <p>hello create post.</p>
      <div className="pt-5 mb-4">
        <Tabs defaultValue="text" className="w-[700px]">
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-5">
            <label className="block mb-2" htmlFor="name">
              Title
            </label>
            <Input
              id="name"
              type="text"
              value={postTitle}
              onChange={handlePostTitleChange}
            />
            <TextEditor content={postContent} updateHTML={updatePostContent} />

            <button
              className="px-3 py-1 mt-6 border hover:bg-white hover:text-black"
              onClick={handleCreateTextPost}
            >
              Create
            </button>
          </TabsContent>
          <TabsContent value="image" className="pt-5">
            <label className="block mb-2" htmlFor="name">
              Title
            </label>
            <Input
              id="name"
              type="text"
              value={postTitle}
              onChange={handlePostTitleChange}
            />

            <input type="file" name="image" onChange={handleFileSelected} />
            <button onClick={handleCreateImagePost} type="submit">
              Upload image
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
