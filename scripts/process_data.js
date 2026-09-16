import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_DIR = path.resolve(__dirname, '../CSV DATA');
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');
const COMPANIES_OUTPUT_DIR = path.resolve(OUTPUT_DIR, 'companies');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(COMPANIES_OUTPUT_DIR)) {
  fs.mkdirSync(COMPANIES_OUTPUT_DIR, { recursive: true });
}

// Map file names to period keys and labels
const PERIOD_MAP = {
  '1. Thirty Days.csv': { key: '30d', label: '30 Days', order: 1 },
  '2. Three Months.csv': { key: '3m', label: '3 Months', order: 2 },
  '3. Six Months.csv': { key: '6m', label: '6 Months', order: 3 },
  '4. More Than Six Months.csv': { key: '6m_plus', label: '> 6 Months', order: 4 },
  '5. All.csv': { key: 'all', label: 'All Time', order: 5 },
};

// Company categorizer helper
const FAANG = new Set(['Google', 'Meta', 'Apple', 'Amazon', 'Netflix', 'Microsoft']);
const HFT_QUANT = new Set([
  'Jane Street', 'Citadel', 'Hudson River Trading', 'Two Sigma', 'Jump Trading',
  'Optiver', 'Tower Research Capital', 'DE Shaw', 'DRW', 'Akuna Capital',
  'WorldQuant', 'Squarepoint Capital', 'Point72', 'SIG', 'Graviton', 'Trexquant'
]);
const BIG_TECH = new Set([
  'Uber', 'Airbnb', 'Stripe', 'Twitter', 'X', 'ByteDance', 'TikTok', 'Snap',
  'LinkedIn', 'Adobe', 'Salesforce', 'Nvidia', 'Intel', 'Cisco', 'Oracle',
  'Snowflake', 'Databricks', 'Palantir Technologies', 'Atlassian', 'DoorDash',
  'Spotify', 'Pinterest', 'Coinbase', 'Robinhood', 'Roblox', 'OpenAI'
]);
const FINTECH = new Set([
  'PayPal', 'Square', 'Block', 'Stripe', 'Affirm', 'Brex', 'Plaid', 'Revolut',
  'Razorpay', 'CRED', 'Paytm', 'PhonePe', 'BharatPe', 'Groww', 'SoFi', 'Wise',
  'Goldman Sachs', 'Morgan Stanley', 'J.P. Morgan', 'Bank of America', 'Barclays', 'BlackRock'
]);

function getCompanyCategory(name) {
  if (FAANG.has(name)) return 'FAANG / Big Tech';
  if (HFT_QUANT.has(name)) return 'HFT & Quant';
  if (BIG_TECH.has(name)) return 'Tier 1 Tech';
  if (FINTECH.has(name)) return 'Fintech & Banking';
  return 'Enterprise & Startups';
}

// Slug generator
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Standard CSV Line Parser
function parseCSVLine(text) {
  const result = [];
  let curr = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        curr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(curr.trim());
      curr = '';
    } else {
      curr += c;
    }
  }
  result.push(curr.trim());
  return result;
}

// Acceptance rate cleaner & formatter
function formatAcceptance(val) {
  if (!val) return '50.0%';
  const clean = val.replace(/%/g, '').trim();
  const num = parseFloat(clean);
  if (isNaN(num)) return '50.0%';
  // If it's a decimal like 0.0058... or 0.58
  if (num > 0 && num < 0.1) {
    // Some CSVs have acceptance rate as a ratio multiplied down (e.g. 0.0058 -> 58.0%)
    return (num * 10000).toFixed(1) + '%';
  } else if (num >= 0.1 && num <= 1) {
    return (num * 100).toFixed(1) + '%';
  } else if (num > 1 && num <= 100) {
    return num.toFixed(1) + '%';
  }
  return '50.0%';
}

// Extract question ID from title or link if available
function extractQuestionSlug(link, title) {
  if (link && link.includes('/problems/')) {
    const parts = link.split('/problems/')[1];
    return parts.split('/')[0].replace(/[^a-z0-9-]/gi, '').toLowerCase();
  }
  return slugify(title);
}

function processAllData() {
  console.log('Starting data parsing from CSV DATA...');
  const companyDirs = fs.readdirSync(CSV_DIR).filter((dir) => {
    return fs.statSync(path.join(CSV_DIR, dir)).isDirectory();
  });

  console.log(`Found ${companyDirs.length} company directories.`);

  const companiesList = [];
  const globalProblemsMap = new Map(); // problemSlug -> Problem object
  const topicCounts = new Map(); // topicName -> count

  for (const companyName of companyDirs) {
    const companyPath = path.join(CSV_DIR, companyName);
    const companySlug = slugify(companyName) || 'company-' + Date.now();
    const files = fs.readdirSync(companyPath);

    const periodsData = {
      '30d': [],
      '3m': [],
      '6m': [],
      '6m_plus': [],
      'all': [],
    };

    const companyTopicsSet = new Map();
    const difficultyCountMap = { EASY: 0, MEDIUM: 0, HARD: 0 };
    const seenProblemsInCompany = new Set();

    for (const file of files) {
      if (!PERIOD_MAP[file]) continue;
      const periodKey = PERIOD_MAP[file].key;
      const filePath = path.join(companyPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter((l) => l.trim().length > 0);

      if (lines.length <= 1) continue;

      // Header: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
      for (let i = 1; i < lines.length; i++) {
        const parts = parseCSVLine(lines[i]);
        if (parts.length < 2) continue;

        const difficulty = (parts[0] || 'MEDIUM').toUpperCase().trim();
        const title = (parts[1] || '').trim();
        if (!title) continue;

        const frequency = parseFloat(parts[2]) || 0;
        const acceptanceRate = formatAcceptance(parts[3]);
        const link = parts[4] || `https://leetcode.com/problems/${slugify(title)}/`;
        
        let topicsRaw = parts.slice(5).join(',').replace(/^"|"$/g, '').trim();
        const topics = topicsRaw
          ? topicsRaw
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

        const probSlug = extractQuestionSlug(link, title);

        const questionObj = {
          title,
          slug: probSlug,
          difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(difficulty) ? difficulty : 'MEDIUM',
          frequency: Math.round(frequency * 10) / 10,
          acceptanceRate,
          link,
          topics,
        };

        periodsData[periodKey].push(questionObj);

        // Global and Company aggregations (using 'all' period or first time seen)
        if (!seenProblemsInCompany.has(title)) {
          seenProblemsInCompany.add(title);
          if (difficultyCountMap[questionObj.difficulty] !== undefined) {
            difficultyCountMap[questionObj.difficulty]++;
          }
          topics.forEach((t) => {
            companyTopicsSet.set(t, (companyTopicsSet.get(t) || 0) + 1);
            topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
          });
        }

        // Global problem index
        if (!globalProblemsMap.has(probSlug)) {
          globalProblemsMap.set(probSlug, {
            title,
            slug: probSlug,
            difficulty: questionObj.difficulty,
            link,
            topics,
            acceptanceRate,
            companies: [],
          });
        }

        const globalProb = globalProblemsMap.get(probSlug);
        let existingComp = globalProb.companies.find((c) => c.slug === companySlug);
        if (!existingComp) {
          existingComp = {
            name: companyName,
            slug: companySlug,
            frequency: questionObj.frequency,
            periods: [periodKey],
          };
          globalProb.companies.push(existingComp);
        } else {
          if (!existingComp.periods.includes(periodKey)) {
            existingComp.periods.push(periodKey);
          }
          if (questionObj.frequency > existingComp.frequency) {
            existingComp.frequency = questionObj.frequency;
          }
        }
      }
    }

    // Sort periods questions by frequency desc
    Object.keys(periodsData).forEach((key) => {
      periodsData[key].sort((a, b) => b.frequency - a.frequency);
    });

    const totalQuestionsAll = periodsData['all'].length > 0 
      ? periodsData['all'].length 
      : seenProblemsInCompany.size;

    // Top 5 topics for this company
    const sortedCompanyTopics = Array.from(companyTopicsSet.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([t]) => t);

    // Write individual company file
    const companyDetail = {
      name: companyName,
      slug: companySlug,
      category: getCompanyCategory(companyName),
      totalQuestions: totalQuestionsAll,
      difficultyCounts: difficultyCountMap,
      topTopics: sortedCompanyTopics,
      counts: {
        '30d': periodsData['30d'].length,
        '3m': periodsData['3m'].length,
        '6m': periodsData['6m'].length,
        '6m_plus': periodsData['6m_plus'].length,
        'all': periodsData['all'].length,
      },
      periods: periodsData,
    };

    fs.writeFileSync(
      path.join(COMPANIES_OUTPUT_DIR, `${companySlug}.json`),
      JSON.stringify(companyDetail, null, 2),
      'utf-8'
    );

    // Add to companies index (without full periods question lists for small payload)
    companiesList.push({
      name: companyName,
      slug: companySlug,
      category: companyDetail.category,
      totalQuestions: totalQuestionsAll,
      difficultyCounts: difficultyCountMap,
      topTopics: sortedCompanyTopics,
      counts: companyDetail.counts,
    });
  }

  // Sort companies alphabetically & prioritize high-volume / FAANG
  companiesList.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'companies.json'),
    JSON.stringify(companiesList, null, 2),
    'utf-8'
  );

  // Global search index array
  const globalProblemsList = Array.from(globalProblemsMap.values()).map((p) => {
    // Sort company appearances by frequency
    p.companies.sort((a, b) => b.frequency - a.frequency);
    return {
      ...p,
      companyCount: p.companies.length,
    };
  });

  // Sort global problems by company count / popularity
  globalProblemsList.sort((a, b) => b.companyCount - a.companyCount);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'global_problems.json'),
    JSON.stringify(globalProblemsList, null, 2),
    'utf-8'
  );

  // Topics index
  const topicsList = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({ topic, count }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'tags.json'),
    JSON.stringify(topicsList, null, 2),
    'utf-8'
  );

  console.log(`Processing complete!`);
  console.log(`- Companies written: ${companiesList.length}`);
  console.log(`- Global unique problems: ${globalProblemsList.length}`);
  console.log(`- Unique topic tags: ${topicsList.length}`);
}

processAllData();
