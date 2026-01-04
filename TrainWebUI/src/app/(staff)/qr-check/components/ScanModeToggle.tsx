import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Keyboard, Pause, Play } from "lucide-react";

interface ScanModeToggleProps {
  mode: "scan" | "manual";
  onModeChange: (mode: "scan" | "manual") => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function ScanModeToggle({ mode, onModeChange, isPaused, onTogglePause }: ScanModeToggleProps) {
  return (
    <Card className="p-4 border bg-primary text-primary-foreground">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant={mode === "scan" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onModeChange("scan")}
            className={mode === "scan" ? "bg-background text-primary" : "text-primary-foreground hover:bg-background/20"}
          >
            <Camera className="h-4 w-4 mr-2" />
            Quét QR
          </Button>
          <Button
            variant={mode === "manual" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onModeChange("manual")}
            className={mode === "manual" ? "bg-background text-primary" : "text-primary-foreground hover:bg-background/20"}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Nhập tay
          </Button>
        </div>
        
        {mode === "scan" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePause}
            className="text-primary-foreground hover:bg-background/20"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Tiếp tục
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Tạm dừng
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
