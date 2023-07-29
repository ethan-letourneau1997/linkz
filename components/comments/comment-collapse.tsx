"use client";

import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { getTimeSinceNow } from "@/lib/time_since";
import { useEffect, useState } from "react";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { fetchUser } from "@/lib/utils";
import { CommentVotes } from "../votes/comment-votes";
import { ClientNoUserVotes } from "./client-no-user-votes";
import { CommentTree } from "@/types/types";

interface CommentCollapseProps {
  comment: CommentTree;
  children: React.ReactNode;
}

export function CommentCollapse({ comment, children }: CommentCollapseProps) {
  const [opened, { toggle }] = useDisclosure(true);

  const supabase = createClientComponentClient(); // Create a Supabase client configured to use cookies
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser(supabase); // get user
      if (user) setUser(user);
    };

    getUser();
  }, [supabase]);

  if (comment)
    return (
      <div className=" border-l border-neutral-300 ">
        {/* <button className=" w-[2px] bg-neutral-500 hover:bg-neutral-950" onClick={} /> */}
        <div>
          <button
            onClick={toggle}
            className="w-full py-1 pl-3 hover:bg-neutral-200"
          >
            <CommentCollapseHeader comment={comment} />
          </button>

          <div>{/* <Button onClick={toggle}>Toggle content</Button> */}</div>
          <Collapse in={opened} className="pl-3">
            {comment.comment_content && (
              <div
                className="rich-text text-sm"
                dangerouslySetInnerHTML={{ __html: comment.comment_content }}
              />
            )}

            {user ? (
              <CommentVotes user={user} commentId={comment.comment_id!} />
            ) : (
              <ClientNoUserVotes Id={comment.comment_id!} type="comment" />
            )}

            <div className="mt-3">{children}</div>
          </Collapse>
        </div>
      </div>
    );
}

interface CommentHeaderProps {
  comment: CommentTree;
}

function CommentCollapseHeader({ comment }: CommentHeaderProps) {
  if (comment)
    return (
      <div className="flex justify-between">
        <div className="text-sm font-normal text-neutral-600 ">
          <div className="hidden md:inline">posted by&nbsp;</div>
          <span className=" font-semibold text-neutral-600">
            {comment.username}
          </span>
          &nbsp; &bull; &nbsp;
          <span className="hidden md:inline">
            {comment.created_at &&
              getTimeSinceNow({
                originalTime: comment.created_at,
                short: false,
              })}
          </span>
          <span className="md:hidden ">
            {comment.created_at &&
              getTimeSinceNow({
                originalTime: comment.created_at,
                short: true,
              })}
          </span>
        </div>
      </div>
    );
}
