import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-items-start gap-2 px-4 py-6 bg-white border-b border-gray ">
      <nav>
        <Link href={"/"}>
          <div className="flex justify-center items-center">
            <Image
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
              width={8}
              height={8}
            />{" "}
            <p className="font-semibold text-lg md:text-2xl">Workout</p>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
