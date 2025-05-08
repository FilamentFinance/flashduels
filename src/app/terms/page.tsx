import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use - Flash Duels',
  description: 'Terms and conditions for using Flash Duels platform',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Flash Duels (&quot;the Platform&quot;), you agree to be bound by
            these Terms of Use. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
          <p className="mb-4">
            You must be at least 18 years old to use the Platform. You confirm that you are not a
            resident, citizen, or entity located in the United States, United Kingdom, Mainland
            China, or any other restricted jurisdictions, and you are not subject to sanctions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Risk Disclosure</h2>
          <p className="mb-4">
            Trading digital assets and perpetual futures contracts involves significant risk. You
            should only trade with funds you can afford to lose. Past performance is not indicative
            of future results.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. No Financial Advice</h2>
          <p className="mb-4">
            The Platform does not provide financial, legal, or tax advice. All trading decisions are
            made at your own risk. You should consult with qualified professionals before making any
            financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Platform Rules</h2>
          <p className="mb-4">
            Users must comply with all applicable laws and regulations. The Platform reserves the
            right to suspend or terminate accounts that violate these terms or engage in fraudulent
            activities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            All content, features, and functionality of the Platform are owned by Flash Duels and
            are protected by international copyright, trademark, and other intellectual property
            laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="mb-4">
            Flash Duels shall not be liable for any direct, indirect, incidental, special,
            consequential, or exemplary damages resulting from your use of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Continued use of the Platform
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
          <p className="mb-4">
            For questions about these Terms of Use, please contact us through our official channels.
          </p>
        </section>
      </div>
    </div>
  );
}
