import { TopNav } from "@/components/top-nav";
import CanvasContainer from "@/components/canvas";
import { RightSidebar } from "@/components/right-sidebar";
import { ProjectProvider } from "@/components/project-provider";
import { AutoLoader } from "@/components/auto-loader";

export default function Home() {
  return (
    <ProjectProvider>
      <AutoLoader />
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-neo-cream">
        {/* Top Navigation — always visible */}
        <TopNav />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar — tabbed: Components | AI Chat */}
          <RightSidebar />

          {/* Center — canvas workspace (fills remaining space) */}
          <CanvasContainer />
        </div>
      </div>
    </ProjectProvider>
  );
}
