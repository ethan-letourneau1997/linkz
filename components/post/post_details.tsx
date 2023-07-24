import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { fetchUser } from "@/lib/utils";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

// import { getTimeSinceNow } from "@/lib/time_since";
import { BiChevronDownCircle, BiChevronUpCircle } from "react-icons/bi";
import { VoteCount } from "./vote-count";
import { getTimeSinceNow } from "@/lib/time_since";
import { PostDetailsProps, PostProps, PostHeaderProps } from "./post.type";
import { PostComments } from "../comments/post-comments";
import { Suspense } from "react";

export default async function PostDetails({ postId }: PostDetailsProps) {
  const supabase = createServerComponentClient({ cookies }); // get supabase

  // get user
  const user = await fetchUser(supabase); // get user

  const post: PostProps = await getPostDetails(supabase, postId);

  if (post)
    return (
      <div>
        <div className="w-screen bg-neutral-800 py-2 pl-2 text-neutral-200">
          <div className="mx-auto flex max-w-[800px] gap-2">
            <FaChevronLeft className="my-auto" />
            <span className="font-semibold ">
              {post.community_id.community_name}
            </span>
          </div>
        </div>
        <div className="mx-auto max-w-[800px] space-y-3 bg-neutral-50 pt-4 md:mt-3 ">
          <div className="px-3">
            <PostHeader post={post} />

            <h1 className="text-lg font-semibold">{post.post_title}</h1>
          </div>
          <div className="bg-neutral-200 ">
            {post.is_image ? (
              <Suspense fallback={<div>Loading...</div>}>
                {/* <Link
                  href={getImageLinkFromHTML(post.post_content)}
                  target="_blank"
                > */}
                <div
                  className="rich-text  "
                  dangerouslySetInnerHTML={{ __html: post.post_content }}
                />
                {/* </Link> */}
              </Suspense>
            ) : (
              <div
                className="rich-text px-3"
                dangerouslySetInnerHTML={{ __html: post.post_content }}
              />
            )}
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-[800px] bg-neutral-50">
          <PostComments postId={postId} />
        </div>
      </div>
    );
}

async function getPostDetails(supabase: any, postId: number) {
  let { data: post, error } = await supabase
    .from("post")
    .select(
      "id, created_at, posting_user_id(id, username),community_id(community_name), post_title, post_content, is_image ",
    )
    .match({ id: postId })
    .limit(1)
    .single();
  if (post) {
    return post;
  }
}

async function PostHeader({ post }: PostHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className=" text-xs font-normal text-neutral-600 ">
        <div className="hidden md:inline">posted by&nbsp;</div>
        <span className="underline md:font-semibold">
          {post.posting_user_id && post.posting_user_id.username}
        </span>
        &nbsp;
        <span className="hidden md:inline">
          {getTimeSinceNow({
            originalTime: post.created_at,
            short: false,
          })}
        </span>
        <span className="md:hidden ">
          {getTimeSinceNow({
            originalTime: post.created_at,
            short: true,
          })}
        </span>
      </div>
      <div className=" flex gap-1 ">
        <BiChevronUpCircle className="my-auto hover:cursor-pointer hover:text-green-600" />
        <span className="my-auto text-sm">
          <VoteCount postId={post.id} vote_table="user_post_vote" />
        </span>
        <BiChevronDownCircle className="my-auto hover:cursor-pointer hover:text-red-600" />
      </div>
    </div>
  );
}

// async function getImageLinkFromHTML(htmlString: string | null) {
//   if (htmlString) {
//     const imgTagRegex = /<img[^>]+src="([^">]+)"/;
//     const match = htmlString.match(imgTagRegex);

//     if (match && match[1]) {
//       return match[1];
//     } else {
//       return "#"; // If there's no image tag or no 'src' attribute in the image tag
//     }
//   }

//   return "#"; // Return '#' if htmlString is null or empty
// }

// <div className="mx-auto max-w-[800px] bg-neutral-50 px-3">
//   {user && user.id === focusPost.posting_user_id ? (
//     <div className="my-5 ">
//       <EditPost post={focusPost} />
//     </div>
//   ) : (
//     <Link
//       href={getImageLinkFromHTML(focusPost.post_content)}
//       target="_blank"
//     >
//       <div
//         className="rich-text mt-5 appearance-none"
//         dangerouslySetInnerHTML={{ __html: focusPost.post_content }}
//       />
//     </Link>
//   )}
//   <PostVotes postId={focusPost.id} userId={user ? user.id : null} />

//   {user && <CommentTree postId={postId} userId={user.id} />}
// </div>
