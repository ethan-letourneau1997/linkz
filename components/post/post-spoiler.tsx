"use client";

import { Spoiler } from "@mantine/core";

export default function PostSpoiler({ content }) {
  return (
    <div>
      <Spoiler
        maxHeight={120}
        showLabel="Show more"
        hideLabel="Hide"
        transitionDuration={200}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Spoiler>
    </div>
  );
}
