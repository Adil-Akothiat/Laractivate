import { ScrollContainer } from "../../../../components/ScrollContainer";
import type { NotificationProps } from "../types/index";
import { NotificationItem } from "./NotificationItem";

type Props = {
  notifications?: NotificationProps[];
};

export function NotificationsList({ notifications }: Props) {
  return (
    <>
      {notifications?.length === 0 && (
        <li>
          <div className="flex flex-col items-center py-8 gap-2 text-base-content/30 cursor-default">
            <span className="text-3xl">🎉</span>
            <p className="text-xs font-medium">
              You're all caught up!
            </p>
          </div>
        </li>
      )}
      <ScrollContainer
        childrenClassName="gap-0"
      >

      {notifications?.map((notif) => (
        <NotificationItem
        key={notif.id}
        notif={notif}
        />
      ))}
      </ScrollContainer>
    </>
  );
}