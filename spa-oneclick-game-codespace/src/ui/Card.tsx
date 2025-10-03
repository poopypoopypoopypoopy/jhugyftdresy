
import { cn } from "../util/cn";
type Props = React.HTMLAttributes<HTMLDivElement>;
export function Card({ className, ...props }: Props) {
  return <div className={cn("rounded-2xl border bg-white shadow-sm", className)} {...props} />;
}
