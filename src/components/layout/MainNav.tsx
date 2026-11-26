import { Link } from "react-router-dom";
import { areas } from "../../data/navigation";
export function MainNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {areas.map((i) => (
        <Link
          key={i.to}
          to={i.to}
          aria-current={i.match(pathname) ? "page" : undefined}
          onClick={onNavigate}
          className={
            "min-h-11 rounded-md border-b-2 px-3 py-2.5 text-[15px] font-medium whitespace-nowrap transition-colors " +
            (i.match(pathname)
              ? "border-gold text-gold"
              : "border-transparent text-on-dark hover:bg-white/10 active:bg-white/20")
          }
        >
          {i.label}
        </Link>
      ))}
    </>
  );
}
