import { FAQS } from "../mockData/aboutFAQ";
const page = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2 text-balance">
            About <span className="italic text-primary">The Save Room</span>
          </h1>
        </section>
        {/* FAQS */}
        <section className="space-y-4">
          {FAQS.map((q, index) => (
            <div
              key={index}
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              {/* Radio input controls open state */}
              <input
                type="checkbox"
                // name="faq-accordion" // same name for all items
                defaultChecked={index === 0} // first one open by default
                className="peer"
              />
              <div className="collapse-title text-xl text-secondary font-semibold">
                {q.question}
              </div>
              <div className="collapse-content text-sm">{q.answer}</div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default page;
