export const BRAND = {
  name: "WaitWise",
  tagline: "Shorter waits. Healthier tomorrows.",
};

export const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "How It Works", href: "#how-it-works", active: false },
  { label: "About", href: "#about", active: false },
  { label: "Need Help?", href: "#help", active: false },
];

export const HOME_CONTENT = {
  heroBadge: "WELCOME TO WAITWISE",
  heroTitle: "Quality care, made simpler.",
  heroSubtitle:
    "Skip the long lines. Get a ticket, join the right queue, and spend less time waiting — more time on what matters.",
  actionCards: {
    join: {
      title: "Join a Queue",
      subtitle: "Get a ticket for the service you need.",
      path: "/join",
    },
    track: {
      title: "Track My Queue",
      subtitle: "Already have a ticket? Check your position and wait time.",
      path: "/track",
    },
  },
  features: [
    {
      id: "waiting-time",
      icon: "clock",
      title: "Less waiting time",
      description: "Know your place in line and plan your day.",
      badgeColor: "mint",
    },
    {
      id: "secure-private",
      icon: "shield",
      title: "Secure & private",
      description: "Your information is safe and protected.",
      badgeColor: "blue",
    },
    {
      id: "access-care",
      icon: "heart-pulse",
      title: "Better access to care",
      description: "Get the care you need, when you need it.",
      badgeColor: "purple",
    },
    {
      id: "community",
      icon: "users",
      title: "For a healthier community",
      description: "A smoother experience for everyone.",
      badgeColor: "teal",
    },
  ],
  reassuranceBanner: {
    title: "Your health matters.",
    subtitle: "We're here to help.",
  },
};

export const JOIN_QUEUE_CONTENT = {
  backLabel: "Back to Home",
  tag: "JOIN A QUEUE",
  title: "Select the service you need.",
  subtitle:
    "Choose the type of service and we'll guide you through the next steps.",
  needHelp: {
    title: "Need help?",
    subtitle:
      "Our staff are here to assist you. Visit reception or ask at the information desk.",
  },
};

export const CONFIRM_QUEUE_CONTENT = {
  backLabel: "Back to Services",
  tag: "CONFIRM & JOIN QUEUE",
  title: "You're almost there!",
  subtitlePrefix: "Please confirm the details below to join the queue for",
  steps: [
    { number: 1, label: "Select Service" },
    { number: 2, label: "Confirm Details" },
    { number: 3, label: "Join Queue" },
  ],
  importantInfo: [
    {
      id: "ticket",
      icon: "ticket",
      title: "A ticket will be generated",
      description:
        "Your ticket number will be created immediately after you join the queue.",
    },
    {
      id: "keep",
      icon: "bell",
      title: "Keep your ticket number",
      description: "You may need it when your turn is called.",
    },
    {
      id: "reachable",
      icon: "phone",
      title: "Stay reachable",
      description:
        "If you provided a phone number, we'll also send you an SMS with your ticket details.",
    },
    {
      id: "secure",
      icon: "shield",
      title: "Your place is secure",
      description:
        "Your spot in the queue is saved on our system, even if you close this page.",
    },
  ],
  supportLink: "Need help? Contact support",
  summary: {
    title: "Queue summary",
    buttonLabel: "Join Queue",
  },
  safeCard: {
    title: "Your information is safe",
    description:
      "We use secure systems to protect your data and keep your place in the queue.",
  },
};

export const TICKET_CONTENT = {
  backLabel: "Back to Home",
  headingDark: "YOU’RE ALL SET!",
  headingTeal: "Your place is saved.",
  joinedPrefix: "You've successfully joined the queue for",
  joinedMiddle: "at",
  autoUpdateNotice:
    "The queue will update automatically, so you can keep this page open or come back later. You don't need to stay on this page.",
  ticketLabel: "YOUR TICKET NUMBER",
  positionLabel: "Your current position",
  aheadLabel: "people ahead of you",
  waitLabel: "Estimated wait time",
  waitDisclaimer: "(may vary based on current queue)",
  lastUpdatedLabel: "Last updated",
  justNowText: "Just now •",
  updatingNotice: "We'll keep updating this information automatically.",
  checkLater: {
    title: "Want to check your queue later?",
    textPrefix: "You can always return to WaitWise and use \"Track My Queue\" with your ticket number",
    buttonLabel: "Track My Queue",
  },
  quickInfoTitle: "Quick Information",
  helpfulTipsTitle: "Helpful tips",
  tips: [
    {
      id: "phone",
      icon: "phone-ring",
      title: "Keep your phone nearby",
      description: "You'll get a notification when it's almost your turn.",
    },
    {
      id: "internet",
      icon: "wifi",
      title: "No internet? No problem.",
      description:
        "Your ticket is saved and will still be valid when you reconnect.",
    },
    {
      id: "leave",
      icon: "calendar-clock",
      title: "Need to leave?",
      description:
        "You can return and track your queue at any time using your ticket number.",
    },
  ],
  thankYouBanner: {
    title: "Thank you for choosing WaitWise.",
    subtitle: "We're here to make your visit easier, faster and more comfortable.",
  },
};

export const TRACK_CONTENT = {
  backLabel: "Back to Home",
  tag: "TRACK MY QUEUE",
  title: "Here's your current status",
  subtitle:
    "We're keeping an eye on your place in line. You'll be notified when it's almost your turn.",
  ticketLabel: "YOUR TICKET NUMBER",
  positionLabel: "You are",
  aheadLabel: "people ahead of you",
  waitLabel: "Estimated wait time",
  waitDisclaimer: "(may vary based on current queue)",
  queueDetailsTitle: "Your queue details",
  whatNext: {
    title: "What happens next?",
    description:
      "We'll keep updating your position in real time. When it's almost your turn, you'll get a notification on this page (and via SMS if enabled).",
  },
  helpfulTipsTitle: "Helpful tips",
  tips: [
    {
      id: "phone-on",
      icon: "phone-ring",
      title: "Keep your phone on",
      description: "You'll get a notification when it's almost your turn.",
    },
    {
      id: "internet",
      icon: "wifi",
      title: "No internet? No problem.",
      description:
        "Your ticket is saved and will still be valid when you reconnect.",
    },
    {
      id: "leave",
      icon: "calendar-clock",
      title: "Need to leave?",
      description:
        "You can return and track your queue at any time using your ticket number.",
    },
  ],
};

export const ALMOST_NEXT_CONTENT = {
  backLabel: "Back to Queue",
  tag: "TRACK MY QUEUE",
  title: "You're almost next!",
  subtitlePrefix: "Just ",
  subtitleSuffix: "ahead of you. You're doing great — your turn is coming soon!",
  ticketLabel: "YOUR TICKET NUMBER",
  positionLabel: "You are",
  aheadLabel: "person ahead of you",
  aheadLabelPlural: "people ahead of you",
  waitLabel: "Estimated wait time",
  waitDisclaimer: "(may vary based on current queue)",
  whatToDoNow: {
    title: "What to do now?",
    descriptionPrefix: "Please keep your phone nearby and be ready to respond. The staff will call your ticket number (",
    descriptionSuffix: ") when it's your turn.",
  },
  queueDetailsTitle: "Your queue details",
  helpfulTipsTitle: "Helpful tips",
  tips: [
    {
      id: "phone-on",
      icon: "phone-ring",
      title: "Keep your phone on",
      description: "You'll get a notification when it's almost your turn.",
    },
    {
      id: "internet",
      icon: "wifi",
      title: "No internet? No problem.",
      description:
        "Your ticket is saved and will still be valid when you reconnect.",
    },
    {
      id: "leave",
      icon: "calendar-clock",
      title: "Need to leave?",
      description:
        "You can return and track your queue at any time using your ticket number.",
    },
  ],
};

export const CALLED_CONTENT = {
  backLabel: "Back to Queue",
  eyebrow: "IT'S YOUR TURN!",
  titlePrefix: "Please proceed to ",
  subtitlePrefix: "Your ticket number is ",
  subtitleSuffix: ". The staff will be ready to see you.",
  ticketLabel: "YOUR TICKET NUMBER",
  safeNotice: {
    title: "We'll keep your place in the queue safe.",
    subtitle:
      "Your ticket remains active, and you can always return here to check your next steps.",
  },
  quickDetailsTitle: "Quick details",
  helpfulTipsTitle: "Helpful tips",
  tips: [
    {
      id: "phone-nearby",
      icon: "phone-ring",
      title: "Keep your phone nearby",
      description: "You may receive a notification when it's almost your turn.",
    },
    {
      id: "internet",
      icon: "wifi",
      title: "No internet? No problem.",
      description:
        "Your ticket is saved and will still be valid when you reconnect.",
    },
    {
      id: "leave",
      icon: "calendar-clock",
      title: "Need to leave?",
      description:
        "You can return and track your queue at any time using your ticket number.",
    },
  ],
};

export const COMPLETE_CONTENT = {
  eyebrow: "YOUR VISIT IS COMPLETE.",
  title: "Thank you for using WaitWise!",
  subtitle: "Your consultation has been completed. We hope you feel better soon!",
  ticketLabel: "YOUR TICKET NUMBER",
  statusCompleted: "Completed",
  statusDescription: "Your visit has been successfully completed.",
  feedback: {
    title: "How was your experience?",
    subtitle: "Your feedback helps us improve and provide better care for everyone.",
    buttonLabel: "Give Feedback",
  },
  visitSummaryTitle: "Visit Summary",
  takeCare: {
    title: "Take care!",
    description: "Remember to follow any advice given by the healthcare team.",
  },
};
