// "use client";
// import { useState } from "react";
// import { Select } from "@mantine/core";
// import { UserPosts } from "../sections/user-posts";

// export default function SortPosts(userProfile) {
//   const [value, setValue] = useState<string | null>("date");
//   console.log(value);

//   return (
//     <div>
//       <p>hello sort posts.</p>
//       <Select value={value} onChange={setValue} data={["date", "votes"]} />
//       {value === "date" ? <UserPosts userProfile={userProfile} /> : null}
//     </div>
//   );
// }
