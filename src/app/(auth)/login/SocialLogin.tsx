import { Button } from "@nextui-org/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import React from "react";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: "/members",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      <Button
        size="lg"
        fullWidth
        variant="bordered"
        onPress={() => onClick("google")}
      >
        <FaGoogle size={20} />
      </Button>

      <Button
        size="lg"
        fullWidth
        variant="bordered"
        onPress={() => onClick("github")}
      >
        <FaGithub size={20} />
      </Button>
    </div>
  );
}
