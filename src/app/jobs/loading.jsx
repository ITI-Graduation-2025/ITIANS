export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div
        className="relative inline-block font-bold text-4xl font-sans pb-2 text-[var(--primary)]
                   bg-gradient-to-r from-current to-current bg-[length:0%_3px] bg-no-repeat bg-bottom
                   animate-[l2_2s_linear_infinite]"
      >
        Loading Jobs...
      </div>
    </div>
  );
}
