import { fetchUser } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function RenderImage() {
  const supabase = createServerComponentClient({ cookies });

  const user = await fetchUser(supabase); // get user

  let imageUrl;

  if (user) {
    const { data: user_image } = await supabase
      .from("user_image")
      .select("*")
      .match({ user_id: user.id })
      .limit(1)
      .single();

    const imagePath = user_image.image_path;

    const { data } = supabase.storage.from("Images").getPublicUrl(imagePath);
    imageUrl = data.publicUrl;
  }

  return (
    <div className="p-3 ">
      <img
        className="h-auto max-w-full"
        alt="image description"
        src={imageUrl}
      />
    </div>
  );
}
