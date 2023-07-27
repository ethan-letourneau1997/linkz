import { User } from "@supabase/supabase-js";

async function formatDate(date: string) {
  if (date) {
    const createdAt = new Date(date);
    const formattedDate = createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  }
}

export async function UserDetails({
  user,
  username,
}: {
  user: User;
  username: string | undefined;
}) {
  if (username)
    return (
      <div className="bg-neutral-50 pb-4 pt-3 text-sm shadow-sm sm:text-base">
        <h2 className="px-4 text-lg font-medium sm:text-xl">
          Profile Information
        </h2>

        <div className="mt-4 flex justify-between gap-3 px-4">
          <span className="font-medium text-neutral-600">Username:</span>
          <span className="text-neutral-600">{username}</span>
        </div>
        <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
        <div className="flex justify-between gap-3 px-4">
          <span className="min-w-fit font-medium text-neutral-600">
            User Since:
          </span>
          <span className="text-neutral-600">
            {formatDate(user.created_at)}
          </span>
        </div>
        <hr className="my-4 h-[.25px] border-t-0 bg-neutral-400 py-[.25px] opacity-100 dark:opacity-50" />
        <div className="flex justify-between gap-3 px-4">
          <span className="font-medium text-neutral-600">Email:</span>
          <span className="text-neutral-600">{user?.email}</span>
        </div>
      </div>
    );
}
