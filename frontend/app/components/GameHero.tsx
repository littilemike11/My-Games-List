import Link from "next/link";

const GameHero: React.FC<{
  bgImage: string;
  heading: React.ReactNode | string;
  subHeading: string;
  CTA?: boolean;
}> = ({ bgImage, heading, subHeading, CTA = true }) => {
  return (
    <>
      {CTA ? (
        <div
          className="hero h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh]"
          style={{
            backgroundImage: `url(${bgImage})`,
            objectFit: "cover",
            overflow: "hidden",
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2 text-balance">
                {heading}
              </h1>
              <p className="mb-5 text-sm sm:text-lg drop-shadow">
                {subHeading}
              </p>
              <Link href={"/auth/sign-up"} className="btn w-fit btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] overflow-hidden rounded-2xl  bg-base-200">
          {/* Background image */}
          <img
            src={bgImage}
            alt={`artwork`}
            className="absolute inset-0 w-full h-full "
            // object-center object-cover scale-110 sm:scale-105 transition-all
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b 
                  from-black/10 via-black/60 to-base-100/95 sm:to-base-100/70"
          />

          {/* Foreground text */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-8 lg:p-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md line-clamp-2 text-balance">
              {/* Welcome to <span className="italic">The Save Room</span> */}
              {heading}
            </h1>
            <p className=" text-sm sm:text-lg drop-shadow">{subHeading} </p>

            {/* <Link href={"/auth/sign-up"} className="btn w-fit btn-primary">
              Get Started
            </Link> */}
          </div>
        </div>
      )}
    </>
  );
};
export default GameHero;
