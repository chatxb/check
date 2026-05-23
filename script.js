// ─── Platform definitions ───────────────────────────────────────────────────
const platforms = [
    {
        name: 'YouTube',
        emoji: '▶️',
        color: '#ff0000',
        patterns: [
            /youtube\.com\/watch/i,
            /youtu\.be\//i,
            /youtube\.com\/shorts/i,
            /m\.youtube\.com/i
        ],
        sites: [
            {
                name: 'Y2Mate',
                sub: 'YouTube Downloader',
                icon: '⬇️',
                url: u => `https://www.y2mate.com/youtube/${extractYTId(u)}`
            },
            {
                name: 'SSYouTube',
                sub: 'Fast HD Download',
                icon: '📥',
                url: u => `https://www.ssyoutube.com/watch?v=${extractYTId(u)}`
            },
            {
                name: 'SaveFrom',
                sub: 'Multi-Quality Save',
                icon: '💾',
                url: u => `https://en.savefrom.net/#url=${encodeURIComponent(u)}`
            }
        ]
    },
    {
        name: 'Facebook',
        emoji: '📘',
        color: '#1877f2',
        patterns: [
            /facebook\.com/i,
            /fb\.watch/i,
            /fb\.com/i
        ],
        sites: [
            {
                name: 'SnapSave',
                sub: 'Facebook Downloader',
                icon: '⬇️',
                url: u => `https://snapsave.app/download?url=${encodeURIComponent(u)}`
            },
            {
                name: 'FBDown',
                sub: 'HD & SD Save',
                icon: '📥',
                url: u => `https://fbdown.net/?url=${encodeURIComponent(u)}`
            },
            {
                name: 'GetFVid',
                sub: 'Private Video Support',
                icon: '💾',
                url: u => `https://www.getfvid.com/?url=${encodeURIComponent(u)}`
            }
        ]
    },
    {
        name: 'TikTok',
        emoji: '🎵',
        color: '#ff2d55',
        patterns: [
            /tiktok\.com/i,
            /vm\.tiktok\.com/i
        ],
        sites: [
            {
                name: 'SnapTik',
                sub: 'No Watermark',
                icon: '⬇️',
                url: u => `https://snaptik.app/?url=${encodeURIComponent(u)}`
            },
            {
                name: 'SSSTik',
                sub: 'Watermark Free',
                icon: '📥',
                url: u => `https://ssstik.io/?url=${encodeURIComponent(u)}`
            },
            {
                name: 'TikMate',
                sub: 'Audio Extract too',
                icon: '🎵',
                url: u => `https://tikmate.online/?url=${encodeURIComponent(u)}`
            }
        ]
    },
    {
        name: 'Instagram',
        emoji: '📸',
        color: '#e1306c',
        patterns: [
            /instagram\.com/i,
            /instagr\.am/i
        ],
        sites: [
            {
                name: 'SnapSave',
                sub: 'Reels & Stories',
                icon: '⬇️',
                url: u => `https://snapsave.app/download?url=${encodeURIComponent(u)}`
            },
            {
                name: 'InstaDown',
                sub: 'Photo & Video',
                icon: '📥',
                url: u => `https://instadownloader.co/download?url=${encodeURIComponent(u)}`
            },
            {
                name: 'SaveIG',
                sub: 'Fast & Free',
                icon: '💾',
                url: u => `https://saveig.app/download?url=${encodeURIComponent(u)}`
            }
        ]
    },
    {
        name: 'Twitter / X',
        emoji: '🐦',
        color: '#1da1f2',
        patterns: [
            /twitter\.com/i,
            /x\.com/i,
            /t\.co/i
        ],
        sites: [
            {
                name: 'TWSave',
                sub: 'Twitter Downloader',
                icon: '⬇️',
                url: u => `https://twsave.com/?url=${encodeURIComponent(u)}`
            },
            {
                name: 'SaveTweet',
                sub: 'MP4 Download',
                icon: '📥',
                url: u => `https://www.savetweet.net/?url=${encodeURIComponent(u)}`
            },
            {
                name: 'XDown',
                sub: 'HD Quality',
                icon: '💾',
                url: u => `https://xdown.app/?url=${encodeURIComponent(u)}`
            }
        ]
    }
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractYTId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : '';
}

function detectPlatform(url) {
    for (const p of platforms) {
        if (p.patterns.some(r => r.test(url))) return p;
    }
    return null;
}

// ─── Input handler ──────────────────────────────────────────────────────────

function onInputChange(val) {
    const clearBtn = document.getElementById('clearBtn');
    const badge = document.getElementById('detectedBadge');

    // Show/hide clear button
    clearBtn.style.display = val.length > 0 ? 'block' : 'none';

    // Auto-detect platform while typing
    if (val.length > 10) {
        const p = detectPlatform(val);
        if (p) {
            badge.textContent = `${p.emoji} ${p.name} ভিডিও ডিটেক্ট হয়েছে`;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    } else {
        badge.classList.remove('show');
    }

    // Hide old results on new input
    document.getElementById('resultBox').classList.remove('show');
    document.getElementById('errorBox').classList.remove('show');
}

function clearInput() {
    const input = document.getElementById('videoLink');
    input.value = '';
    onInputChange('');
    input.focus();
}

// ─── Main download handler ───────────────────────────────────────────────────

function startDownload() {
    const url = document.getElementById('videoLink').value.trim();
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loaderText');
    const resultBox = document.getElementById('resultBox');
    const errorBox = document.getElementById('errorBox');
    const dlOptions = document.getElementById('dlOptions');
    const btn = document.getElementById('downloadBtn');

    // Empty input
    if (!url) {
        shakeBtn();
        document.getElementById('videoLink').focus();
        return;
    }

    // Reset UI
    resultBox.classList.remove('show');
    errorBox.classList.remove('show');
    dlOptions.innerHTML = '';

    // Show loader
    loader.classList.add('show');
    btn.disabled = true;
    loaderText.textContent = 'প্ল্যাটফর্ম চেক করছি...';

    setTimeout(() => {
        loaderText.textContent = 'ডাউনলোড লিংক তৈরি করছি...';
    }, 500);

    // Simulate processing (no real API needed)
    setTimeout(() => {
        loader.classList.remove('show');
        btn.disabled = false;

        const platform = detectPlatform(url);

        if (!platform) {
            showError(
                '❓ প্ল্যাটফর্ম চেনা গেল না।<br>' +
                '<span style="color:#9ca3af;font-size:11px;">' +
                'YouTube, Facebook, TikTok, Instagram বা Twitter/X লিংক দাও।<br>' +
                'লিংকটা ঠিকমতো কপি হয়েছে কিনা চেক করো।' +
                '</span>'
            );
            return;
        }

        // Build option buttons
        platform.sites.forEach(site => {
            const a = document.createElement('a');
            a.href = site.url(url);
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'dl-option';
            a.innerHTML = `
                <div class="dl-option-left">
                    <div class="dl-option-icon" style="background:${platform.color}18;">${site.icon}</div>
                    <div class="dl-option-meta">
                        <div class="dl-option-name">${site.name}</div>
                        <div class="dl-option-sub">${site.sub}</div>
                    </div>
                </div>
                <span class="dl-option-arrow">→</span>
            `;
            dlOptions.appendChild(a);
        });

        resultBox.classList.add('show');

    }, 1200);
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

function showError(html) {
    const box = document.getElementById('errorBox');
    box.innerHTML = html;
    box.classList.add('show');
}

function shakeBtn() {
    const btn = document.getElementById('downloadBtn');
    btn.style.transition = 'transform 0.08s';
    const steps = [-5, 5, -4, 4, 0];
    steps.forEach((x, i) => {
        setTimeout(() => {
            btn.style.transform = `translateX(${x}px)`;
        }, i * 80);
    });
          }
