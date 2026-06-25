import React from 'react';
import { useAuth } from '@/context/AuthContext';
import chartImage from "../assets/Chart.png";
import observabilityImage from "../assets/observability_icon.png";
import securityImage from "../assets/Security_Shield.png";
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
const {accessToken} = useAuth();
const navigate = useNavigate();
console.log(accessToken);
  const features = [
    {
      title: "Observability",
      description: "Consolidate your logs, metrics, application traces, and system availability with purpose-built UIs.",
      // استبدل الرابط بمسار الصورة المحلي لديك
      image: chartImage, 
      path: "/discover",
      gradient: "from-blue-900/40 to-purple-900/20"
    },
    {
      title: "Security",
      description: "Prevent, collect, detect, and respond to threats for unified protection across your infrastructure.",
      image: securityImage,
      path: "/security", // أو مسار صفحة الحماية
      gradient: "from-blue-900/40 to-indigo-900/20"
    },
    {
      title: "Analytics",
      description: "Explore, visualize, and analyze your data using a powerful suite of analytical tools and applications.",
      image: observabilityImage,
      path: "/analytics",
      gradient: "from-blue-900/40 to-blue-800/20"
    }
  ];

  return (
      <div className='min-h-screen px-12.5 text-font p-8 bg-canvas'>
        <h1 className="text-3xl font-bold mb-12">Welcome home</h1>

        {/* Three Cards */}
      {/* حاوية البطاقات المستوحاة من AppRouter structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            onClick={() => navigate(feature.path)}
            className={`group relative overflow-hidden bg-gradient-to-br ${feature.gradient} 
                        border border-gray-800 rounded-3xl p-10 flex flex-col items-center 
                        text-center hover:border-blue-500/50 transition-all duration-300 
                        cursor-pointer hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]`}
          >
            {/* Image Section بدلاً من الايكونز */}
            <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-5 group-hover:text-blue-400 transition-colors">
              {feature.title}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-base leading-relaxed font-light px-2">
              {feature.description}
            </p>
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