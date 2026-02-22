import { test } from '@playwright/test';

test('Deep Dive Analysis', async ({ page }) => {
  await page.goto('https://yucca.co.za/', { waitUntil: 'networkidle' });

  const analysis = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
    const bodyClasses = document.body.className;
    
    // Check for common animation patterns in styles
    const animatedElements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.transition !== 'all 0s ease 0s' || style.animationName !== 'none';
      })
      .slice(0, 5)
      .map(el => ({
        tag: el.tagName,
        classes: el.className,
        transition: window.getComputedStyle(el).transition,
        animation: window.getComputedStyle(el).animation
      }));

    return { scripts, bodyClasses, animatedElements };
  });

  console.log('--- Yucca Technical Analysis ---');
  console.log('Scripts:', analysis.scripts.filter(s => s));
  console.log('Body Classes:', analysis.bodyClasses);
  console.log('Animated Samples:', JSON.stringify(analysis.animatedElements, null, 2));

  // Repeat for BS Web
  await page.goto('https://www.bsweb.co/', { waitUntil: 'networkidle' });
  const bsAnalysis = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
    return { scripts };
  });
  console.log('--- BS Web Technical Analysis ---');
  console.log('Scripts:', bsAnalysis.scripts.filter(s => s));
});
