import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content: "PostNexus has transformed my LinkedIn presence. I went from posting once a week to consistent daily engagement with my audience.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The generated content is incredibly relevant to my field. It's like having a personal content strategist working 24/7.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer",
      company: "CloudTech",
      content: "Scheduling posts twice a day has increased my professional network by 300% in just 3 months. Game changer!",
      avatar: "ER"
    }
  ];

  const features = [
    {
      title: "Targeted Content Ideas",
      description: "Generates personalized, engaging content topics based on your specific expertise and selected target topics.",
      benefits: ["Context-aware prompts", "Industry-specific insights", "Formatting hooks"],
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Multi-Platform Automation",
      description: "Connect LinkedIn, Twitter, and Facebook accounts for seamless cross-platform content distribution.",
      benefits: ["Unified scheduling", "Platform-optimized layouts", "Performance metrics"],
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: "Smart Scheduling",
      description: "Post twice daily at optimal times based on your target audience's engagement patterns and time zones.",
      benefits: ["Peak engagement timing", "Automated queue", "Flexible schedule configuration"],
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individual developers starting out",
      features: [
        "1 Social Account Link",
        "AI Content Generation Support",
        "Basic Queue Scheduling",
        "Content History Analytics",
        "Standard Email Support"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing professionals and thought leaders",
      features: [
        "3 Social Account Links",
        "Advanced Content Suggestions",
        "Custom Automated Schedules",
        "Detailed Performance Analytics",
        "Priority Email Support",
        "Custom Topic Configurations"
      ],
      popular: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For agencies and tech teams",
      features: [
        "Unlimited Connected Accounts",
        "Premium Content Features",
        "Team Dashboard Access",
        "Advanced Analytics & Exports",
        "Dedicated Support",
        "Full API Access"
      ],
      popular: false,
      buttonText: "Get Started"
    }
  ];

  const faqs = [
    {
      question: "How does the AI content generation work?",
      answer: "Our engine analyzes your professional profile, selected topics, and industry trends to create personalized, engaging content suggestions. The tone is engineered to match professional guidelines while keeping things conversational and concise."
    },
    {
      question: "Can I customize the posting schedule?",
      answer: "Absolutely! You can choose specific days and post times, configure different platforms, and adjust how many times you post per day. The scheduler handles all timezone translations automatically."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, security is our primary focus. We use secure OAuth standard protocols to link your social accounts directly, meaning we never see or store your social platform passwords. All personal data is encrypted."
    },
    {
      question: "What platforms are supported?",
      answer: "We support LinkedIn and Twitter/X integrations out of the box, with Facebook page and group connections fully supported as well."
    },
    {
      question: "Can I edit posts before they go live?",
      answer: "Yes! Every generated post can be fully reviewed, edited, or saved as a draft. You retain complete control over your public presence."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left text column */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-6">
                ⚡ Automate Your Professional Brand
              </span>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl md:text-6xl leading-[1.1]">
                Automated Social Media on Autopilot
              </h1>
              <p className="mt-4 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
                Connect your platforms once. Let our scheduler distribute professional tech and development posts tailored to your exact topics. Watch your audience grow.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all duration-150"
                  >
                    Start Free Trial
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-all duration-150"
                  >
                    See How It Works
                  </a>
                </div>
                <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    Loved by 10,000+ developers
                  </span>
                </div>
              </div>
            </div>

            {/* Right graphic column */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div className="flex space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Post Preview
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      PN
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Your Name</h4>
                      <p className="text-xs text-slate-400">Software Architect</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-xl">
                    💡 **Quick Tip on Code Architecture:** Keep interfaces lean and single-purposed. It makes decoupling components 10x easier when scaling backend services. Focus on modularity early! 🛠️
                    <br /><br />
                    <span className="text-indigo-600">#SoftwareEngineering #CleanCode #Programming</span>
                  </p>

                  <div className="flex gap-2 justify-end">
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200">
                      ✓ Ready
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200">
                      📅 Scheduled: 9:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 border-t border-slate-200/80 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Everything You Need to Dominate
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Say goodbye to writer's block. Connect your socials, select your fields of interest, and let our system handle the queue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4">
              Community Review
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Loved by Thousands of Pros
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between"
              >
                <div className="flex mb-4 text-amber-400">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg key={starIndex} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role} at {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-50 border-t border-b border-slate-200/80 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4">
              Flexible Plans
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Upgrade or cancel at any time. No hidden setup fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white border rounded-2xl p-8 flex flex-col justify-between shadow-sm relative ${
                  plan.popular ? 'border-2 border-indigo-600 md:scale-[1.03]' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 text-sm ml-1">{plan.period}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8 border-t border-slate-100 pt-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.name === 'Starter' ? '/auth' : '/user/plans'}
                  className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4">
              Answers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${
                      activeFaq === i ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className="px-6 py-4 bg-white border-t border-slate-100 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to level up your professional presence?
              </h2>
              <p className="mt-4 text-indigo-100 max-w-xl mx-auto text-base sm:text-lg">
                Sign up in minutes. Connect your profiles. Let the automation engine handle the rest.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-indigo-600 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-lg shadow-sm transition-all"
                >
                  Get Started for Free
                </Link>
              </div>
            </div>
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-700/30 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;