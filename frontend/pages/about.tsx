// @ts-ignore
import type { NextPage } from 'next';
// @ts-ignore
import Image from 'next/image';
// @ts-ignore
import Link from 'next/link';

const About: NextPage = () => {
  return (
    <>
      <section className="bg-sakura-pink bg-opacity-20 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 font-noto-serif text-indigo-blue">Understanding Ikigai</h1>
          <p className="text-xl mb-0 text-sumi-black">The Japanese Secret to a Meaningful Life</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">What is Ikigai?</h2>
              <p className="mb-4 text-lg">
                Ikigai (生き甲斐) is a Japanese concept that means "a reason for being." It is the intersection of what you love, what you are good at, what the world needs, and what you can be paid for.
              </p>
              <p className="mb-4 text-lg">
                The term is composed of two Japanese words: "iki" (生き), which means "life," and "gai" (甲斐), which means "value" or "worth." Together, these words describe the source of value in one's life or the things that make one's life worthwhile.
              </p>
              
              <div className="relative w-full h-64 my-8 rounded-lg overflow-hidden">
                <Image 
                  src="/images/ikigai-diagram.png" 
                  alt="Ikigai Diagram"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">The Four Elements of Ikigai</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-sakura-pink bg-opacity-20 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 font-noto-serif text-sakura-pink">Passion</h3>
                  <p className="text-gray-800">
                    <strong>What you love</strong> - Activities and subjects that bring you joy, that you could do for hours without noticing the time passing.
                  </p>
                </div>
                
                <div className="bg-bamboo-green bg-opacity-20 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 font-noto-serif text-bamboo-green">Mission</h3>
                  <p className="text-gray-800">
                    <strong>What the world needs</strong> - How your interests and skills can serve others and contribute to society in meaningful ways.
                  </p>
                </div>
                
                <div className="bg-indigo-blue bg-opacity-20 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 font-noto-serif text-indigo-blue">Vocation</h3>
                  <p className="text-gray-800">
                    <strong>What you are good at</strong> - Your natural talents and acquired skills that you excel at and can develop to a high level.
                  </p>
                </div>
                
                <div className="bg-accent-gold bg-opacity-20 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 font-noto-serif text-accent-gold">Profession</h3>
                  <p className="text-gray-800">
                    <strong>What you can be paid for</strong> - How your skills and passions can be applied in ways that provide financial stability.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">Finding Your Ikigai</h2>
              <p className="mb-4 text-lg">
                Discovering your ikigai is a journey of self-reflection and exploration. It requires honest assessment of your strengths, passions, and values, as well as consideration of how these can align with the needs of the world and opportunities for livelihood.
              </p>
              <p className="mb-4 text-lg">
                The Ikigai Pathway application guides you through this process, helping you explore each of the four elements and discover where they intersect in your unique life circumstances.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">Ikigai and Well-being</h2>
              <p className="mb-4 text-lg">
                Research has shown that having a sense of purpose—an ikigai—is associated with greater happiness, better health, and even longevity. In Okinawa, Japan, which is known for its high concentration of centenarians, many elderly people attribute their long and fulfilling lives to having a clear ikigai.
              </p>
              <p className="mb-4 text-lg">
                By finding and living your ikigai, you can experience:
              </p>
              <ul className="list-disc pl-6 mb-4 text-lg space-y-2">
                <li>Greater satisfaction and fulfillment in your work</li>
                <li>More meaningful connections with others</li>
                <li>A sense of contribution to something larger than yourself</li>
                <li>Increased resilience in the face of challenges</li>
                <li>A clearer sense of direction and purpose</li>
              </ul>
            </div>
            
            <div className="bg-sakura-pink bg-opacity-20 p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold mb-4 font-noto-serif text-indigo-blue">Ready to Discover Your Ikigai?</h2>
              <p className="mb-6 text-lg">
                Begin your journey of self-discovery and purpose-finding with our guided process.
              </p>
              <Link href="/" className="btn btn-primary inline-block">
                Begin Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
