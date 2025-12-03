$blogsHtml = Get-Content 'c:\Users\M S I\OneDrive\Desktop\NEFEX WEBSITE\blogs.html' -Raw

# Update featured blog link
$blogsHtml = $blogsHtml -replace 'href="#"([^>]*>[\s\S]*?The Future of AI-Driven Data Analytics)', 'href="blogs/ai-driven-analytics-future.html"'

# Update blog card links
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Building Scalable Data Pipelines</h3>[\s\S]*?<a href=")#', '/building-scalable-data-pipelines.html'
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Cloud Migration Strategies[^<]*</h3>[\s\S]*?<a href=")#', '/cloud-migration-strategies.html'
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Real-Time Analytics[^<]*</h3>[\s\S]*?<a href=")#', '/real-time-analytics.html'
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Machine Learning Operations[^<]*</h3>[\s\S]*?<a href=")#', '/mlops-best-practices.html'
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Data Security in the Cloud Era</h3>[\s\S]*?<a href=")#', '/data-security-cloud-era.html'
$blogsHtml = $blogsHtml -replace '(<h3[^>]*>Modern API Design Patterns</h3>[\s\S]*?<a href=")#', '/modern-api-design.html'

Set-Content 'c:\Users\M S I\OneDrive\Desktop\NEFEX WEBSITE\blogs.html' -Value $blogsHtml -NoNewline
Write-Host 'Updated all blog links successfully'
