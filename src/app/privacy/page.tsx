
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 text-primary p-4 rounded-full">
            <Shield size={48} />
        </div>
        <h1 className="text-4xl font-bold mt-4">Privacy Policy for waztaz</h1>
        <p className="text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p>
          Welcome to waztaz. This Privacy Policy explains how we collect, use, and disclose information about you when you use our website.
        </p>

        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, and information we get when you use our services.
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you sign up for an account, we collect your email address and password. If you sign in with Facebook, we collect your name, email address, and profile picture as provided by Facebook. This information is used solely to create and manage your account.
          </li>
          <li>
            <strong>Content You Create:</strong> We collect the content you create, such as blog posts and images you upload.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services;</li>
          <li>Authenticate users and allow access to our services;</li>
          <li>Personalize your experience by displaying your username with your posts;</li>
          <li>Protect the security of our users and our platform.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Data Storage and Third-Party Services</h2>
        <p>
          Your data is stored securely using Google Firebase services. By using our website, you agree to the privacy policies of our service providers:
        </p>
        <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Firebase Privacy Policy</a></li>
            <li><a href="https://www.facebook.com/about/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Privacy Policy</a></li>
        </ul>
        
        <h2 className="text-2xl font-semibold">4. Your Rights and Data Deletion</h2>
        <p>
          You have the right to request the deletion of your personal data. For instructions on how to do this, please see our{' '}
          <Link href="/data-deletion" className="text-primary hover:underline">Data Deletion Instructions</Link> page.
        </p>

        <h2 className="text-2xl font-semibold">5. Changes to This Policy</h2>
        <p>
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the "Last Updated" date at the top of the policy.
        </p>

        <h2 className="text-2xl font-semibold">6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:razaadeel@hotmail.com" className="text-primary hover:underline">razaadeel@hotmail.com</a>.
        </p>
      </div>
    </div>
  );
}
