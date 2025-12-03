$content = Get-Content 'c:\Users\M S I\OneDrive\Desktop\NEFEX WEBSITE\blogs.html' -Raw

# Add data-category attributes to filter buttons and blog cards
$content = $content -replace '(<button[^>]*style="background: var\(--accent-cyan\)[^"]*"[^>]*>)All', '</button><script>document.currentScript.previousElementSibling.setAttribute("data-category", "all"); document.currentScript.previousElementSibling.classList.add("category-filter");</script><button style="display:none">'
$content = $content -replace '(<button[^>]*>AI\s*&\s*ML</button>)', '<button class="category-filter" data-category="ai" style="background: rgba(255,255,255,0.05); color: var(--text-light); padding: 10px 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">AI & ML</button>'
$content = $content -replace '(<button[^>]*>Data\s*Engineering</button>)', '<button class="category-filter" data-category="data" style="background: rgba(255,255,255,0.05); color: var(--text-light); padding: 10px 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">Data Engineering</button>'
$content = $content -replace '(<button[^>]*>Cloud</button>)', '<button class="category-filter" data-category="cloud" style="background: rgba(255,255,255,0.05); color: var(--text-light); padding: 10px 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">Cloud</button>'
$content = $content -replace '(<button[^>]*>Business\s*Intelligence</button>)', '<button class="category-filter" data-category="business" style="background: rgba(255,255,255,0.05); color: var(--text-light); padding: 10px 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer; transition: var(--transition-smooth);">Business Intelligence</button>'

# Add filter script before closing body tag
$filterScript = @'

    <!-- Filter Script -->
    <script>
        document.addEventListener(''DOMContentLoaded'', function() {
            // Add category-filter class and data-category to All button
            const allButton = document.querySelector(''button[style*="var(--accent-cyan)"]'');
            if (allButton && allButton.textContent.trim() === ''All'') {
                allButton.classList.add(''category-filter'');
                allButton.setAttribute(''data-category'', ''all'');
            }
            
            const filterButtons = document.querySelectorAll(''.category-filter'');
            const blogCards = document.querySelectorAll(''.card'');
            
            // Add data-category to blog cards based on their category badges
            blogCards.forEach(card => {
                const badge = card.querySelector(''span[style*="background: rgba"]'');
                if (badge) {
                    const text = badge.textContent.trim().toLowerCase();
                    if (text.includes(''ai'') || text.includes(''ml'')) {
                        card.setAttribute(''data-category'', ''ai'');
                    } else if (text.includes(''data'') || text.includes(''engineering'')) {
                        card.setAttribute(''data-category'', ''data'');
                    } else if (text.includes(''cloud'')) {
                        card.setAttribute(''data-category'', ''cloud'');
                    } else if (text.includes(''business'') || text.includes(''intelligence'')) {
                        card.setAttribute(''data-category'', ''business'');
                    } else if (text.includes(''development'')) {
                        card.setAttribute(''data-category'', ''data'');
                    } else if (text.includes(''security'')) {
                        card.setAttribute(''data-category'', ''cloud'');
                    }
                }
                card.classList.add(''blog-card'');
            });
            
            filterButtons.forEach(button => {
                button.addEventListener(''click'', function() {
                    // Update active button
                    filterButtons.forEach(btn => {
                        btn.style.background = ''rgba(255,255,255,0.05)'';
                        btn.style.color = ''var(--text-light)'';
                        btn.style.border = ''1px solid rgba(255,255,255,0.1)'';
                    });
                    
                    this.style.background = ''var(--accent-cyan)'';
                    this.style.color = ''var(--bg-dark)'';
                    this.style.border = ''none'';
                    
                    const category = this.getAttribute(''data-category'');
                    
                    // Filter blog cards
                    blogCards.forEach(card => {
                        if (category === ''all'' || card.getAttribute(''data-category'') === category) {
                            card.style.display = ''block'';
                        } else {
                            card.style.display = ''none'';
                        }
                    });
                });
            });
        });
    </script>
'@

$content = $content -replace '(\s*</body>)', "$filterScript
$1"

Set-Content 'c:\Users\M S I\OneDrive\Desktop\NEFEX WEBSITE\blogs.html' -Value $content -NoNewline
Write-Host 'Added category filter functionality'
