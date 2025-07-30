import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle } from "lucide-react";
import Dropdowncom from "@/components/ui/Dropdowncom"; 


const tabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Messages", href: "/messages", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm px-8 py-3 flex justify-between items-center border-b border-gray-100">
      
      <div className="flex items-center gap-8  ">
       
        <Image
          src="data:image/jpeg;base64,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"
          alt="ITI Logo"
          width={30}
          height={30}
        />

       <div className="flex space-x-7 items-center text-sm font-medium relative top-3">
          {tabs.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`whitespace-nowrap border-b-2 pb-2 flex items-center gap-1 transition-all duration-200 ${
                  isActive
                    ? "border-[#E30613] text-[#E30613] font-semibold"
                    : "border-transparent text-gray-500 hover:text-[#E30613] hover:border-[#E30613]"
                }`}
              >
                <Icon size={18} />
                {name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right side: Profile picture */}
      <Dropdowncom />
    </nav>
  );
}