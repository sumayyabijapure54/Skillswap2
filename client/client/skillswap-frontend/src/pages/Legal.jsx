import React from 'react';

const TABS = [
  {
    key: 'terms', label: 'Terms of Service',
    body: [
      ['Using SkillSwap', "By creating an account or browsing free content on SkillSwap, you agree to use the platform respectfully — no harassment, spam, or misrepresenting your skills or credentials to other members."],
      ['Booking sessions', 'When you book a paid mentorship session, you\'re entering an agreement directly with that mentor. SkillSwap facilitates scheduling and payment but is not a party to the teaching itself.'],
      ['Account responsibility', 'You\'re responsible for the security of your account and for any activity that happens under it. Let us know immediately if you suspect unauthorized access.'],
      ['Termination', 'We may suspend or close accounts that violate these terms, including repeated no-shows, abusive behavior, or fraudulent listings.']
    ]
  },
  {
    key: 'privacy', label: 'Privacy Policy',
    body: [
      ['What we collect', 'Basic account details (name, email, profile info), learning activity (progress, completed lessons), and session/payment metadata needed to run the marketplace.'],
      ['How we use it', 'To personalize recommendations, match you with mentors, process payments, and improve the product. We do not sell personal data to third parties.'],
      ['Your controls', 'You can export or delete your data at any time from Account Settings. Deleting your account removes your public profile and personal information from active systems.'],
      ['Third parties', 'We use trusted processors for payments and video hosting; they only receive the minimum data required to perform their function.']
    ]
  },
  {
    key: 'cookies', label: 'Cookie Policy',
    body: [
      ['Essential cookies', 'Used to keep you logged in and remember basic preferences like dark mode. These can\'t be disabled without breaking core functionality.'],
      ['Analytics cookies', 'Help us understand which pages and features are actually used, so we can prioritize what to improve next. You can opt out in Account Settings.'],
      ['No ad tracking', 'SkillSwap does not use third-party advertising cookies or sell browsing behavior to ad networks.']
    ]
  },
  {
    key: 'refunds', label: 'Refund Policy',
    body: [
      ['Cancellation window', 'Sessions cancelled more than 24 hours in advance are fully refunded to your original payment method or wallet balance.'],
      ['Late cancellations', 'Cancellations inside the 24-hour window are refunded at 50%, since mentors reserve that time exclusively for you.'],
      ['Mentor no-shows', 'If a mentor doesn\'t show up for a confirmed session, you\'re refunded in full automatically, no request needed.'],
      ['Disputes', 'If a session didn\'t match its description, contact Support within 7 days and we\'ll review the case manually.']
    ]
  }
];

export default function Legal(){
  const [active, setActive] = React.useState('terms');
  const current = TABS.find(t=>t.key===active);

  return (
    <div className="legal-wrap">
      <div className="page-header" style={{padding:'150px 0 40px'}}>
        <div className="eyebrow">Legal</div>
        <h1>Terms, Privacy <span className="g">&amp; Policies</span></h1>
        <p>Everything governing your use of SkillSwap, consolidated in one place.</p>
      </div>

      <div className="legal-tabs">
        {TABS.map(t=>(
          <button key={t.key} className={active===t.key?'active':''} onClick={()=>setActive(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="legal-content">
        <span className="updated">Last updated July 1, 2026</span>
        {current.body.map(([heading, text])=>(
          <React.Fragment key={heading}>
            <h2>{heading}</h2>
            <p>{text}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
