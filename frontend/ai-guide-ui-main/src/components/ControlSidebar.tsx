import FileUploadZone from "./FileUploadZone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ControlSidebarProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  // ✅ ADDED THESE TWO PROPS
  qtype: string;
  onQtypeChange: (qtype: string) => void;
  onGenerate: () => void;
  loading: boolean;
  locked: boolean;
}

const units = [
  { value: "Unit I", label: "Unit I" },
  { value: "Unit II", label: "Unit II" },
  { value: "Unit III", label: "Unit III" },
  { value: "Unit IV", label: "Unit IV" },
  { value: "Unit V", label: "Unit V" },
];

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

// ✅ ADDED QUESTION TYPES
const questionTypes = [
  { value: "viva", label: "Viva Questions" },
  { value: "assignment", label: "Assignment" },
  { value: "practical", label: "Practical/Lab" },
];

const ControlSidebar = ({
  file,
  onFileChange,
  unit,
  onUnitChange,
  difficulty,
  onDifficultyChange,
  qtype,
  onQtypeChange,
  onGenerate,
  loading,
  locked,
}: ControlSidebarProps) => {
  // ✅ Updated validation to include qtype
  const canGenerate = file && unit && difficulty && qtype;

  return (
    <aside
      className={`flex h-screen w-[320px] shrink-0 flex-col border-r border-border bg-card transition-opacity duration-200 ${
        locked ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          AI Tutor Assistant
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Generate your study guide.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Syllabus
          </label>
          <FileUploadZone file={file} onFileChange={onFileChange} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Unit
          </label>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ NEW SECTION: QUESTION TYPE */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Question Type
          </label>
          <Select value={qtype} onValueChange={onQtypeChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {unit && difficulty && qtype && (
          <p className="text-xs text-muted-foreground italic">
            Ready to generate {qtype} for {unit} ({difficulty}).
          </p>
        )}
      </div>

      <div className="border-t border-border px-6 py-4">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Study Set"
          )}
        </Button>
      </div>
    </aside>
  );
};

export default ControlSidebar;
