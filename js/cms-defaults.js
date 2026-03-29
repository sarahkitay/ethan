// Default CMS content. Used when no published content exists.
// Public pages should not crash when Firebase is not configured.
window.EthanCMSDefaults = window.EthanCMSDefaults || {
    theme: {
        rust: '#83B1F3',
        amber: '#9bc2f5',
        steel: '#2a2a2a',
        gunmetal: '#1a1a1a',
        void: '#0a0a0a'
    },
    home: {
        heroSubtitle:
            'Programs built for longevity. No templates. No guesswork. Built for those who refuse mediocrity.',
        heroApplyLabel: 'Apply Now',
        heroViewProgramsLabel: 'View Programs',
        bottomCtaApplyLabel: 'APPLY NOW',
        bottomCtaViewProgramsLabel: 'VIEW PROGRAMS'
    },
    results: {
        videoUrl: 'assets/ethanvid3_1.mp4',
        testimonials: [
            {
                result: '−12% body fat',
                quote:
                    '"Stronger than I’ve been in years. Ethan’s form coaching made every session feel safe and effective."',
                author: '— Sarah M. · 16 weeks'
            },
            {
                result: 'Energy and strength up',
                quote: '"I didn’t think I’d feel this fit again. More strength, better sleep, and training that fits real life."',
                author: '— Client · busy professional'
            },
            {
                result: 'Pain to momentum',
                quote:
                    '"Issues I thought were permanent got better. He adapts every session, never a stale template."',
                author: '— Client · 5 months'
            },
            {
                result: '+Strength and mobility',
                quote:
                    '"Huge gains in six months. Nutrition guidance elevated my energy, and he’s patient with all my questions."',
                author: '— Client · 6 months'
            }
        ]
    }
};

