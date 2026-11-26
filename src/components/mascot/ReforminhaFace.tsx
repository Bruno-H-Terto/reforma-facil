/** The site's existing isolated, winking face artwork. No clipped full-body image. */
export function ReforminhaFace({
  size = "large",
}: {
  size?: "small" | "large";
}) {
  return (
    <span
      role="img"
      aria-label="Reforminha sorrindo"
      className={
        "relative inline-flex shrink-0 items-center justify-center " +
        (size === "large" ? "size-20" : "size-12")
      }
    >
      <img
        src="/images/mascot/chat-avatar.webp"
        alt=""
        width={240}
        height={240}
        className="size-full object-contain"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 28"
        fill="none"
        className="absolute -right-2 top-1 size-7 text-gold"
      >
        <path
          d="M4 9 10 3M12 13 21 10M10 21 17 26"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
