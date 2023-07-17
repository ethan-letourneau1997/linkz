import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function RenderImage() {
  const supabase = createServerComponentClient({ cookies });

  console.log(supabase.storage);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let imageUrl;

  if (user) {
    let { data: user_image } = await supabase
      .from("user_image")
      .select("*")
      .match({ user_id: user.id })
      .limit(1)
      .single();
    if (user_image) console.log(user_image.image_path);
    const imagePath = user_image.image_path;
    console.log(imagePath);

    const { data } = supabase.storage.from("Images").getPublicUrl(imagePath);
    imageUrl = data.publicUrl;

    console.log(data.publicUrl);
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
