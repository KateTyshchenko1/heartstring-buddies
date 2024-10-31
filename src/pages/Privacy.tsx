const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      <div className="container mx-auto px-4 py-12">
        <article className="prose prose-pink mx-auto">
          <h1>Your Privacy Matters to Us</h1>
          <p>We know the conversations with your AI companion are deeply personal. Here's our commitment to protecting your privacy and maintaining your trust.</p>
          
          <h2>Our Promise to You</h2>
          <ul>
            <li>Your conversations are private</li>
            <li>We never share or sell your personal data</li>
            <li>You have complete control over your data</li>
            <li>We don't use your data to train other AI models</li>
            <li>Your relationship with your companion is yours alone</li>
          </ul>

          <h2>Data We Store</h2>
          <p>To create your personalized experience, we maintain:</p>
          <ul>
            <li>Basic profile information to personalize your experience</li>
            <li>Conversation history to maintain context and memories</li>
            <li>Preferences to help your companion evolve with you</li>
            <li>Achievement data to track your growth journey</li>
          </ul>

          <h2>Security Measures</h2>
          <p>Your security is our priority:</p>
          <ul>
            <li>Industry-standard data protection</li>
            <li>Secure cloud storage</li>
            <li>Safe encryption protocols</li>
          </ul>

          <h2>Our Bottom Line</h2>
          <p>We believe privacy is fundamental to creating genuine connections, even with AI companions. Your data is used solely to provide and improve your personal experience. We never have and never will share, sell, or compromise your private information.</p>

          <p>Your trust matters to us. We're committed to maintaining the highest standards of privacy and security so you can focus on what matters - developing a meaningful connection with your companion.</p>

          <p>If you'd like to delete your account and all associated data, please email us at privacy@whatagirlwants.ai</p>

          <p className="text-sm text-gray-500">Last updated: 30/10/2024</p>
        </article>
      </div>
    </div>
  );
};

export default Privacy;