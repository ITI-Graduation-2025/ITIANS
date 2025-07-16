import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CommunityStats() {
  return (
    <div className="w-full sm:w-80  sm:p-6 space-y-4 sm:space-y-6 lg:overflow-hidden lg:col-span-2 md:w-full">
      <Card className="bg-[var(--card)] border-[var(--border)] ">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Community statistics
            </CardTitle>
            <Button
              variant="link"
              className="text-[var(--primary)] text-xs sm:text-sm p-0 mt-2 sm:mt-0"
            >
              See more {">"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[var(--primary)]">🚀</span>
              <span className="text-[var(--muted-foreground)]">
                Total mentoring time
              </span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              165 mins
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[var(--destructive)]">🎯</span>
              <span className="text-[var(--muted-foreground)]">
                Sessions completed
              </span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">5</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
            Available sessions
          </CardTitle>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Book 1:1 sessions from the options based on your needs
          </p>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg border-[var(--border)]">
            <div>
              <h4 className="font-medium text-sm sm:text-base text-[var(--foreground)]">
                Mentorship Session
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                30 minutes
              </p>
              <p className="text-xs sm:text-sm font-medium text-[var(--secondary)]">
                Free
              </p>
            </div>
            <Button className="mt-2 sm:mt-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm">
              Book
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg border-[var(--border)]">
            <div>
              <h4 className="font-medium flex items-center space-x-2 text-sm sm:text-base text-[var(--foreground)]">
                <span>Friendly Design Talk</span>
                <span className="w-2 h-2 bg-[var(--destructive)] rounded-full"></span>
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                30 minutes
              </p>
              <p className="text-xs sm:text-sm font-medium text-[var(--secondary)]">
                Free
              </p>
            </div>
            <Button className="mt-2 sm:mt-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm">
              Book
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Similar mentor profiles
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-[var(--foreground)] mt-2 sm:mt-0"
            >
              <span>{">"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src="https://picsum.photos/200/300"
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                Sina Salami
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Senior Frontend Engineer at Neoco...
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src="https://picsum.photos/200/300"
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                OMAR ELNABALA...
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Senior Product Designer at Master...
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src="https://picsum.photos/200/300"
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                Cassie Bjorc
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Graphic Designer Freelance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
