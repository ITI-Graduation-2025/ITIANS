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
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-100">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
  <Image
    src="data:image/png;base64,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" // اختصري base64
    alt="ITI Logo"
    width={30}
    height={30}
  />
</div>


      {/* Center: Tabs */}
      <div className="flex space-x-4 items-center text-sm font-medium">
        {tabs.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-[#E30613]/10 text-[#E30613] font-semibold ring-1 ring-[#E30613]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#E30613]"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </div>

      {/* Right: Dropdown */}
      <Dropdowncom />
    </nav>
  );
}