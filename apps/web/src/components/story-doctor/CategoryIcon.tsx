import type { ComponentType, SVGProps } from "react";
import {
  GroupDiscussionMeetingx3,
  Health,
  HeartCardiogram,
  Info,
  MentalHealth,
  People,
  QuestionCircle,
  Wheelchair,
} from "healthicons-react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type CategoryIconProps = {
  iconKey: string;
  className?: string;
};

const ICON_BY_KEY: Record<string, IconComponent> = {
  "heart-pulse": HeartCardiogram,
  health: HeartCardiogram,
  "heart-cardiogram": HeartCardiogram,
  users: People,
  people: People,
  family: GroupDiscussionMeetingx3,
  group: GroupDiscussionMeetingx3,
  "group-discussion": GroupDiscussionMeetingx3,
  accessibility: Wheelchair,
  disability: Wheelchair,
  wheelchair: Wheelchair,
  info: Info,
  information: Info,
  brain: MentalHealth,
  mental: MentalHealth,
  "mental-health": MentalHealth,
  neurology: MentalHealth,
  lifebuoy: QuestionCircle,
  help: QuestionCircle,
  support: QuestionCircle,
  question: QuestionCircle,
};

const TONE_BY_KEY: Record<string, string> = {
  "heart-pulse": "bg-red-100 text-red-600",
  health: "bg-red-100 text-red-600",
  "heart-cardiogram": "bg-red-100 text-red-600",
  users: "bg-emerald-100 text-emerald-700",
  people: "bg-emerald-100 text-emerald-700",
  family: "bg-emerald-100 text-emerald-700",
  group: "bg-emerald-100 text-emerald-700",
  "group-discussion": "bg-emerald-100 text-emerald-700",
  accessibility: "bg-violet-100 text-violet-700",
  disability: "bg-violet-100 text-violet-700",
  wheelchair: "bg-violet-100 text-violet-700",
  info: "bg-amber-100 text-amber-600",
  information: "bg-amber-100 text-amber-600",
  brain: "bg-orange-100 text-orange-600",
  mental: "bg-orange-100 text-orange-600",
  "mental-health": "bg-orange-100 text-orange-600",
  neurology: "bg-orange-100 text-orange-600",
  lifebuoy: "bg-blue-100 text-blue-600",
  help: "bg-blue-100 text-blue-600",
  support: "bg-blue-100 text-blue-600",
  question: "bg-blue-100 text-blue-600",
};

function normalizeIconKey(iconKey: string) {
  return iconKey.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

export default function CategoryIcon({ iconKey, className }: CategoryIconProps) {
  const key = normalizeIconKey(iconKey);
  const Icon = ICON_BY_KEY[key] ?? Health;
  const tone = TONE_BY_KEY[key] ?? "bg-cyan-100 text-cyan-700";

  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white shadow-sm",
        tone,
        className,
      )}
      title={iconKey}
    >
      <Icon aria-hidden width={24} height={24} />
    </span>
  );
}
