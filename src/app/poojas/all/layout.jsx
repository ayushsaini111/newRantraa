import SearchBar from "@/components/all-poojas/SearchBar";

export default function AllPoojasLayout({ children }) {
  return (
    <section className="py-s64 lg:py-s104">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="caption uppercase tracking-[3px] text-primary-main font-semibold">
            Sacred Rituals
          </span>

          <h1 className="heading-h1 text-main mt-s16">
            Explore All Poojas
          </h1>

          <p className="body-large text-secondary mt-s16">
            Find the perfect Vedic ritual for prosperity, health, career,
            marriage, peace, and spiritual growth.
          </p>
        </div>

    

        <div className="mt-s64">
          {children}
        </div>
      </div>
    </section>
  );
}