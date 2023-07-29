"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Button, Modal } from "@supabase/ui";

const supabase = createClient(
  "https://cfbobhcjegwxkagzxyab.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYm9iaGNqZWd3eGthZ3p4eWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyMDYyNzYsImV4cCI6MjAwNDc4MjI3Nn0.Omlv4rO8UI9t65JmbqA5EfzfiWCUHCrOd1S3XZbtBrA",
);

export function Widget() {
  const [visible, setVisible] = useState(false);

  function toggle() {
    setVisible(!visible);
  }

  return (
    <>
      <Button onClick={toggle}>Open modal</Button>
      <Modal
        title="Title of modal"
        description="Description of modal"
        visible={visible}
        onCancel={toggle}
        onConfirm={toggle}
      >
        <Auth
          providers={["google"]}
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
        />
      </Modal>
    </>
  );
}
