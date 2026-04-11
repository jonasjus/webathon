import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getMessagesPageData } from "@/lib/messages";
import { MessagesWorkspace } from "./_components/messages-workspace";

interface MessagesPageProps {
  searchParams: Promise<{
    activityId?: string | string[];
  }>;
}

function getRequestedActivityId(
  searchParams: Awaited<MessagesPageProps["searchParams"]>
) {
  const activityId = searchParams.activityId;
  return typeof activityId === "string" ? activityId : undefined;
}

export default async function MessagesPage(props: MessagesPageProps) {
  const searchParams = await props.searchParams;
  const data = await getMessagesPageData(getRequestedActivityId(searchParams));

  if (!data) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Du må være logget inn for å se meldingene dine."
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-(--canvas) px-4 py-6 sm:px-6 xl:h-screen xl:overflow-hidden xl:p-0">
      <div className="mx-auto grid max-w-360 gap-6 xl:h-full xl:min-h-0 xl:max-w-none xl:gap-0 xl:grid-cols-[225px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-0 xl:h-screen xl:min-h-0">
          <Sidebar activeItem="Meldinger" user={data.sidebarUser} />
        </div>

        <div className="xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:px-8 xl:py-6">
          <MessagesWorkspace
            currentUser={data.sidebarUser}
            currentUserId={data.currentUserId}
            initialSummaries={data.summaries}
            initialMessagesByActivityId={data.messagesByActivityId}
            initialSelectedActivityId={data.selectedActivityId}
            initialSelectionNotice={data.selectionNotice}
          />
        </div>
      </div>
    </main>
  );
}
