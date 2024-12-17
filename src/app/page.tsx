import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>Hello from App</div>
      <Button as={Link} href="/members" color="primary">
        NextUi
      </Button>
    </>
  );
}
