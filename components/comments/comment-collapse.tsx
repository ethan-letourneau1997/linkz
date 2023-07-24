"use client";

import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "../ui/button";
import { getTimeSinceNow } from "@/lib/time_since";
import { Suspense, useEffect, useState } from "react";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { fetchUser } from "@/lib/utils";
import { CommentVotes } from "./comment-vote";

interface CommentCollapseProps {
  comment: any;
  children: any;
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
          <div
            className="rich-text text-sm"
            dangerouslySetInnerHTML={{ __html: comment.comment_content }}
          />

          <CommentVotes commentId={comment.id} userId={user ? user.id : null} />

          <div className="mt-3">{children}</div>
        </Collapse>
      </div>
    </div>
  );
}

interface CommentHeaderProps {
  comment: any;
}

function CommentCollapseHeader({ comment }: CommentHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="text-sm font-normal text-neutral-600 ">
        <div className="hidden md:inline">posted by&nbsp;</div>
        <span className=" font-semibold text-neutral-600">
          {comment.commenting_user_id.username}
        </span>
        &nbsp; &bull; &nbsp;
        <span className="hidden md:inline">
          {getTimeSinceNow({
            originalTime: comment.created_at,
            short: false,
          })}
        </span>
        <span className="md:hidden ">
          {getTimeSinceNow({
            originalTime: comment.created_at,
            short: true,
          })}
        </span>
      </div>
    </div>
  );
}
