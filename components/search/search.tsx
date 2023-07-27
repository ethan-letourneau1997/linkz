"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Database } from "@/types/supabase";
import Link from "next/link";

type Community = Database["public"]["Views"]["community_sub_count"]["Row"];

export function Search() {
  const supabase = createClientComponentClient(); // Create a Supabase client
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Community[]>([]);
  const [visible, setVisible] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const getResults = async () => {
      const { data, error } = await supabase
        .from("community_sub_count")
        .select()
        .ilike("community_name", `%${searchQuery}%`)
        .limit(5);
      if (error) {
        console.log(error);
      }
      if (data) {
        setSearchResults(data);
      }
    };

    getResults();
  }, [searchQuery]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleInputBlur = () => {
    // Add a delay of 300ms before hiding results
    blurTimeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  const handleInputFocusBlur = () => {
    // Clear the timeout if it exists, preventing the onBlur event from firing
    clearTimeout(blurTimeoutRef.current);
  };

  return (
    <div className="flex ">
      <div className="relative w-full">
        <div className="flex">
          <input
            onChange={handleQueryChange}
            value={searchQuery}
            className=" h-9 w-full rounded-sm border-0"
            onFocus={() => setVisible(true)} // Show results when input is selected
            //   onBlur={() => setVisible(false)} // Hide results when input loses focus
            onBlur={handleInputBlur}
            onMouseDown={handleInputFocusBlur}
            onTouchStart={handleInputFocusBlur}
          />
        </div>
        <div
          className={`absolute left-0 right-0 mt-1 ${
            visible && searchResults.length > 0 ? "block" : "hidden"
          }  border bg-neutral-50 `}
        >
          {searchResults.map((result) => (
            <div
              className="px-4 py-3 hover:bg-neutral-200"
              key={result.community_id}
            >
              <Link
                className="hover:bg-neutral-200 "
                href={`/community/${result.community_name}`}
              >
                <div className="">{result.community_name}</div>
                <div className=" text-xs text-neutral-400">
                  {result.total_subscribers}&nbsp;sub
                  {result.total_subscribers && result.total_subscribers > 1
                    ? "s"
                    : ""}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
