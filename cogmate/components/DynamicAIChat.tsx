import dynamic from "next/dynamic";

const DynamicAIChat = dynamic(() => import("./AIChat"), { ssr: false });

export default DynamicAIChat;
