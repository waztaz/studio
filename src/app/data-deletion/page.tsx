
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DataDeletionPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block bg-destructive/10 text-destructive p-4 rounded-full">
            <Trash2 size={48} />
        </div>
        <h1 className="text-4xl font-bold mt-4">Data Deletion Instructions</h1>
        <p className="text-muted-foreground mt-2">How to request the deletion of your account and data.</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <p>
          We respect your right to privacy and your control over your personal data. If you wish to delete your account and all associated data from waztaz, please follow the instructions below.
        </p>

        <h2 className="text-2xl font-semibold">How to Request Data Deletion</h2>
        <p>
          To initiate the data deletion process, you must send an email to our support team from the email address associated with your account.
        </p>
        <ol>
          <li>
            Compose a new email to <a href="mailto:razaadeel@hotmail.com" className="text-primary hover:underline">razaadeel@hotmail.com</a>.
          </li>
          <li>
            Use the subject line: <code className="bg-muted p-1 rounded-sm">Account Deletion Request</code>.
          </li>
          <li>
            In the body of the email, please state that you wish to delete your account. Including your username is helpful but not required.
          </li>
        </ol>

        <h2 className="text-2xl font-semibold">What Happens Next?</h2>
        <p>
          Once we receive your request, we will verify your identity and begin the deletion process. This includes deleting your user account, any posts you have created, and any images you have uploaded.
        </p>
        <p>
          Please note that this process is irreversible. Once your data is deleted, it cannot be recovered. The process will be completed within 30 days of your request.
        </p>
         <p>
            For more information, please review our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
