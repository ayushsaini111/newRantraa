export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-s64">
      {/* Search */}
      <div className="h-16 w-full rounded-r24 bg-gray-200 animate-pulse" />

      {/* Filters */}
      <div className="mt-s32 flex flex-wrap gap-s16">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-11 w-28 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
      </div>

      {/* Cards */}
      <div
        className="
          mt-s40
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-s32
        "
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <article
            key={index}
            className="
              rounded-r32
              border
              border-black/5
              bg-white
              p-s24
              shadow-sm
            "
          >
            {/* Buttons */}
            <div className="flex justify-between">
              <div className="h-8 w-20 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
            </div>

            {/* Title */}
            <div className="mt-s24 h-7 w-3/4 rounded bg-gray-200 animate-pulse" />

            {/* Image */}
            <div className="mt-s24 h-[190px] rounded-r24 bg-gray-200 animate-pulse" />

            {/* Subtitle */}
            <div className="mt-s24 h-5 w-4/5 rounded bg-gray-200 animate-pulse" />

            {/* Description */}
            <div className="mt-s16 space-y-3">
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}