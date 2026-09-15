const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 90; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(Math.random() * 0.5).toFixed(3)}s`);
    tile.style.setProperty('--duration', `${(0.38 + Math.random() * 0.24).toFixed(3)}s`);
    grid.appendChild(tile);
  }
}

const coins = [
  ['USDT','Tether','tether','assets/coins/usdt.png'],
  ['GRAM','Gram','the-open-network','assets/coins/gram.png'],
  ['SOL','Solana','solana','assets/coins/sol.png'],
  ['TRX','TRON','tron','assets/coins/trx.png'],
  ['BTC','Bitcoin','bitcoin','assets/coins/btc.png'],
  ['ETH','Ethereum','ethereum','assets/coins/eth.png'],
  ['DOGE','Dogecoin','dogecoin','assets/coins/doge.png'],
  ['LTC','Litecoin','litecoin','assets/coins/ltc.png'],
  ['BNB','Binance Coin','binancecoin','assets/coins/bnb.png'],
  ['USDC','USD Coin','usd-coin','assets/coins/usdc.png'],
  ['XAUT','Tether Gold','tether-gold','assets/coins/xaut.png']
];
const fallback={USDT:0.9996,GRAM:0.12,SOL:99.62,TRX:0.3385,BTC:76800.44,ETH:2477.53,DOGE:0.08245,LTC:53.79,BNB:715.89,USDC:0.9998,XAUT:4336.64};
const fallbackChange={USDT:-0.02,GRAM:-2.79,SOL:-2.06,TRX:-0.36,BTC:-0.60,ETH:-1.79,DOGE:-2.67,LTC:0.28,BNB:-1.48,USDC:-0.01,XAUT:-0.27};
const list=document.querySelector('#asset-list');
function money(value){return Number(value).toLocaleString('en-US',{minimumFractionDigits:value<1?4:2,maximumFractionDigits:value<1?4:2});}
function renderMarket(data={}){if(!list)return;list.innerHTML=coins.map(([symbol,name,id,image])=>{const item=data[id]||{};const price=item.usd??fallback[symbol];const change=item.usd_24h_change??fallbackChange[symbol];return `<article class="asset-row"><div class="asset-left"><img src="${image}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='assets/p2p.svg'"><div><strong>${name}</strong><small>${symbol}</small></div></div><div class="asset-price"><strong>$${money(price)}</strong><small class="${change>=0?'rise':'fall'}">${change>=0?'↑':'↓'} ${Math.abs(change).toFixed(2)}%</small></div><div class="asset-balance"><strong>0 ${symbol}</strong><small>$0.00</small></div></article>`}).join('');}
async function updateMarket(){try{const ids=coins.map(c=>c[2]).join(',');const response=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,{cache:'no-store'});if(!response.ok)throw new Error('market');renderMarket(await response.json());}catch{renderMarket();}}
/* The old CoinGecko renderer is kept above for compatibility, but live prices below are authoritative. */

const liveCoins = [
  ['USDT','Tether','tether','assets/coins/usdt.png',null],
  ['GRAM','Gram','the-open-network','assets/coins/gram.png','GRAMUSDT'],
  ['SOL','Solana','solana','assets/coins/sol.png','SOLUSDT'],
  ['TRX','TRON','tron','assets/coins/trx.png','TRXUSDT'],
  ['BTC','Bitcoin','bitcoin','assets/coins/btc.png','BTCUSDT'],
  ['ETH','Ethereum','ethereum','assets/coins/eth.png','ETHUSDT'],
  ['DOGE','Dogecoin','dogecoin','assets/coins/doge.png','DOGEUSDT'],
  ['LTC','Litecoin','litecoin','assets/coins/ltc.png','LTCUSDT'],
  ['BNB','Binance Coin','binancecoin','assets/coins/bnb.png','BNBUSDT'],
  ['USDC','USD Coin','usd-coin','assets/coins/usdc.png','USDCUSDT'],
  ['XAUT','Tether Gold','tether-gold','assets/coins/xaut.png','XAUTUSDT']
];
let latestLiveMarket={};
function renderLiveMarket(data={}){
  if(!list)return;
  list.innerHTML=liveCoins.map(([symbol,name,id,image])=>{
    const item=data[id]||{};
    const price=Number.isFinite(item.usd)?item.usd:null;
    const change=Number.isFinite(item.usd_24h_change)?item.usd_24h_change:null;
    const priceText=price===null?'—':`$${money(price)}`;
    const changeText=change===null?'—':`${change>=0?'↑':'↓'} ${Math.abs(change).toFixed(2)}%`;
    return `<article class="asset-row"><div class="asset-left"><img src="${image}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='assets/p2p.svg'"><div><strong>${name}</strong><small>${symbol}</small></div></div><div class="asset-price"><strong>${priceText}</strong><small class="${change===null?'':(change>=0?'rise':'fall')}">${changeText}</small></div><div class="asset-balance"><strong>0 ${symbol}</strong><small>$0.00</small></div></article>`;
  }).join('');
}
async function updateLiveMarket(){
  try{
    const symbols=liveCoins.map(([,,,,symbol])=>symbol).filter(Boolean);
    const response=await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`,{cache:'no-store'});
    if(!response.ok)throw new Error('market');
    const tickers=await response.json();
    const tickerBySymbol=Object.fromEntries(tickers.map(ticker=>[ticker.symbol,ticker]));
    const data={};
    liveCoins.forEach(([symbol,,id,,binanceSymbol])=>{
      if(symbol==='USDT'){data[id]={usd:1,usd_24h_change:0};return;}
      const ticker=tickerBySymbol[binanceSymbol];
      if(!ticker)throw new Error(`missing ${symbol}`);
      data[id]={usd:Number(ticker.lastPrice),usd_24h_change:Number(ticker.priceChangePercent)};
    });
    latestLiveMarket=data;
    localStorage.setItem('cult-market-live',JSON.stringify({at:Date.now(),data}));
    renderLiveMarket(data);
  }catch{
    if(Object.keys(latestLiveMarket).length){renderLiveMarket(latestLiveMarket);return;}
    try{
      const cached=JSON.parse(localStorage.getItem('cult-market-live')||'null');
      if(cached&&Date.now()-cached.at<120000){latestLiveMarket=cached.data;renderLiveMarket(latestLiveMarket);return;}
    }catch{}
    renderLiveMarket({});
  }
}
renderLiveMarket();
updateLiveMarket();
setInterval(updateLiveMarket,30000);

document.querySelectorAll('.bottom-nav .nav-item').forEach((item) => {
  let animationTimer;
  const playNavAnimation = () => {
    window.clearTimeout(animationTimer);
    item.classList.remove('is-animating');
    void item.offsetWidth;
    item.classList.add('is-animating');
    animationTimer = window.setTimeout(() => item.classList.remove('is-animating'), 1900);
  };
  item.addEventListener('pointerdown', playNavAnimation);
  item.addEventListener('click', (event) => {
    event.preventDefault();
    const target = item.dataset.screen;
    const screen = document.querySelector(`.screen[data-screen="${target}"]`);
    if (!screen) return;
    document.querySelectorAll('.screen').forEach((view) => {
      const active = view === screen;
      view.classList.toggle('is-active', active);
      view.hidden = !active;
    });
    document.querySelectorAll('.bottom-nav .nav-item').forEach((navItem) => {
      navItem.classList.toggle('active', navItem === item);
    });
    history.replaceState(null, '', `#${target}`);
  });
});

const initialScreen = location.hash.slice(1);
if (initialScreen) {
  const initialNav = document.querySelector(`.bottom-nav .nav-item[data-screen="${initialScreen}"]`);
  if (initialNav) initialNav.click();
}

document.querySelectorAll('.actions button').forEach((button) => {
  let animationTimer;
  const playActionAnimation = () => {
    window.clearTimeout(animationTimer);
    button.classList.remove('is-animating');
    void button.offsetWidth;
    button.classList.add('is-animating');
    animationTimer = window.setTimeout(() => button.classList.remove('is-animating'), 430);
  };

  button.addEventListener('pointerdown', playActionAnimation);

  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') playActionAnimation();
  });
  button.addEventListener('focus', playActionAnimation);
});
