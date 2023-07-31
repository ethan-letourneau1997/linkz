import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export async function ProfileHeader({
  username,
}: {
  username: string | undefined;
}) {
  return (
    <div className="-z-20 bg-neutral-800  py-10">
      <div className="mx-auto flex max-w-[700px] items-end gap-3 px-10 md:px-5">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className=" bg-teal-500">CN</AvatarFallback>
        </Avatar>
        <span className="h-fit text-2xl font-bold tracking-wide text-neutral-50">
          {username}
        </span>
      </div>
    </div>
  );
}
