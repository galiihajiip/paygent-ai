import { Suspense } from "react";
import ChatWindow from "../../components/ChatWindow";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatWindow />
    </Suspense>
  );
}
