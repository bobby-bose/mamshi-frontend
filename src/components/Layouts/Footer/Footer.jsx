import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const footerLinks = [
  {
    title: "Policies",
    links: [
      { name: "Terms & Conditions", redirect: "#terms" },
      { name: "Privacy Policy", redirect: "#privacy" },
      { name: "Refund & Return Policy", redirect: "#refund" },
      { name: "Shipping Policy", redirect: "#shipping" }
    ]
  }
];

const Footer = () => {
  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"))
  }, [location]);

  return (
    <>
      {!adminRoute && (
        <>
          {/* Main Footer Links */}
      

          {/* Policies Section - 2x2 Grid */}
          <div className="bg-gray-800 text-white p-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div id="terms">
                <h2 className="font-bold mb-2">Terms & Conditions</h2>
                <p>1. Introduction: Welcome to Slouch (“we,” “our,” or “us”). By accessing our website (slouch.netlify.app) and placing orders, you agree to these Terms & Conditions.</p>
                <p>2. Eligibility & Account Responsibility: You must be at least 18 years old or have parental/guardian consent to shop. You are responsible for maintaining account security and accuracy of details.</p>
                <p>3. Products & Pricing: Product descriptions and images aim to be accurate. Prices are in [your currency] and may change without notice.</p>
                <p>4. Ordering & Acceptance: Order confirmation is not binding. We may refuse or cancel orders for reasons like stock unavailability or system errors.</p>
                <p>5. Payment Terms: Payment via accepted methods only. Sensitive payment info is not stored on our servers.</p>
                <p>6. Shipping & Delivery: See shipping policy below.</p>
                <p>7. Returns & Refunds: See refund policy below.</p>
                <p>8. Intellectual Property: All site content—design, logos, images, text—is owned or licensed to us. Use only with permission.</p>
                <p>9. Limitation of Liability: We are not liable for indirect damages, except where prohibited by law.</p>
                <p>10. Governing Law: Laws of India govern these terms.</p>
                <p>11. Changes to Terms: We may update these terms at any time; notable changes will be highlighted when you next visit.</p>
              </div>

              <div id="privacy">
                <h2 className="font-bold mb-2">Privacy Policy</h2>
                <p>1. Introduction: Explains how we collect, use, and protect your data.</p>
                <p>2. What We Collect: Personal data (name, email, shipping/billing address, phone), automatic info (IP, browser, device, usage).</p>
                <p>3. Method of Collection: Account creation, orders, newsletter, support.</p>
                <p>4. How We Use Your Data: Process orders, updates, personalization, marketing (with consent), improvement.</p>
                <p>5. Data Sharing: With third parties like payment processors, shipping partners, analytics.</p>
                <p>6. Cookies & Tracking: To enhance experience; manage via browser settings.</p>
                <p>7. Data Retention: Keep personal info as long as needed for business/legal reasons.</p>
                <p>8. Your Rights: Access, correct, delete data; opt-out of marketing emails anytime.</p>
                <p>9. Security: Industry-standard measures used, but absolute security not guaranteed.</p>
                <p>10. Children’s Privacy: Not for users under 13; we don’t knowingly collect from children under 13.</p>
                <p>11. Changes: Significant changes communicated to users.</p>
              </div>

              {/* Row 2 */}
              <div id="refund">
                <h2 className="font-bold mb-2">Refund & Return Policy</h2>
                <p>1. Overview: Return unused, unworn items in original condition within 14 days for refund/store credit.</p>
                <p>2. Return Conditions: Items must include tags, original packaging, unworn/unwashed.</p>
                <p>3. How to Initiate a Return: Email <a href="mailto:support@slouch.netlify.app" className="underline">support@slouch.netlify.app</a> with order number and reason. Instructions/labels provided if applicable.</p>
                <p>4. Refund Process: Refund credited to original payment method within 5–7 business days; shipping fees non-refundable.</p>
              </div>

              <div id="shipping">
                <h2 className="font-bold mb-2">Shipping Policy</h2>
                <p>1. Processing Time: Orders processed in 1–2 business days (excluding weekends/holidays).</p>
                <p>2. Delivery Timeframe: Standard 3–7 business days.</p>
                <p>3. Shipping Rates: Calculated at checkout based on destination, weight, and service.</p>
                <p>4. Tracking: Provided via email once order ships.</p>
                <p>5. Lost/Stolen Packages: Contact us for investigation.</p>
                <p>6. Address Accuracy: Ensure accurate address; extra charges for incorrect addresses.</p>
                <p>Contact: <a href="mailto:bobbykboseoffice@gmail.com" className="underline">bobbykboseoffice@gmail.com</a>, Phone: 7012085349, Managed by Bobby K Bose</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
};

export default Footer;
