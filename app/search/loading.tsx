export default function SearchLoading() {
  return (
    <div className="container-page pt-10 sm:pt-14" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading search results…</p>
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="mx-auto h-11 w-72 rounded bg-paper-3" />
        <div className="mt-7 h-14 rounded-full bg-paper-3" />
        <div className="mt-12 space-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 border-b border-line pb-7">
              <div className="h-3 w-28 rounded bg-paper-3" />
              <div className="h-6 w-4/5 rounded bg-paper-3" />
              <div className="h-4 w-full rounded bg-paper-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
