// Topics dataset, keyed by department (with optional company override).
// Look-up order: TOPICS_BY_SCOPE['<companyKey>|<dept>'] → TOPICS_BY_DEPT[<dept>] → TOPICS_BY_DEPT._default

var TOPICS_BY_DEPT = {
    'Sales': [
        {
            name: 'Customer Handover Experience',
            description: 'A structured handover process to delight new owners and drive referrals.',
            categories: ['Customer', 'Sales'],
            subTopics: [
                { name: 'Pre-Delivery Inspection Checklist', mediaType: 'PDF',   mediaName: 'pdi-checklist.pdf' },
                { name: 'First-Drive Walkthrough',           mediaType: 'video', mediaName: 'first-drive.mp4' },
                { name: 'Setting Up Infotainment',           mediaType: 'video', mediaName: 'infotainment-setup.mp4' }
            ]
        },
        {
            name: 'Showroom Standards & Brand Experience',
            description: 'Brand standards, showroom presentation, and the first-visit journey.',
            categories: ['Sales', 'Marketing', 'Onboarding'],
            subTopics: [
                { name: 'Brand Guidelines Overview',     mediaType: 'PDF',   mediaName: 'brand-guidelines.pdf' },
                { name: 'Vehicle Staging Best Practices', mediaType: 'image', mediaName: 'vehicle-staging.png' },
                { name: 'The First 90 Seconds',           mediaType: 'video', mediaName: 'first-90-seconds.mp4' }
            ]
        },
        {
            name: 'Objection Handling Playbook',
            description: 'Common buyer objections and proven responses.',
            categories: ['Sales'],
            subTopics: [
                { name: 'Price & Value Objections',  mediaType: 'PDF',   mediaName: 'price-objections.pdf' },
                { name: 'Trade-In Conversations',    mediaType: 'video', mediaName: 'trade-in.mp4' }
            ]
        }
    ],

    'Aftersales': [
        {
            name: 'Vehicle Diagnostics 101',
            description: 'Scan tool basics, reading OBD-II codes, and fault isolation workflows.',
            categories: ['Technical', 'Service'],
            subTopics: [
                { name: 'OBD-II Code Reference',     mediaType: 'PDF',   mediaName: 'obd-codes.pdf' },
                { name: 'Using the Scan Tool',       mediaType: 'video', mediaName: 'scan-tool-walkthrough.mp4' },
                { name: 'Common Engine Faults',      mediaType: 'image', mediaName: 'engine-faults.png' },
                { name: 'Electrical System Tracing', mediaType: 'video', mediaName: 'electrical-tracing.mp4' }
            ]
        },
        {
            name: 'Service Advisor Excellence',
            description: 'Customer-facing skills for service reception and handover.',
            categories: ['Customer', 'Service'],
            subTopics: [
                { name: 'Walkaround Inspection',  mediaType: 'video', mediaName: 'walkaround.mp4' },
                { name: 'Quoting & Authorisation', mediaType: 'PDF',   mediaName: 'quoting.pdf' }
            ]
        }
    ],

    'R&D': [
        {
            name: 'EV Technology Overview',
            description: 'Introduction to electric vehicle architecture, battery systems, and charging infrastructure.',
            categories: ['Technical', 'Product'],
            subTopics: [
                { name: 'High-Voltage Battery Safety',                mediaType: 'PDF',   mediaName: 'battery-safety.pdf' },
                { name: 'Regenerative Braking Fundamentals',          mediaType: 'video', mediaName: 'regen-braking.mp4' },
                { name: 'Charging Standards: CCS, CHAdeMO, Type 2',   mediaType: 'image', mediaName: 'charging-standards.png' }
            ]
        },
        {
            name: 'Powertrain Innovations',
            description: 'Latest developments in hybrid and pure electric drivetrains.',
            categories: ['Technical'],
            subTopics: [
                { name: 'Motor Architectures',     mediaType: 'PDF',   mediaName: 'motor-arch.pdf' },
                { name: 'Inverter Design Basics',  mediaType: 'video', mediaName: 'inverter-design.mp4' }
            ]
        }
    ],

    'Manufacturing': [
        {
            name: 'Workshop Health & Safety',
            description: 'PPE, lifting standards, hazardous materials handling, and incident reporting.',
            categories: ['Compliance', 'Service'],
            subTopics: [
                { name: 'PPE Requirements',     mediaType: 'image', mediaName: 'ppe-poster.png' },
                { name: 'Vehicle Lifting Safety', mediaType: 'video', mediaName: 'vehicle-lifting.mp4' },
                { name: 'Chemical Handling',    mediaType: 'PDF',   mediaName: 'chemical-handling.pdf' },
                { name: 'Incident Reporting',   mediaType: 'PDF',   mediaName: 'incident-reporting.pdf' }
            ]
        },
        {
            name: 'Lean Manufacturing Principles',
            description: 'Eliminating waste and driving continuous improvement on the line.',
            categories: ['Product'],
            subTopics: [
                { name: '5S Workplace Organization', mediaType: 'PDF',   mediaName: '5s.pdf' },
                { name: 'Kaizen Walkthrough',        mediaType: 'video', mediaName: 'kaizen.mp4' }
            ]
        }
    ],

    'Finance': [
        {
            name: 'Finance & Insurance Basics',
            description: 'Core F&I product knowledge and compliant selling practices.',
            categories: ['Finance', 'Sales'],
            subTopics: [
                { name: 'Loan vs Lease Explained', mediaType: 'PDF',   mediaName: 'loan-vs-lease.pdf' },
                { name: 'GAP Cover Overview',      mediaType: 'PDF',   mediaName: 'gap-cover.pdf' },
                { name: 'Compliance Essentials',   mediaType: 'video', mediaName: 'compliance-essentials.mp4' }
            ]
        },
        {
            name: 'Anti-Money Laundering Awareness',
            description: 'Recognising and reporting suspicious financial activity.',
            categories: ['Finance', 'Compliance'],
            subTopics: [
                { name: 'AML Red Flags',     mediaType: 'PDF',   mediaName: 'aml-flags.pdf' },
                { name: 'Reporting Workflow', mediaType: 'image', mediaName: 'aml-workflow.png' }
            ]
        }
    ],

    'Marketing': [
        {
            name: 'Brand Voice & Tone',
            description: 'Speaking consistently across channels and campaigns.',
            categories: ['Marketing'],
            subTopics: [
                { name: 'Tone of Voice Guide',     mediaType: 'PDF',   mediaName: 'tone.pdf' },
                { name: 'Social Media Examples',   mediaType: 'image', mediaName: 'social-examples.png' }
            ]
        },
        {
            name: 'Campaign Planning',
            description: 'From brief to launch — building marketing campaigns end to end.',
            categories: ['Marketing'],
            subTopics: [
                { name: 'The Brief Template',  mediaType: 'PDF',   mediaName: 'brief.pdf' },
                { name: 'Approvals Walkthrough', mediaType: 'video', mediaName: 'approvals.mp4' }
            ]
        }
    ],

    'Engineering': [
        {
            name: 'Vehicle Body Engineering',
            description: 'Materials, joining methods, and structural design fundamentals.',
            categories: ['Technical'],
            subTopics: [
                { name: 'Lightweight Materials',  mediaType: 'PDF',   mediaName: 'materials.pdf' },
                { name: 'Spot Welding Basics',    mediaType: 'video', mediaName: 'spot-welding.mp4' }
            ]
        },
        {
            name: 'Crash Safety Standards',
            description: 'Regulations and test procedures for occupant safety.',
            categories: ['Technical', 'Compliance'],
            subTopics: [
                { name: 'NCAP Test Overview',     mediaType: 'video', mediaName: 'ncap.mp4' },
                { name: 'Restraint Systems',      mediaType: 'PDF',   mediaName: 'restraints.pdf' }
            ]
        }
    ],

    'Human Resources': [
        {
            name: 'New Hire Onboarding',
            description: 'Day-one through 90-day onboarding flow.',
            categories: ['Onboarding'],
            subTopics: [
                { name: 'Welcome Pack',           mediaType: 'PDF', mediaName: 'welcome.pdf' },
                { name: 'Manager Onboarding Guide', mediaType: 'PDF', mediaName: 'manager-guide.pdf' }
            ]
        },
        {
            name: 'Performance Conversations',
            description: 'Running effective check-ins and reviews.',
            categories: ['Leadership'],
            subTopics: [
                { name: 'Feedback Frameworks',     mediaType: 'PDF',   mediaName: 'feedback.pdf' },
                { name: 'Difficult Conversations', mediaType: 'video', mediaName: 'tough-talks.mp4' }
            ]
        }
    ],

    'Operations': [
        {
            name: 'Daily Operations Standards',
            description: 'Operating procedures and shift routines.',
            categories: ['Service'],
            subTopics: [
                { name: 'Opening Checklist', mediaType: 'PDF', mediaName: 'opening.pdf' },
                { name: 'Closing Checklist', mediaType: 'PDF', mediaName: 'closing.pdf' }
            ]
        },
        {
            name: 'Health, Safety & Hygiene',
            description: 'Workplace standards for a safe and clean environment.',
            categories: ['Compliance'],
            subTopics: [
                { name: 'Hand Hygiene',            mediaType: 'image', mediaName: 'hygiene.png' },
                { name: 'Slip & Fall Prevention',  mediaType: 'video', mediaName: 'slip-fall.mp4' }
            ]
        }
    ],

    'IT': [
        {
            name: 'Cybersecurity Awareness',
            description: 'Phishing, password hygiene, and reporting suspicious activity.',
            categories: ['Compliance', 'Technical'],
            subTopics: [
                { name: 'Spotting Phishing',     mediaType: 'video', mediaName: 'phishing.mp4' },
                { name: 'Password Best Practices', mediaType: 'PDF',   mediaName: 'passwords.pdf' }
            ]
        },
        {
            name: 'Helpdesk Standard Operating Procedure',
            description: 'Triage, ticketing, and escalation workflow.',
            categories: ['Service'],
            subTopics: [
                { name: 'Ticket Triage', mediaType: 'PDF',   mediaName: 'triage.pdf' },
                { name: 'Escalation Tree', mediaType: 'image', mediaName: 'escalation.png' }
            ]
        }
    ],

    'Logistics': [
        {
            name: 'Inbound & Outbound Logistics',
            description: 'Receiving, storage, and dispatch flows.',
            categories: ['Service'],
            subTopics: [
                { name: 'Receiving SOP',  mediaType: 'PDF',   mediaName: 'receiving.pdf' },
                { name: 'Dispatch Walkthrough', mediaType: 'video', mediaName: 'dispatch.mp4' }
            ]
        }
    ],

    'Supply Chain': [
        {
            name: 'Supplier Relationship Management',
            description: 'Onboarding, performance reviews, and risk monitoring.',
            categories: ['Service'],
            subTopics: [
                { name: 'Supplier Onboarding', mediaType: 'PDF',   mediaName: 'supplier-onboarding.pdf' },
                { name: 'Risk Scorecard',      mediaType: 'image', mediaName: 'risk-scorecard.png' }
            ]
        }
    ],

    'Customer Service': [
        {
            name: 'De-escalation Skills',
            description: 'Handling upset customers with empathy and structure.',
            categories: ['Customer'],
            subTopics: [
                { name: 'LAST Framework',         mediaType: 'PDF',   mediaName: 'last.pdf' },
                { name: 'Live Call Walkthrough',  mediaType: 'video', mediaName: 'call-walkthrough.mp4' }
            ]
        },
        {
            name: 'CRM Walkthrough',
            description: 'Logging, routing, and resolving cases in the CRM.',
            categories: ['Service'],
            subTopics: [
                { name: 'Creating a Case',  mediaType: 'video', mediaName: 'create-case.mp4' },
                { name: 'Case Routing Rules', mediaType: 'PDF',   mediaName: 'routing.pdf' }
            ]
        }
    ],

    'Legal': [
        {
            name: 'Contract Review Basics',
            description: 'Reading and negotiating common commercial contracts.',
            categories: ['Compliance'],
            subTopics: [
                { name: 'Key Clauses',          mediaType: 'PDF', mediaName: 'clauses.pdf' },
                { name: 'Redlining Walkthrough', mediaType: 'video', mediaName: 'redlining.mp4' }
            ]
        },
        {
            name: 'Data Privacy & POPIA',
            description: 'Personal data handling, consent, and breach response.',
            categories: ['Compliance'],
            subTopics: [
                { name: 'POPIA Overview',  mediaType: 'PDF', mediaName: 'popia.pdf' },
                { name: 'Breach Response', mediaType: 'PDF', mediaName: 'breach.pdf' }
            ]
        }
    ],

    'Sustainability': [
        {
            name: 'Carbon Reporting Fundamentals',
            description: 'Scope 1, 2, and 3 emissions and how to report them.',
            categories: ['Compliance'],
            subTopics: [
                { name: 'Emissions Scopes Explained', mediaType: 'image', mediaName: 'scopes.png' },
                { name: 'Reporting Cycle',            mediaType: 'PDF',   mediaName: 'reporting.pdf' }
            ]
        },
        {
            name: 'Circular Economy in Auto',
            description: 'Reuse, recycle, and remanufacture across the vehicle lifecycle.',
            categories: ['Product'],
            subTopics: [
                { name: 'Battery Second Life', mediaType: 'video', mediaName: 'battery-2nd-life.mp4' },
                { name: 'Closed-Loop Materials', mediaType: 'PDF',   mediaName: 'closed-loop.pdf' }
            ]
        }
    ],

    'Quality Assurance': [
        {
            name: 'QA Sampling Methodology',
            description: 'Sample sizes, AQL tables, and inspection planning.',
            categories: ['Compliance', 'Technical'],
            subTopics: [
                { name: 'AQL Reference',     mediaType: 'PDF',   mediaName: 'aql.pdf' },
                { name: 'Inspection Walkthrough', mediaType: 'video', mediaName: 'inspection.mp4' }
            ]
        }
    ],

    'Procurement': [
        {
            name: 'Purchase Order Workflow',
            description: 'Requisition, approval, PO issue, and goods receipt.',
            categories: ['Finance'],
            subTopics: [
                { name: 'Requisition Form Walkthrough', mediaType: 'video', mediaName: 'requisition.mp4' },
                { name: 'PO Approval Matrix',           mediaType: 'image', mediaName: 'approval-matrix.png' }
            ]
        }
    ],

    'Product': [
        {
            name: 'Product Discovery Toolkit',
            description: 'Frameworks for problem framing and validating ideas.',
            categories: ['Product'],
            subTopics: [
                { name: 'Opportunity Solution Tree', mediaType: 'image', mediaName: 'ost.png' },
                { name: 'Customer Interview Guide',  mediaType: 'PDF',   mediaName: 'interviews.pdf' }
            ]
        },
        {
            name: 'Roadmap Communication',
            description: 'Telling the story of what we are building and why.',
            categories: ['Product', 'Leadership'],
            subTopics: [
                { name: 'Now / Next / Later',     mediaType: 'image', mediaName: 'nnl.png' },
                { name: 'Stakeholder Updates',    mediaType: 'PDF',   mediaName: 'updates.pdf' }
            ]
        }
    ],

    'Data Analytics': [
        {
            name: 'SQL Fundamentals',
            description: 'Joins, aggregates, and window functions.',
            categories: ['Technical'],
            subTopics: [
                { name: 'Join Patterns',      mediaType: 'PDF',   mediaName: 'joins.pdf' },
                { name: 'Window Functions',   mediaType: 'video', mediaName: 'window-fns.mp4' }
            ]
        },
        {
            name: 'Dashboard Design Principles',
            description: 'Designing dashboards that drive decisions.',
            categories: ['Product'],
            subTopics: [
                { name: 'Choosing the Right Chart', mediaType: 'image', mediaName: 'chart-types.png' },
                { name: 'Dashboard Critique',       mediaType: 'video', mediaName: 'critique.mp4' }
            ]
        }
    ],

    'Customer Support': [
        {
            name: 'Customer Support Playbook',
            description: 'How we run support — tone, tooling, and timing.',
            categories: ['Customer', 'Service'],
            subTopics: [
                { name: 'Reply Templates', mediaType: 'PDF',   mediaName: 'templates.pdf' },
                { name: 'Escalation Path', mediaType: 'image', mediaName: 'escalation.png' }
            ]
        }
    ],

    _default: [
        {
            name: 'Welcome to GameOn',
            description: 'A starter topic — replace with content tailored to this department.',
            categories: ['Onboarding'],
            subTopics: [
                { name: 'Getting Started', mediaType: 'PDF', mediaName: 'getting-started.pdf' }
            ]
        }
    ]
};

// Aliases for departments that share content with another bucket.
TOPICS_BY_DEPT['Brand & Marketing'] = TOPICS_BY_DEPT['Marketing'];
TOPICS_BY_DEPT['IT & Digital']      = TOPICS_BY_DEPT['IT'];

// Company-specific overrides keyed as "<companyKey>|<dept>".
var TOPICS_BY_SCOPE = {
    'sasol|Operations': [
        {
            name: 'Front-of-House Service Standards',
            description: 'Greeting, seating, and table-side service expectations at Spur.',
            categories: ['Customer', 'Service'],
            subTopics: [
                { name: 'Greeting & Seating Guests', mediaType: 'video', mediaName: 'greeting.mp4' },
                { name: 'Order-Taking Walkthrough',  mediaType: 'video', mediaName: 'order-taking.mp4' },
                { name: 'Table Reset Standards',     mediaType: 'image', mediaName: 'table-reset.png' }
            ]
        },
        {
            name: 'Kitchen & Food Safety',
            description: 'HACCP basics, allergens, and cleaning routines.',
            categories: ['Compliance', 'Service'],
            subTopics: [
                { name: 'HACCP Essentials',   mediaType: 'PDF',   mediaName: 'haccp.pdf' },
                { name: 'Allergen Awareness', mediaType: 'PDF',   mediaName: 'allergens.pdf' },
                { name: 'Cleaning Routines',  mediaType: 'video', mediaName: 'cleaning.mp4' }
            ]
        }
    ],
    'shoprite|Engineering': [
        {
            name: 'Code Quality Standards',
            description: 'Internal coding standards, reviews, and quality gates.',
            categories: ['Technical'],
            subTopics: [
                { name: 'Pull Request Checklist',  mediaType: 'PDF',   mediaName: 'pr-checklist.pdf' },
                { name: 'Code Review Walkthrough', mediaType: 'video', mediaName: 'code-review.mp4' }
            ]
        },
        {
            name: 'Incident Response',
            description: 'How to triage, respond to, and learn from production incidents.',
            categories: ['Technical', 'Compliance'],
            subTopics: [
                { name: 'On-Call Playbook',    mediaType: 'PDF', mediaName: 'oncall.pdf' },
                { name: 'Postmortem Template', mediaType: 'PDF', mediaName: 'postmortem.pdf' }
            ]
        }
    ]
};

function getTopicsForScope(companyKey, dept) {
    var key = (companyKey || '') + '|' + (dept || '');
    return TOPICS_BY_SCOPE[key] || TOPICS_BY_DEPT[dept] || TOPICS_BY_DEPT._default;
}
