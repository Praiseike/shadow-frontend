import Layout from './Layout';

const Security = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-xs">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
            Security Policy
          </h1>
          <p className="text-xs font-semibold text-slate-400 text-center mb-8">
            Last updated: May 31, 2026
          </p>

          <div className="text-slate-600 text-sm leading-relaxed space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Our Security Commitment</h2>
              <p>
                At PostNexus, we take the security of your data extremely seriously. We design our systems with security first in mind to ensure your accounts, credentials, and published content remain safe and secure.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. OAuth Connections</h2>
              <p>
                We connect to your social media accounts (such as LinkedIn) exclusively via secure OAuth 2.0 protocols. PostNexus never requests, sees, or stores your social media passwords. You can revoke access at any time directly through the respective social network's security settings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Data Encryption</h2>
              <p>
                All data transmitted to and from PostNexus is encrypted in transit using Transport Layer Security (TLS/HTTPS). Critical stored credentials (like OAuth access tokens) are encrypted at rest using industry-standard AES-256 encryption.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Third-Party Audits & Compliance</h2>
              <p>
                We regularly monitor and audit our infrastructure for security vulnerabilities. Our services run on secure, cloud-hosted enterprise infrastructure designed to maintain resilience and high availability.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Contact Our Security Team</h2>
              <p>
                If you discover or suspect a security vulnerability, please report it immediately to security@autopost.ai. We will investigate and respond to security disclosures promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Security;
