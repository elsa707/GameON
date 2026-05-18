// ===== Games seed data =====
// GAMES_BY_DEPT  — default games keyed by lowercase dept name (plus '_default')
// GAMES_BY_SCOPE — runtime overrides keyed by 'companyKey|deptName' (populated live)

var GAMES_BY_SCOPE = {};

var GAMES_BY_DEPT = {
    '_default': [
        {
            id: 1001,
            name: 'Leadership Fundamentals Challenge',
            description: 'Test your understanding of core leadership principles and people management.',
            cover: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
            active: true,
            scheduledDate: null,
            categories: [
                {
                    id: 2001,
                    name: 'Leadership Styles',
                    description: 'Identify and apply different leadership approaches.',
                    questions: [
                        {
                            id: 3001,
                            text: 'Which leadership style involves the leader making decisions without input from team members?',
                            options: ['Democratic', 'Autocratic', 'Laissez-faire', 'Transformational'],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3002,
                            text: 'A leader who inspires employees by creating a compelling vision and motivating them toward it is using which style?',
                            options: ['Transactional', 'Autocratic', 'Transformational', 'Servant'],
                            correct: 2,
                            points: 1
                        },
                        {
                            id: 3003,
                            text: 'What is the primary focus of a servant leader?',
                            options: ['Maximising profit', 'Meeting deadlines', 'Serving the needs of the team', 'Controlling outcomes'],
                            correct: 2,
                            points: 2
                        }
                    ]
                },
                {
                    id: 2002,
                    name: 'Team Development',
                    description: 'Understand how teams form and grow.',
                    questions: [
                        {
                            id: 3004,
                            text: 'According to Tuckman\'s model, what is the correct order of team development stages?',
                            options: [
                                'Norming, Forming, Storming, Performing',
                                'Forming, Storming, Norming, Performing',
                                'Storming, Forming, Norming, Performing',
                                'Performing, Norming, Storming, Forming'
                            ],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3005,
                            text: 'During the "Storming" phase of team development, a leader should primarily:',
                            options: [
                                'Step back and let the team sort itself out',
                                'Provide strong direction and resolve conflict constructively',
                                'Delegate all decisions to senior team members',
                                'Avoid addressing interpersonal issues'
                            ],
                            correct: 1,
                            points: 1
                        }
                    ]
                }
            ]
        },
        {
            id: 1002,
            name: 'Compliance Essentials',
            description: 'Core compliance knowledge every employee must have.',
            cover: 'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
            active: true,
            scheduledDate: null,
            categories: [
                {
                    id: 2003,
                    name: 'Data Protection',
                    description: 'GDPR, POPIA and data handling best practices.',
                    questions: [
                        {
                            id: 3006,
                            text: 'Under POPIA, personal information may be processed without consent if:',
                            options: [
                                'The data is stored securely',
                                'It is necessary to carry out a contract with the data subject',
                                'The company has been operating for more than 5 years',
                                'The data subject is over 18 years old'
                            ],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3007,
                            text: 'How long does POPIA give an organisation to report a data breach to the Information Regulator?',
                            options: ['24 hours', '48 hours', 'As soon as reasonably possible', '30 days'],
                            correct: 2,
                            points: 2
                        }
                    ]
                },
                {
                    id: 2004,
                    name: 'Workplace Ethics',
                    description: 'Ethical conduct and anti-corruption principles.',
                    questions: [
                        {
                            id: 3008,
                            text: 'Which of the following best describes a conflict of interest?',
                            options: [
                                'A disagreement between two colleagues',
                                'A situation where personal interests could improperly influence professional decisions',
                                'A difference of opinion in a team meeting',
                                'Competing priorities on a project'
                            ],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3009,
                            text: 'You receive a gift worth R800 from a supplier. What should you do?',
                            options: [
                                'Accept it — it is a token of goodwill',
                                'Return it and say nothing',
                                'Declare it to your manager in line with company policy',
                                'Share it with the team'
                            ],
                            correct: 2,
                            points: 1
                        }
                    ]
                }
            ]
        }
    ],

    'sales': [
        {
            id: 1003,
            name: 'Sales Mastery Game',
            description: 'Master the end-to-end sales process from prospecting to closing.',
            cover: 'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
            active: true,
            scheduledDate: null,
            categories: [
                {
                    id: 2005,
                    name: 'Prospecting & Qualification',
                    description: 'Find and qualify the right opportunities.',
                    questions: [
                        {
                            id: 3010,
                            text: 'In the BANT framework, what does the "A" stand for?',
                            options: ['Approach', 'Authority', 'Awareness', 'Alignment'],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3011,
                            text: 'A "warm lead" is best described as:',
                            options: [
                                'A contact who has never heard of your company',
                                'A prospect who has shown some interest or been referred',
                                'A deal that is about to close',
                                'A client you have sold to before'
                            ],
                            correct: 1,
                            points: 1
                        }
                    ]
                },
                {
                    id: 2006,
                    name: 'Closing Techniques',
                    description: 'Proven methods to close deals confidently.',
                    questions: [
                        {
                            id: 3012,
                            text: 'The "Assumptive Close" technique involves:',
                            options: [
                                'Offering a discount to speed up the decision',
                                'Asking the prospect what they need to make a decision',
                                'Acting as though the prospect has already decided to buy',
                                'Presenting multiple payment options'
                            ],
                            correct: 2,
                            points: 2
                        },
                        {
                            id: 3013,
                            text: 'When a prospect says "I need to think about it," the best response is to:',
                            options: [
                                'Leave them to think and follow up in a week',
                                'Ask what specific concern is causing hesitation',
                                'Immediately offer a discount',
                                'End the call politely'
                            ],
                            correct: 1,
                            points: 1
                        }
                    ]
                }
            ]
        }
    ],

    'human resources': [
        {
            id: 1004,
            name: 'HR Essentials Quiz',
            description: 'Core HR knowledge for people professionals.',
            cover: 'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
            active: true,
            scheduledDate: null,
            categories: [
                {
                    id: 2007,
                    name: 'Recruitment & Selection',
                    description: 'Best practices in attracting and selecting talent.',
                    questions: [
                        {
                            id: 3014,
                            text: 'Which interview technique is most effective for predicting future job performance?',
                            options: [
                                'Unstructured interview',
                                'Panel interview with no set questions',
                                'Structured behavioural interview',
                                'Casual coffee-chat interview'
                            ],
                            correct: 2,
                            points: 1
                        },
                        {
                            id: 3015,
                            text: 'The "halo effect" in interviews refers to:',
                            options: [
                                'Focusing only on negative attributes',
                                'Letting one positive trait overshadow all other evaluation',
                                'Hiring only candidates who are referred internally',
                                'Asking only competency-based questions'
                            ],
                            correct: 1,
                            points: 1
                        }
                    ]
                }
            ]
        }
    ],

    'marketing': [
        {
            id: 1005,
            name: 'Digital Marketing Challenge',
            description: 'Test your knowledge of modern digital marketing strategies and tools.',
            cover: 'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
            active: true,
            scheduledDate: null,
            categories: [
                {
                    id: 2008,
                    name: 'SEO & Content',
                    description: 'Search engine optimisation and content marketing fundamentals.',
                    questions: [
                        {
                            id: 3016,
                            text: 'Which factor has the greatest impact on a page\'s Google search ranking?',
                            options: [
                                'Number of images on the page',
                                'High-quality backlinks from authoritative websites',
                                'Amount of JavaScript used',
                                'Page background colour'
                            ],
                            correct: 1,
                            points: 1
                        },
                        {
                            id: 3017,
                            text: 'What does a "long-tail keyword" typically have compared to a short-tail keyword?',
                            options: [
                                'Higher search volume and more competition',
                                'Lower search volume but higher conversion intent',
                                'More words but less specificity',
                                'Higher cost-per-click in paid search'
                            ],
                            correct: 1,
                            points: 1
                        }
                    ]
                },
                {
                    id: 2009,
                    name: 'Social Media & Paid Advertising',
                    description: 'Organic and paid social media strategies.',
                    questions: [
                        {
                            id: 3018,
                            text: 'What metric measures the percentage of people who clicked your ad after seeing it?',
                            options: ['Impressions', 'Reach', 'Click-through rate (CTR)', 'Frequency'],
                            correct: 2,
                            points: 1
                        },
                        {
                            id: 3019,
                            text: 'Retargeting ads are shown to:',
                            options: [
                                'People who have never visited your website',
                                'Users who have previously interacted with your brand online',
                                'Random users in a geographic area',
                                'Only existing customers'
                            ],
                            correct: 1,
                            points: 2
                        }
                    ]
                }
            ]
        }
    ]
};
