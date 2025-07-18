const { isUtf8 } = require('buffer');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

//========== WHERE HISTORY IS STORED =====================
const HISTORY_FILE = path.join(require('os').homedir(), 'qod.json');

//=========== MAIN FUNCTION ==========================
async function main() { 
  try {
    const quote = await fetchQuote();
    await saveQuote(quote);
    console.log(
      `\n"${quote.content}" - ${quote.character.name || 'Unknown'} - ${quote.anime.name}\n`
    );
  } catch (error) {
    console.log('Error: ', error.message);
    process.exit(1);
  }
}

//============ HTTPS GET HELPER ======================

function fetchQuote() {
  return new Promise((resolve, reject) => {
    https
      .get('https://api.animechan.io/v1/quotes', (res) => {  
        let data = '';

        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(data);

            
            if (result.status !== 'success' || !Array.isArray(result.data)) {
              return reject(new Error('Invalid API response structure'));
            }

            const quotes = result.data;
            const picked = quotes[Math.floor(Math.random() * quotes.length)];

            if (
              !picked ||
              !picked.content ||
              !picked.anime?.name ||
              !picked.character?.name
            ) {
              return reject(new Error('Incomplete quote data'));
            }

            resolve(picked);
          } catch (error) {
            reject(new Error('Bad JSON FROM API'));
          }
        });
      })
      .on('error', reject);
  });
}


//============== SAVE TO qod.json =====================

async function saveQuote(quote) {
  let history = [];
  try {
    const buf = await fs.readFile(HISTORY_FILE, 'utf8');
    history = JSON.parse(buf);
  } catch (error) {
    // No existing history file — that's fine
  }
  history.unshift({ ...quote, date: new Date().toISOString() });
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// ================ ONLY RUN IF FILE IS EXECUTED DIRECTLY =============
if (require.main === module) {
  main();
}
