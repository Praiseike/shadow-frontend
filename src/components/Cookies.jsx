import Layout from './Layout';

const Cookies = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-xs">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
            Cookie Policy
          </h1>
          <p className="text-xs font-semibold text-slate-400 text-center mb-8">
            Last updated: May 31, 2026
          </p>

          <div className="text-slate-600 text-sm leading-relaxed space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you access websites. We use cookies to enable key features, track platform analytics, and personalize your overall experience.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Essential Cookies</h2>
              <p>
                These cookies are necessary for the website to function properly. We use them to keep you logged in to your account, secure your sessions, and store your preferences. You cannot disable these cookies in our system.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Analytics Cookies</h2>
              <p>
                We use analytics tools to collect information about how users interact with our platform. This helps us understand which pages are visited most often and identify areas for improvement. All analytical data is aggregated and anonymized.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Managing Your Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. If you choose to block all cookies, please note that parts of the PostNexus platform may not function correctly.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Questions and Contacts</h2>
              <p>
                If you have any questions or feedback about our use of cookies, please reach out to us at privacy@autopost.ai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
