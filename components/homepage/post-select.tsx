"use client";

import { useState } from "react";

import { Select } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function PostSelect() {
  const [value, setValue] = useState<string | null>("new");
  const router = useRouter();

  function sortPosts() {
    router.push(`/home/${value}`);
  }

  return (
    <Select
      className="w-32"
      variant="unstyled"
      onSearchChange={sortPosts}
      value={value}
      onChange={setValue}
      placeholder="Pick one"
      data={[
        { value: "new", label: "New" },
        { value: "top", label: "Top" },
        { value: "trending", label: "Trending" },
      ]}
    />
  );
}
