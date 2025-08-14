import { BellIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientSideSuspense } from "@liveblocks/react";  
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Inbox = () => {
  return (
    <ClientSideSuspense fallback={
      <>
        <Button variant="ghost" disabled size="icon" className="relative">
          <BellIcon className="size-5" />
        </Button>
        <Separator orientation="vertical" className="h-full"/>
      </>
    }>
      <InboxMenu />
    </ClientSideSuspense>
  )
}

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { documentId } = useParams();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="size-5" />
            {inboxNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-sky-500 text-xs text-white flex items-center justify-center">
                {inboxNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {
            inboxNotifications.length > 0 ? (
              <InboxNotificationList>
                {
                  inboxNotifications.map((inboxNotification) => {
                    return (
                      <InboxNotification
                        key={inboxNotification.id}
                        inboxNotification={inboxNotification}
                      />
                    )
                  })
                }
              </InboxNotificationList>
            ) : (
              <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )
          }

        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="h-full"/>
    </>
  )
}

