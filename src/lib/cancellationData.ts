import { CancellationGuide, SubscriptionCategory } from "@/types";

export interface MerchantRule {
  normalizedBrand: string;
  category: SubscriptionCategory;
  defaultFrequency: "monthly" | "annual";
  officialCancellationUrl: string;
  guide: CancellationGuide;
  aliases: string[];
}

export const KNOWN_MERCHANTS: Record<string, MerchantRule> = {
  netflix: {
    normalizedBrand: "Netflix",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.netflix.com/youraccount",
    aliases: ["netflix", "netflix.com", "netflix digital", "nflx"],
    guide: {
      officialUrl: "https://www.netflix.com/youraccount",
      difficulty: "easy",
      steps: [
        "Sign in to your Netflix account at netflix.com/youraccount.",
        "Under the 'Membership & Billing' section, click the 'Cancel Membership' button.",
        "Click 'Finish Cancellation' to confirm your decision.",
        "You will retain streaming access until the end of your current billing period."
      ],
      emailTemplate: {
        subject: "Formal Request for Account Cancellation - Netflix",
        body: "Hello Support,\n\nI am writing to request the cancellation of my Netflix subscription associated with this email address. Please confirm that automatic billing has been terminated and that no further charges will occur.\n\nThank you,\nAccount Holder"
      },
      warnings: ["Cancellation takes effect at the end of the current billing cycle. Profiles and viewing history are saved for 10 months."]
    }
  },
  spotify: {
    normalizedBrand: "Spotify",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.spotify.com/account/subscription/",
    aliases: ["spotify", "spotify usa", "spotify p1", "spotify ab", "spotify premium"],
    guide: {
      officialUrl: "https://www.spotify.com/account/subscription/",
      difficulty: "easy",
      steps: [
        "Log in to spotify.com/account.",
        "Scroll down to 'Your plan' and click 'Change plan'.",
        "Scroll down to 'Cancel Spotify' and click 'Cancel Premium'.",
        "Continue through the prompts to final confirmation."
      ],
      emailTemplate: {
        subject: "Request to Cancel Spotify Premium Subscription",
        body: "Hello Spotify Support,\n\nPlease cancel my Spotify Premium subscription linked to this email address immediately. Kindly confirm when the cancellation is effective.\n\nBest regards,\nAccount Holder"
      },
      warnings: ["If subscribed via Apple App Store or Google Play, you must cancel through your device's subscription settings."]
    }
  },
  youtube_premium: {
    normalizedBrand: "YouTube Premium",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.youtube.com/paid_memberships",
    aliases: ["youtube premium", "google youtube", "google *youtube", "youtube member", "yt premium"],
    guide: {
      officialUrl: "https://www.youtube.com/paid_memberships",
      difficulty: "easy",
      steps: [
        "Go to youtube.com/paid_memberships.",
        "Click 'Manage membership' next to your YouTube Premium subscription.",
        "Click 'Deactivate' and choose 'Continue to cancel'.",
        "Select your reason and click 'Cancel membership'."
      ],
      emailTemplate: {
        subject: "Cancel YouTube Premium Membership",
        body: "Hi Google/YouTube Support,\n\nI wish to cancel my YouTube Premium subscription. Please ensure no further recurring debits occur.\n\nSincerely,\nAccount Holder"
      },
      warnings: ["Family plan managers will cancel access for all family members upon deactivation."]
    }
  },
  google_one: {
    normalizedBrand: "Google One",
    category: "Cloud & Hosting",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://one.google.com/settings",
    aliases: ["google one", "google *storage", "google cloud storage", "google *gsuite", "google drive"],
    guide: {
      officialUrl: "https://one.google.com/settings",
      difficulty: "easy",
      steps: [
        "Visit one.google.com/settings on your computer or browser.",
        "Click 'Cancel membership' under the Cancel Google One section.",
        "Confirm cancellation on the Google Play subscriptions pop-up."
      ],
      emailTemplate: {
        subject: "Notice to Cancel Google One Storage Plan",
        body: "Hello Google One Support,\n\nI am requesting cancellation of my Google One storage subscription. Please confirm the date this takes effect.\n\nThank you,\nAccount Holder"
      },
      warnings: ["If your storage exceeds 15 GB free limit after cancellation, you will not be able to send or receive emails in Gmail or sync Google Drive files."]
    }
  },
  dropbox: {
    normalizedBrand: "Dropbox",
    category: "Cloud & Hosting",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.dropbox.com/account/plan",
    aliases: ["dropbox", "dropbox inc", "dropbox *plus", "dropbox pro"],
    guide: {
      officialUrl: "https://www.dropbox.com/account/plan",
      difficulty: "medium",
      steps: [
        "Sign in to dropbox.com.",
        "Click your avatar in the upper right, select 'Settings', then the 'Plan' tab.",
        "Click 'Cancel plan' at the bottom of the page.",
        "Select a cancellation reason and confirm."
      ],
      emailTemplate: {
        subject: "Dropbox Subscription Cancellation Request",
        body: "Dear Dropbox Support Team,\n\nPlease downgrade my Dropbox plan to the free Dropbox Basic tier and cancel recurring billing for my account.\n\nRegards,\nAccount Holder"
      },
      warnings: ["Account will revert to Dropbox Basic (2GB). Files over the limit will stop syncing across devices."]
    }
  },
  adobe: {
    normalizedBrand: "Adobe Creative Cloud",
    category: "Software & Productivity",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://account.adobe.com/plans",
    aliases: ["adobe", "adobe creative cloud", "adobe systems", "adobe *photography", "adobe inc"],
    guide: {
      officialUrl: "https://account.adobe.com/plans",
      difficulty: "hard",
      steps: [
        "Sign in at account.adobe.com/plans.",
        "Select 'Manage plan' or 'View plan details' for the subscription.",
        "Click 'Cancel your plan'.",
        "Review any early termination fee warnings before clicking confirm."
      ],
      emailTemplate: {
        subject: "Urgent: Cancel Adobe Creative Cloud Membership",
        body: "To Adobe Customer Care,\n\nI would like to cancel my Adobe Creative Cloud subscription immediately. Please verify that recurring charges are stopped and advise if any termination terms apply.\n\nSincerely,\nAccount Holder"
      },
      warnings: ["Early termination fees of 50% of remaining annual commitment may apply if cancelled after the initial 14-day window!"]
    }
  },
  microsoft_365: {
    normalizedBrand: "Microsoft 365",
    category: "Software & Productivity",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://account.microsoft.com/services",
    aliases: ["microsoft 365", "msft *office", "microsoft *store", "microsoft office", "msft *xbox"],
    guide: {
      officialUrl: "https://account.microsoft.com/services",
      difficulty: "easy",
      steps: [
        "Go to account.microsoft.com/services and sign in.",
        "Find your Microsoft 365 subscription and select 'Manage'.",
        "Select 'Cancel subscription' or 'Turn off recurring billing'.",
        "Follow instructions on page to proceed with cancellation."
      ],
      emailTemplate: {
        subject: "Microsoft 365 Recurring Billing Termination",
        body: "Dear Microsoft Support,\n\nPlease turn off recurring billing for my Microsoft 365 subscription linked to this account.\n\nThank you,\nAccount Holder"
      },
      warnings: ["OneDrive storage reverts to 5 GB. Files in excess will be read-only until deleted or expanded."]
    }
  },
  gym_fitness: {
    normalizedBrand: "Equinox / Planet Fitness",
    category: "Fitness & Health",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.planetfitness.com/about-planet-fitness/customer-service",
    aliases: ["planet fitness", "equinox", "la fitness", "anytime fitness", "gold's gym", "crunch fitness"],
    guide: {
      officialUrl: "https://www.planetfitness.com/about-planet-fitness/customer-service",
      difficulty: "hard",
      requiresPhoneCall: true,
      steps: [
        "Most fitness gyms require in-person cancellation or certified mail.",
        "Visit your home club location in person during staffed hours.",
        "Request a physical cancellation form from the front desk manager.",
        "Demand a signed receipt or written confirmation of cancellation before leaving."
      ],
      emailTemplate: {
        subject: "Notice of Gym Membership Cancellation - Certified Request",
        body: "To Membership Management,\n\nPlease accept this letter as formal notice that I am terminating my gym membership effective immediately. Please cease all auto-debits on my account and provide written confirmation.\n\nMember Name: [Your Name]\nMember ID: [Your Member ID]\nPhone: [Your Phone]\n\nSincerely,\n[Your Name]"
      },
      warnings: ["Many gyms require a 30-day advance notice, meaning you may be billed for one additional cycle after filing."]
    }
  },
  godaddy: {
    normalizedBrand: "GoDaddy Domains",
    category: "Cloud & Hosting",
    defaultFrequency: "annual",
    officialCancellationUrl: "https://account.godaddy.com/subscriptions",
    aliases: ["godaddy", "godaddy.com", "godaddy domain renewal", "namecheap"],
    guide: {
      officialUrl: "https://account.godaddy.com/subscriptions",
      difficulty: "easy",
      steps: [
        "Log in to your GoDaddy Renewals & Billing page at account.godaddy.com/subscriptions.",
        "Check the box next to the domain or product you want to cancel.",
        "Select 'Cancel Renewal' at the top of the list.",
        "Click 'Delete My Product' or confirm cancel renewal."
      ],
      emailTemplate: {
        subject: "Cancel Auto-Renewal for GoDaddy Services",
        body: "Hello GoDaddy Billing,\n\nI request that auto-renewal be disabled for all domain names and hosting plans on my account immediately.\n\nAccount ID: [Your Customer Number]\n\nThank you."
      },
      warnings: ["Turning off auto-renew means your domain will expire on its expiration date and become available to the public."]
    }
  },
  amazon_prime: {
    normalizedBrand: "Amazon Prime",
    category: "Shopping & Memberships",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.amazon.com/mc/manage",
    aliases: ["amazon prime", "amzn prime", "prime video", "amazon digital svcs"],
    guide: {
      officialUrl: "https://www.amazon.com/mc/manage",
      difficulty: "medium",
      steps: [
        "Go to Your Amazon Prime Membership (amazon.com/mc/manage).",
        "Select 'Manage Membership' then 'End Membership'.",
        "Click through the confirmation screens until you receive the cancellation confirmation."
      ],
      emailTemplate: {
        subject: "Amazon Prime Membership Cancellation",
        body: "Dear Amazon Customer Support,\n\nPlease terminate my Amazon Prime subscription and confirm the end date of my benefits.\n\nThank you,\nAccount Holder"
      },
      warnings: ["If you have not used any Prime benefits since your last renewal, you may be eligible for a full refund of the current period."]
    }
  },
  jiohotstar: {
    normalizedBrand: "JioHotstar / Disney+ Hotstar",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.hotstar.com/in/my-account",
    aliases: ["jiohotstar", "hotstar", "disney+ hotstar", "disney hotstar"],
    guide: {
      officialUrl: "https://www.hotstar.com/in/my-account",
      difficulty: "easy",
      steps: [
        "Open Hotstar app or visit hotstar.com.",
        "Go to 'My Account' or 'Subscriptions'.",
        "Select 'Cancel Membership' or pause autopay in your UPI app.",
        "Confirm cancellation."
      ],
      emailTemplate: {
        subject: "Hotstar Subscription Cancellation Request",
        body: "Hello Support,\n\nPlease cancel my subscription and stop any further automatic debits.\n\nThank you."
      },
      warnings: ["Access remains active until the end of the paid validity period."]
    }
  },
  sonyliv: {
    normalizedBrand: "SonyLIV",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.sonyliv.com/my-account",
    aliases: ["sonyliv", "sony liv", "sony pictures"],
    guide: {
      officialUrl: "https://www.sonyliv.com/my-account",
      difficulty: "easy",
      steps: [
        "Sign in to sonyliv.com and navigate to 'My Account'.",
        "Click on 'Subscription Details' and select 'Cancel Subscription'.",
        "If billed via Google Play / UPI Mandate, cancel directly in the Google Play Store or UPI app."
      ],
      emailTemplate: {
        subject: "Cancellation of SonyLIV Subscription",
        body: "Dear Support,\n\nPlease cancel my SonyLIV plan and recurring auto-debit.\n\nThank you."
      },
      warnings: ["Ensure you cancel recurring mandate in Google Play / UPI bank app."]
    }
  },
  zee5: {
    normalizedBrand: "ZEE5",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.zee5.com/my-account/subscription",
    aliases: ["zee5", "zee entertainment"],
    guide: {
      officialUrl: "https://www.zee5.com/my-account/subscription",
      difficulty: "easy",
      steps: [
        "Go to zee5.com and sign in to 'My Account'.",
        "Open 'My Subscriptions' and click 'Cancel Subscription'.",
        "Confirm."
      ],
      emailTemplate: {
        subject: "ZEE5 Subscription Cancellation",
        body: "Please cancel my recurring ZEE5 subscription.\n\nThank you."
      },
      warnings: ["Cancellation prevents future renewals."]
    }
  },
  appletv: {
    normalizedBrand: "Apple TV+",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://support.apple.com/billing",
    aliases: ["apple tv plus", "apple tv+", "apple tv", "apple.com/bill"],
    guide: {
      officialUrl: "https://support.apple.com/billing",
      difficulty: "easy",
      steps: [
        "Open Settings on your Apple device or visit support.apple.com/billing.",
        "Tap your name > Subscriptions.",
        "Select Apple TV+ and tap Cancel Subscription."
      ],
      emailTemplate: {
        subject: "Apple TV+ Subscription Inquiry",
        body: "Please ensure Apple TV+ subscription has recurring billing disabled."
      },
      warnings: ["Cancellation takes effect at cycle end."]
    }
  },
  lionsgate: {
    normalizedBrand: "Lionsgate Play",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.lionsgateplay.com/account",
    aliases: ["lionsgate", "lionsgate play"],
    guide: {
      officialUrl: "https://www.lionsgateplay.com/account",
      difficulty: "easy",
      steps: [
        "Sign in to Lionsgate Play.",
        "Go to Account settings > Subscriptions.",
        "Click Cancel Subscription."
      ],
      emailTemplate: {
        subject: "Lionsgate Play Cancellation",
        body: "Please cancel my Lionsgate Play subscription."
      },
      warnings: ["No further charges will occur."]
    }
  },
  crunchyroll: {
    normalizedBrand: "Crunchyroll",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://www.crunchyroll.com/account/membership",
    aliases: ["crunchyroll"],
    guide: {
      officialUrl: "https://www.crunchyroll.com/account/membership",
      difficulty: "easy",
      steps: [
        "Log in to Crunchyroll.",
        "Navigate to Settings > Membership Info.",
        "Click 'Cancel Membership' and follow prompts."
      ],
      emailTemplate: {
        subject: "Crunchyroll Cancellation",
        body: "Please cancel my Crunchyroll Premium subscription."
      },
      warnings: ["Benefits continue until end of billing cycle."]
    }
  },
  mubi: {
    normalizedBrand: "MUBI",
    category: "Entertainment & Streaming",
    defaultFrequency: "monthly",
    officialCancellationUrl: "https://mubi.com/settings",
    aliases: ["mubi", "mubi streaming"],
    guide: {
      officialUrl: "https://mubi.com/settings",
      difficulty: "easy",
      steps: [
        "Log into mubi.com and go to Settings.",
        "Select Subscription and click Cancel Subscription."
      ],
      emailTemplate: {
        subject: "MUBI Cancellation",
        body: "Please cancel my MUBI subscription."
      },
      warnings: ["Cycle will complete without auto-renewal."]
    }
  }
};

export function lookupMerchant(rawMerchant: string): MerchantRule | null {
  const normalized = rawMerchant.toLowerCase().trim();
  for (const rule of Object.values(KNOWN_MERCHANTS)) {
    for (const alias of rule.aliases) {
      if (normalized.includes(alias)) {
        return rule;
      }
    }
  }
  return null;
}
