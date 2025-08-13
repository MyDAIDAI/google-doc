import { BellIcon } from "lucide-react";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";  
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";

export const Inbox = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <InboxMenu />
    </ClientSideSuspense>
  )
}

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { documentId } = useParams();

  console.log('inboxNotifications', inboxNotifications);
  

  return (
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
  )
}

