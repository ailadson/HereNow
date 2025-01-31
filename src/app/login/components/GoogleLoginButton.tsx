import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleLoginButton(
  { children }: { children: React.ReactNode }
) {
  return (
    <form>
      <Button
        variant="outline"
        className="w-full justify-start space-x-2"
      >
        <Image
          src="https://res.cloudinary.com/dkusewgnl/image/upload/v1711901397/Google_jaga1c.svg"
          alt="Google logo"
          width={20}
          height={20}
        />
        <span>{children}</span>
      </Button>
    </form>
  );
};