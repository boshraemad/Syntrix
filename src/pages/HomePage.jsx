import React from 'react';

export default function HomePage() {

  const features = [
    { title: "Observability", desc: "Consolidate your logs, metrics, application traces, and system availability with purpose-built UIs." },
    { title: "Security", desc: "Prevent, collect, detect, and respond to threats for unified protection across your infrastructure." },
    { title: "Analytics", desc: "Explore, visualize, and analyze your data using a powerful suite of analytical tools and applications." }
  ];

  return (
      <div className='min-h-screen px-12.5 text-font p-8 bg-canvas'>
        <h1 className="text-3xl font-bold mb-12">Welcome home</h1>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-second/40 border border-white/10 rounded-2xl p-10 flex flex-col items-center text-center hover:bg-second/60 transition-all cursor-pointer group"
            >
              <div className="w-full h-40 bg-linear-to-b from-third/50 to-transparent rounded-xl mb-6 group-hover:from-third/70 transition-all"></div>
              <h2 className="text-xl font-bold mb-4">{feature.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <hr className="border-white/10 mb-16" />

        {/* Get Started Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get started by adding integrations</h2>
          <p className="text-gray-400 max-w-xl mb-10 leading-relaxed">
            To start working with your data, use one of our many ingest options. 
            Collect data from an app or service, or upload a file.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-white cursor-pointer text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
              <span className="text-xl">+</span> Add integration
            </button>
            <button className="flex items-center cursor-pointer gap-2 text-white font-semibold hover:text-third transition-all">Try sample data</button>
            <button className="flex items-center gap-2 cursor-pointer text-white font-semibold hover:text-third transition-all">Upload a file</button>
          </div>
        </div>
      </div>

  );
}