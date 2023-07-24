"use client";

import { ChangeEvent, SetStateAction, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TextEditor } from "../editor/text-editor";
import { Input } from "../ui/input";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import {
  triggerShortTitleNotif,
  triggerNoContentNotif,
  triggerNoFileNotif,
  triggerNotification,
} from "../notifications/notification";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface CreatePostProps {
  communityId: string;
  userId: string;
}

export function CreatePost({ communityId, userId }: CreatePostProps) {
  const supabase = createClientComponentClient();

  const router = useRouter();

  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [file, setFile] = useState<any>(null);

  console.log(file);

  const updatePostContent = (newValue: SetStateAction<string>) => {
    setPostContent(newValue);
  };

  const handlePostTitleChange = (event: any) => {
    setPostTitle(event.target.value);
  };

  const handleCreateTextPost = async () => {
    if (postTitle.length < 10) {
      triggerShortTitleNotif();
      return;
    } else if (postContent.length < 1) {
      triggerNoContentNotif();
      return;
    } else {
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
      if (data && data[0].id) {
        router.push(`${data[0].id}`);
      }
      if (error) console.log(error);
    }
  };

  const handleCreateImagePost = async () => {
    if (!file) {
      // no file
      triggerNoFileNotif();
      return;
    }
    if (postTitle.length < 10) {
      // title < 10 characters
      triggerShortTitleNotif();
      return;
    }
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
        id="Post-image"
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

    if (data && data[0].id) {
      router.push(`${data[0].id}`);
    }

    triggerNotification();
  };

  function clearImage() {
    setFile(null);
  }

  return (
    <div>
      <Notifications />
      <h1 className="text-2xl font-medium">New Post</h1>
      <div className="mb-4 pt-5">
        <Tabs defaultValue="text" className="w-[700px]">
          <TabsList>
            <TabsTrigger onClick={clearImage} value="text">
              Text
            </TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-5">
            <label className="mb-2 block" htmlFor="name">
              Title
            </label>
            <Input
              id="name"
              type="text"
              value={postTitle}
              onChange={handlePostTitleChange}
            />
            <TextEditor content={postContent} updateHTML={updatePostContent} />

            <Button className="mt-5 " onClick={handleCreateTextPost}>
              Create
            </Button>
          </TabsContent>
          <TabsContent value="image" className="pt-5">
            <label className="mb-2 block" htmlFor="name">
              Title
            </label>
            <Input
              id="name"
              type="text"
              value={postTitle}
              onChange={handlePostTitleChange}
            />

            <div className="mt-3 flex items-end">
              <div>
                {/* <Label htmlFor="picture">Picture</Label> */}
                <Input
                  className="w-fit bg-transparent pt-0"
                  id="picture"
                  type="file"
                  onChange={handleFileSelected}
                />
              </div>
              {file && (
                <Button onClick={handleCreateImagePost} type="submit">
                  Upload image
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
