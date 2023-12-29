import KanBoard from "@/components/KanBoard";
import { DragHelpers } from "@/lib/drag-helpers";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <DragHelpers>
        <KanBoard />
      </DragHelpers>
    </div>
  );
}
